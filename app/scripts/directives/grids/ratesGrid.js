'use strict';

angular.module('ratesUiApp').directive('ratesGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'notificationService',
  'socketWatcherService',
  'feedImportService',
  'rawService',
  'aggregatedService',
  'historicalService',
  'rateSchemaService',
  '$interval',
  '$window',
  'loginService',
  '$modal',
  '$timeout',
  function ($parse, configService, $compile, storageService, constantsService, notificationService, socketWatcherService, feedImportService, rawService, aggregatedService, historicalService, rateSchemaService, $interval, $window, loginService, $modal, $timeout) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/ratesGrid.html',
      scope: {
        editable: '=editable',
        sourceUrl: '=sourceUrl',
        tableType: '=tableType',
        displayDateCriteria: '=displayDateCriteria'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {
            scope.dateFormat = 'dd/MM/yyyy';
            scope.dateOptions = {
              format: 'dd/mm/yyyy'
            };

            scope.openFrom = function ($event) {
              $event.preventDefault();
              $event.stopPropagation();
              scope.fromOpened = !scope.fromOpened;
            };

            scope.openTo = function ($event) {
              $event.preventDefault();
              $event.stopPropagation();
              scope.toOpened = !scope.toOpened;
            };


          },
          post: function postLink(scope) {
            storageService.saveObject(constantsService.getSelectedSourcesTab(), scope.tableType);
            scope.ready = false;
            // Get auth object from storage
            var auth = loginService.getLoggedinUser();
            if (!auth) {
              return;
            }

            var service;

            if (scope.tableType === 'raw') {
              service = rawService;
            } else if (scope.tableType === 'aggregated') {
              service = aggregatedService;
            } else {
              service = historicalService;

              scope.dateFrom = new Date((new Date()).valueOf() - 1000 * 3600 * 24);
              scope.dateTo = new Date();

              scope.systemDateReady = false;

              // Get system date
              if (scope.displayDateCriteria) {
                service.getSystemDate(function (success) {
                  scope.dateFrom = new Date(success.systemDate - 1000 * 3600 * 24);
                  scope.dateTo = new Date(success.systemDate);
                  scope.systemDateReady = true;
                });
              }


              var dayInms = 86400000;

              scope.schemas = [];
            }
            scope.columns = [];

            scope.changedSchema = function () {
              if (scope.tableType === 'raw') {
                storageService.saveObject(constantsService.getRawGridSettings(), scope.selectedSchema);
              }

              if (scope.tableType === 'aggregated') {
                storageService.saveObject(constantsService.getAggregatedGridSettings(), scope.selectedSchema);
              }

              if (scope.tableType === 'historical') {
                storageService.saveObject(constantsService.getHistoricalGridSettings(), scope.selectedSchema);
              }
            };

            var schemaPromise = rateSchemaService.listAll();
            schemaPromise.then(function (allSchemas) {
              scope.schemas = allSchemas;
              var selected;

              if (scope.tableType === 'raw') {
                selected = storageService.fetchObject(constantsService.getRawGridSettings());
              }

              if (scope.tableType === 'aggregated') {
                selected = storageService.fetchObject(constantsService.getAggregatedGridSettings());
              }

              if (scope.tableType === 'historical') {
                selected = storageService.fetchObject(constantsService.getHistoricalGridSettings());
              }

              if (selected) {
                scope.selectedSchema = selected;
              }

              if (!selected && allSchemas && allSchemas[0]) {
                scope.selectedSchema = allSchemas[0];

                if (!scope.dateFrom) {
                  scope.dateFrom = new Date(scope.selectedSchema.currentDate - dayInms);
                  scope.dateTo = new Date(scope.selectedSchema.currentDate - dayInms);
                }
              }
              scope.allSchemas = allSchemas;
            });

            scope.initialiseSchemeSelection = function () {
              scope.$watch('selectedSchema', function (selectedSchema) {
                if (selectedSchema && selectedSchema.id) {
                  scope.changedSchema();
                  var promise = service.findColumns(selectedSchema.id);
                  promise.then(function (columns) {
                    scope.columns = columns;
                  }, function (failure) {

                  });
                }
              });
            };

            // If it depends on date being available, then we need to refresh the results only when we get system date
            if (!scope.displayDateCriteria) {
              scope.initialiseSchemeSelection();
            }

            if (scope.displayDateCriteria) {
              scope.$watch('systemDateReady', function (valueOfSystemDate) {
                if (valueOfSystemDate) {
                  scope.initialiseSchemeSelection();
                }
              });
            }


            scope.doDownload = function () {
              $window.open(service.getDownloadLink(scope.serverQueryObject), '_self');
            };

            var idsToUpdate = [];
            var grid;

            scope.openDateFrom = function () {
              scope.opened = !scope.opened;
            };


            scope.initialiseDatpicker = function () {
              scope.minDate = '01/01/1991';
              scope.today = function () {
                scope.dt = new Date();
              };
              scope.today();
              scope.showWeeks = true;
              scope.toggleWeeks = function () {
                scope.showWeeks = !scope.showWeeks;
              };

              scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.opened = true;
              };
              scope.dateOptions = {
                'year-format': 'yyyy',
                'starting-day': 1
              };
            };

            scope.initialiseDatpicker();
            scope.processed = 0;
            scope.totalInvalid = 0;
            var updateCallback = {
              messageType: 'feedStat',
              doCallback: function (changed) {
                var totalProcessed = changed.payLoad.totalProcessed;
                var totalInvalid = changed.payLoad.totalInvalid;
                var change = false;
                if (changed.messageType === 'feedStat') {
                  if (scope.processed !== totalProcessed) {
                    scope.processed = totalProcessed;
                    change = true;
                  }

                  if (scope.totalInvalid !== totalInvalid) {
                    scope.totalInvalid = totalInvalid;
                    change = true;
                  }

                  if (change) {
                    scope.$apply();
                  }
                  change = false;
                }
              }
            };

            socketWatcherService.registerCallback('trackProcessed', updateCallback);

            scope.$on('$destroy', function () {
              socketWatcherService.removeRegisteredCallback('trackProcessed');
            });

            scope.changeCount = 0;
            var array = storageService.fetchObject(constantsService.getRawRatesToUpdate());
            if (array) {
              scope.changeCount = array.length;
            }


            scope.displayUpdateCount = function () {
              return scope.changeCount > 0;
            };

            scope.importAll = function () {
              feedImportService.importAll(function (success) {
                notificationService.sendInfo('Import started',
                  'The import of all feeds has started');
              });
            };


            var pageSize = 20;
            scope.noData = false;

            var createSymbolSource = function () {
              return new kendo.data.DataSource({
                serverFiltering: true,
                transport: {
                  read: {
                    url: configService.getHostUrl() + '/config/rateDef/prefixsearchNamed',
                    beforeSend: function (xhr, options) {
                      xhr.setRequestHeader('token', auth.token);
                    },
                    dataType: 'json'
                  },
                  parameterMap: function (data, operation) {
                    if (!data.filter) {
                      var theObj = {};
                      theObj.filterscount = 1;
                      theObj['filter0'] = {};
//                  theObj['filter0'].path = path;
                      return 'filter=' + JSON.stringify(theObj);
                    }

                    var obj = {};
                    obj.filterscount = data.filter.filters.length;
                    obj.filterscount = data.filter.filters.length;
                    for (var i = 0; i < data.filter.filters.length; i++) {
                      obj['filter' + i] = {};
                      obj['filter' + i]['value'] = data.filter.filters[i].value;
//                  obj['filter' + i]['path'] = path;
                    }
                    return 'prefix=' + obj.filter0.value + '&schemaId=' + scope.selectedSchema.id;
                  }
                }
              });
            };

            var source = createSymbolSource();
            var buildRemoteSourceWidget = function (element) {
              var obj = element.kendoComboBox({
                placeholder: 'Select',
                minLength: 2,
                filter: 'contains',
                autoBind: false,
                suggest: true,
                dataSource: source,
                filterable: {
                  extra: true,
                  operators: {
                    string: {
                      startswith: 'Starts with',
                      eq: 'Is equal to',
                      neq: 'Is not equal to'
                    }
                  }
                }
              });
              return obj;
            };

            var buildWidget = function (element, col) {
              return element.kendoComboBox({
                placeholder: 'Select',
                minLength: 2,
                filter: 'contains',
                autoBind: false,
                suggest: true,
                dataSource: col.filterValues,
                filterable: {
                  extra: true,
                  operators: {
                    string: {
                      startswith: 'Starts with',
                      eq: 'Is equal to',
                      neq: 'Is not equal to'
                    }
                  }
                }
              });
            };

            scope.$watch('columns', function (data) {
                if (grid) {
                  $('#grid').data().kendoGrid.destroy();
                  $('#grid').empty();
                }
                scope.currentColumns = data;
                if (data) {
                  if (data.length === 0) {
                    scope.noData = true;
                    return;
                  }

                  scope.ready = true;
                  var url = scope.sourceUrl;
                  var columns = [];
                  for (var i = 0; i < data.length; i++) {
                    var column = {
                      field: data[i].field,
                      title: data[i].title,
                      sortable: data[i].sortable
                    };

                    column.width = 100;

                    if (data[i].filterValues && data[i].filterValues.length > 0) {
                      column.filterValues = data[i].filterValues;
                      column.filterable = {};
                      var closure = function (col, i) {
                        col.filterable.ui = function (element) {
                          return buildWidget(element, col);
                        };
                      };
                      closure(column, i);
                    } else {
                      column.filterable = false;
                    }

                    if (data[i].field === 'symbol') {
                      column.filterable = {};
                      var closureSymbol = function (col) {
                        col.filterable.ui = function (element) {
                          return buildRemoteSourceWidget(element);
                        };
                      };
                      closureSymbol(column);
                    }

                    if (data[i].field === 'status') {
                      column.width = 85;
                      column.lockable = true;
                      column.locked = true;
                    }

                    if (data[i].field === 'symbol') {
                      column.width = 85;
                      column.lockable = true;
                      column.locked = true;
                    }
                    columns.push(column);

                  }

                  scope.rateModalOptions = {
                    backdrop: true,
                    keyboard: true,
                    backdropClick: false,
                    templateUrl: 'views/modals/rateAdjustment.html',
                    controller: 'rateAdjustmentController'
                  };

                  //scope.editRate = function (rateId, rateDefinitionId) {
                  //  scope.rateModalOptions.resolve = {
                  //    rateBundle: function () {
                  //      return {
                  //        'rateInstanceId': rateId,
                  //        'rateDefinitionId': rateDefinitionId
                  //      };
                  //    },
                  //    result: function () {
                  //
                  //    }
                  //
                  //  };
                  //
                  //  var rateModal = $modal.open(
                  //    scope.rateModalOptions
                  //  );
                  //
                  //  rateModal.result.then(function (selectedItem) {
                  //    grid.data('kendoGrid').dataSource.read();
                  //  }, function () {
                  //    grid.data('kendoGrid').dataSource.read();
                  //  });
                  //};

                  var modifyRate = function (arg1) {
                    arg1.originalEvent.preventDefault();
                    var dataItem = this.dataItem($(arg1.currentTarget).closest('tr'));
                    scope.editRate(dataItem[0].id, dataItem[0].rateDefinitionId);
                    scope.$apply();
                  };

                  // Instantiate grid
                  var dataSource = new kendo.data.DataSource({
                    serverPaging: true,
                    serverSorting: true,
                    serverFiltering: true,
                    pageSize: 20,
                    transport: {
                      read: {
                        url: scope.sourceUrl,
                        beforeSend: function (xhr, options) {
                          xhr.setRequestHeader('token', auth.token);
                        },
                        dataType: 'json'
                      },
                      parameterMap: function (data, operation) {
                        if (data.filter && data.filter.filters && data.filter.filters.length > 0) {
                          var obj = {};
                          obj.filterscount = data.filter.filters.length;
                          for (var i = 0; i < data.filter.filters.length; i++) {
                            obj['filter' + i] = {};
                            obj['filter' + i]['field'] = data.filter.filters[i].field;
                            obj['filter' + i]['value'] = data.filter.filters[i].value;
                            obj['filter' + i]['type'] = data.filter.filters[i].type;


                            // if it is a date, convert to UTC
                            if (obj['filter' + i]['type'] === 'date') {
                              obj['filter' + i]['value'] = day;
                            }


                            obj['filter' + i]['path'] = data.filter.filters[i].field;
                          }
                          data.filterData = JSON.stringify(obj);
                        }

                        if (data.sort && data.sort.length > 0) {
                          data.sortdatafield = data.sort[0].field;
                          data.sortorder = data.sort[0].dir;
                        }
                        data.schemaId = scope.selectedSchema.id;
                        var dataCop = JSON.parse(JSON.stringify(data));
                        dataCop.page = null;
                        dataCop.pageSize = null;
                        dataCop.skip = null;
                        dataCop.take = null;

                        var key = 'last_aggregated_search';
                        var dataCopStr = JSON.stringify(dataCop);
                        var prevCopStr = '' + localStorage.getItem(key);
                        localStorage.setItem(key, dataCopStr);
                        if (dataCopStr === prevCopStr) {
                          //clear the uuid
                          data.uuid = scope.searchUUID;
                        }

                        if (scope.displayDateCriteria) {
                          if (scope.dateFrom && scope.dateTo) {
                            data.dateFrom = scope.dateFrom.getTime();
                            data.dateTo = scope.dateTo.getTime();

                            // Save the date to DB for preferences
                            var dateRanges = {
                              dateFrom: scope.dateFrom.getTime(),
                              dateTo: scope.dateTo.getTime()
                            };
                          }
                        }

                        scope.serverQueryObject = data;
                        return data;
                      }
                    },
                    schema: {                               // describe the result format
                      data: function (data) {              // the data which the data source will be bound to is in the values field
                        scope.currentResults = data;
                        scope.searchUUID = data.uuid;
                        return data.results;
                      },
                      total: function (data) {
                        return data.totalResults;
                      }
                    }
                  });

                  var buildTemplate = function () {
                    var template = '<div id="toolbar" data-role="toolbar" class="k-toolbar ">' +
                      '<label class="category-label" for="category">Schema:</label>' +
                      '<input type="search" id="category" style="width: 200px"/>';

                    if (scope.displayDateCriteria) {
                      template = template +
                      '<div class="k-separator" data-overflow="auto" style="visibility: visible;">&nbsp;</div>' +
                      '<label class="category-label" for="dateFrom">Date from:</label>' +
                      '<input type="search" id="dateFrom" style="width: 150px"/>' +
                      '<div class="k-separator" data-overflow="auto" style="visibility: visible;">&nbsp;</div>' +
                      '<label class="category-label" for="dateTo">Date to:</label>' +
                      '<input type="search" id="dateTo" style="width: 150px"/>' +
                      '<div class="k-separator" data-overflow="auto" style="visibility: visible;">&nbsp;</div>' +
                      '<div><a id="downloadAsCSV" class="button-grid-right k-button k-button-icontext" > <span class=" k-icon k-i-arrow-s"></span> Download as CSV</a></div>';
                      '</div>';
                    } else {
                      template = template +
                      '<div><a id="downloadAsCSV" class="button-grid-right k-button k-button-icontext" > <span class=" k-icon k-i-arrow-s"></span> Download as CSV</a></div>';
                    }

                    //template = template +

                    return template;
                  };

                  grid = $('#grid').kendoGrid({
                    filterable: {
                      extra: false
                    },
                    filterMenuInit: function (e) {
                      var helperText = e.container.find('div:eq(1)');
                      var firstValueDropDown = e.container.find('select:eq(0)').data('kendoDropDownList');

                      setTimeout(function () {
                        helperText.hide();
                        firstValueDropDown.wrapper.hide();
                      });
                    },
                    serverSorting: true,
                    virtual: true,
                    columns: columns,
                    height: $(document).height() - 200,
                    navigatable: true,
                    selectable: 'row',
                    dataSource: dataSource,
                    toolbar: buildTemplate(),
                    resizable: true,
                    autoBind: true,
                    scrollable: true,
                    pageable: {
                      refresh: true,
                      input: true,
                      pageSizes: [20, 50, 100]
                    },
                    sortable: true,
                    dataBound: function () {
                      var ids = [];
                      for (var i = 0; i < scope.currentResults.results.length; i++) {
                        ids.push(scope.currentResults.results[i].rateDefinitionId);
                      }

                      scope.dateFrom = new Date(scope.currentResults.dateFrom);
                      scope.dateTo = new Date(scope.currentResults.dateTo);

                      // Register sockets!
                      var rateChangeNotify = {
                        doCallback: function (changed) {
                          for (var i = 0; i < scope.currentResults.results.length; i++) {
                            if (changed.payLoad.rateDefinitionId ===
                              scope.currentResults.results[i].rateDefinitionId &&
                              changed.payLoad.id === scope.currentResults.results[i].id) {
                              if (scope.tableType === 'raw' && changed.payLoad.rateType === 'raw') {

                                var add = true;
                                for (var j = 0; j < idsToUpdate.length; j++) {
                                  if (idsToUpdate[j].rateInstanceId === changed.payLoad.id) {
                                    add = false;
                                  }
                                }

                                if (add) {
                                  idsToUpdate.push({position: i, rateInstanceId: changed.payLoad.id});
                                }
                              }

                              if (scope.tableType === 'aggregated' && changed.payLoad.rateType === 'agg') {
                                idsToUpdate.push({position: i, rateInstanceId: changed.payLoad.id});
                              }
                              flash = true;
                            }
                          }
                        }
                      };

                      socketWatcherService.registerIdsToTrack('rateChangeNotify', ids, rateChangeNotify);
                      scope.$on('$destroy', function () {
                        socketWatcherService.removeRegisteredCallback('rateChangeNotify');
                      });
                      renderErrorFieldsAndIcons(grid, scope.currentResults.results);
                      $('.show-title').powerTip({
                        placement: 'e', // north-east tooltip position
                        followMouse: true
                      });

                      $('#grid').find('tr').dblclick(function () {
                        var rowDataClicked = scope.currentResults.results[($(this).index())];
                        if (rowDataClicked) {
                          var idHolder = {
                            id: rowDataClicked.id,
                            rateDefinitionId: rowDataClicked.rateDefinitionId,
                            schemaId: scope.selectedSchema.id,
                            tracker: new Date()
                          };
                          scope.rateIdHolder = idHolder;
                        }
                        scope.showDetails = true;
                      });

                      var headerObj = $(".k-grid-header-wrap table");
                      var gridObj = $(".k-grid-content table");
                      var gridObjStyle = gridObj.attr('style');

                      if (gridObjStyle) {
                        headerObj.attr('style', gridObjStyle);
                      }
                    }
                  });

                  var dropDown = $(grid).find("#category").kendoDropDownList({
                    dataTextField: 'name',
                    dataValueField: 'id',
                    autoBind: true,
                    value: scope.selectedSchema.id,
                    dataSource: {
                      type: 'json',
                      transport: {
                        read: {
                          url: configService.getHostUrl() + '/config/rateSchemaDef/listAll',
                          beforeSend: function (xhr, options) {
                            xhr.setRequestHeader('token', auth.token);
                          }
                        }
                      }
                    },
                    change: function () {
                      var value = this.value();
                      for (var i = 0; i < scope.allSchemas.length; i++) {
                        if (value === scope.allSchemas[i].id) {
                          scope.selectedSchema = scope.allSchemas[i];
                        }
                      }
                    }
                  });

                  var dateTo = $(grid).find("#dateFrom").kendoDatePicker({
                    format: 'dd/MM/yyyy',
                    value: scope.dateFrom,
                    change: function (e) {
                      var value = this.value();
                      scope.dateFrom = value;
                      scope.$apply();
                      scope.reload();
                    }
                  });

                  var dateTo = $(grid).find("#dateTo").kendoDatePicker({
                    format: 'dd/MM/yyyy',
                    value: scope.dateTo,
                    change: function (e) {
                      var value = this.value();
                      scope.dateTo = value;
                      scope.$apply();
                      scope.reload();
                    }
                  });

                  $(grid).find("#downloadAsCSV").click(function () {
                    scope.doDownload();
                  })
                }
              }
            );

            var flash = true;

            function renderColoursForRow(flash, rowData, index) {
              var field;
              var cell;
              grid.find('tr td[role=gridcell]').each(function (cellIndex) {
                if (scope.columns[cellIndex] && rowData &&
                  rowData.rateDefinitionId === scope.currentResults.results[index].rateDefinitionId) {
                  field = scope.columns[cellIndex].field;
                  var cell = $(this);
                  if (scope.columns.length > cellIndex) {
                    if (rowData.violations[field] && rowData.violations[field].violations.length > 0) {
                      cell.addClass('cell-error');
                      cell.addClass('show-title');
                      cell.attr('title', rowData.violations[field].formattedViolations);
                    } else if (rowData.violations[field]) {
                      cell.removeClass('cell-error');
                      cell.removeClass('show-title');
                    }


                    if (field === 'status' && rowData[field] === 'Violation') {
                      cell.removeClass('status-cell-valid');
                      cell.addClass('status-cell-error');
                    }

                    if (field === 'status' && rowData[field] === 'Valid') {
                      cell.removeClass('status-cell-error');
                      cell.addClass('status-cell-valid');
                    }
                  }
                }
              });
            }

            function renderColours(flash, cell, rowData, field, index) {
              if (!rowData.violations) {
                return;
              }
              if (rowData.violations[field] && rowData.violations[field].violations.length > 0) {
                cell.addClass('cell-error');
                cell.addClass('show-title');
                cell.attr('title', rowData.violations[field].formattedViolations);
              }

              if (rowData.violations[field] && !rowData.violations[field]) {
                cell.removeClass('cell-error');
                cell.removeClass('show-title');
              }

              if (field === 'status' && rowData[field] === 'Violation') {
                cell.removeClass('status-cell-valid');
                cell.addClass('status-cell-error');
              }

              if (field === 'status' && rowData[field] === 'Valid') {
                cell.removeClass('status-cell-error');
                cell.addClass('status-cell-valid');
              }

              if (field === 'status' && rowData[field] === 'Init') {
                cell.addClass('status-cell-init');
                cell.removeClass('status-cell-valid');
                cell.removeClass('status-cell-error');
              }

            }

            function renderErrorFieldsAndIcons(grid, results) {
              var rowData;
              var lockedColumnCount = 0;
              var lockedColumns = {};
              grid.find('.k-grid-content-locked tr[role=row]').each(function (index) {
                rowData = results[index];
                var field;
                var cell;
                if (rowData) {
                  // Do for locked records
                  $(this).find('td').each(function (cellIndex) {
                    //console.log(cellIndex);
                    cell = $(this);
                    if (scope.columns[cellIndex]) {
                      field = scope.columns[cellIndex].field;
                      // associative object to track unique fields that are locked
                      lockedColumns[field] = true;
                      renderColours(false, cell, rowData, field, (index - 1));
                    }
                  });
                }
              });

              // Determine how many columns are locked
              for (var property in lockedColumns) {
                lockedColumnCount++;
              }

              grid.find('.k-grid-content tr[role=row]').each(function (index) {
                rowData = results[index];
                var field;

                var cell;
                if (rowData) {
                  $(this).find('td').each(function (cellIndex) {
                    //console.log(cellIndex);
                    cell = $(this);
                    if (scope.columns[cellIndex]) {

                      // Offset the locked columns
                      field = scope.columns[cellIndex + lockedColumnCount].field;
                      renderColours(false, cell, rowData, field, (index - 1));
                    }
                  });
                }
              });
            }

            scope.feedImportModalOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: false,
              templateUrl: 'views/modals/feedInstanceModal.html',
              controller: 'feedInstanceController'
            };

            scope.importFeedDialog = function () {
              var importModal = $modal.open(scope.feedImportModalOptions);
            };

            scope.rateDefImportModalOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: false,
              templateUrl: 'views/modals/rateDefImportModal.html',
              controller: 'rateDefImportController'
            };

            scope.importRateDefDialog = function () {
              var importModal = $modal.open(scope.rateDefImportModalOptions);
            };

            var performFlash = function (rowId, flashType) {
              rowId = rowId + 1;
              if (flashType === 'invalid') {
                grid.find('tr:nth-child(' + rowId + ')').addClass('invalid');
                $timeout(function () {
                  grid.find('tr:nth-child(' + rowId + ')').removeClass('invalid');
                }, 500);
              } else if (flashType === 'valid') {
                grid.find('tr:nth-child(' + rowId + ')').addClass('valid');
                $timeout(function () {
                  grid.find('tr:nth-child(' + rowId + ')').removeClass('valid');
                }, 500);
              } else if (flashType === 'init') {
                grid.find('tr:nth-child(' + rowId + ')').addClass('init');
                $timeout(function () {
                  grid.find('tr:nth-child(' + rowId + ')').removeClass('init');
                }, 500);
              }
            };

            var flashValid = function (rowId) {
              performFlash(rowId, 'valid');
            };

            var flashInvalid = function (rowId) {
              performFlash(rowId, 'invalid');
            };

            var flashInit = function (rowId) {
              performFlash(rowId, 'init');
            };

            /**
             * Rerender a grid row
             * @param grid
             * @param updateRecord
             * @param updatedRecordIndex
             */
            function reRenderRow(parentGrid, updateRecord) {

              // Do the locked columns first
              var lockedColumns = {};
              var lockedColumnCount = 0;
              var foundIndex = -1;
              //console.log(scope.currentResults);
              for (var i = 0; i < scope.currentResults.results.length; i++) {
                if (updateRecord.id === scope.currentResults.results[i].id) {
                  foundIndex = i;
                  break;
                }
              }

              parentGrid.find('.k-grid-content-locked tr[role=row]').each(function (index) {
                var field;
                var cell;
                if (foundIndex === index) {
                  $(this).find('td').each(function (cellIndex) {
                    cell = $(this);
                    field = scope.columns[cellIndex].field;
                    cell.html(updateRecord[field]);
                    lockedColumns[field] = true;
                    if (field === 'status' && updateRecord[field] === 'Violation') {
                      cell.removeClass('status-cell-valid');
                      cell.removeClass('status-cell-init');
                      cell.addClass('status-cell-error');
                      flashInvalid(index);
                      return;
                    }

                    if (field === 'status' && updateRecord[field] === 'Valid') {
                      cell.addClass('status-cell-valid');
                      cell.removeClass('status-cell-init');
                      cell.removeClass('status-cell-error');
                      flashValid(index);
                      return;
                    }

                    if (field === 'status' && updateRecord[field] === 'Init') {
                      alert('Init');
                      cell.addClass('status-cell-init');
                      cell.removeClass('status-cell-valid');
                      cell.removeClass('status-cell-error');
                      flashInit(index);
                    }
                  });
                }
              });
              //
              for (var property in lockedColumns) {
                lockedColumnCount++;
              }

              parentGrid.find('.k-grid-content tr[role=row]').each(function (index) {
                var field;
                var cell;
                if (foundIndex === index) {
                  $(this).find('td').each(function (cellIndex) {
                    cell = $(this);
                    field = scope.columns[cellIndex + 2].field;
                    cell.html(updateRecord[field]);

                    // check if there are violations
                    if (updateRecord.violations && updateRecord.violations[field] && updateRecord.violations[field].violations.length > 0) {
                      cell.addClass('cell-error');
                      cell.addClass('show-title');
                      cell.attr('title', updateRecord.violations[field].formattedViolations);
                      $(cell).powerTip({
                        placement: 'e', // north-east tooltip position
                        followMouse: true
                      });
                      return;
                    } else {
                      cell.removeClass('cell-error');
                      cell.removeClass('show-title');
                      cell.removeAttr('title');
                      cell.removeAttr('data-title');
                      $.powerTip.destroy(cell);
                    }
                  });
                }
              });
            }

            //function removeDuplicatesArray(array, uniquenessField) {
            //  var temp = {};
            //  for (var i = 0; i < array.length; i++) {
            //    temp[array[i].uniquenessField] = array[i];
            //  }
            //  var r = [];
            //  for (var k in temp) {
            //    r.push(k);
            //  }
            //  return r;
            //}

            var timer;
            // Refresh every .5 sec
            var setupPoll = function () {
              timer = $interval(function refresh() {
                if (idsToUpdate && idsToUpdate.length > 0) {
                  var tracker = idsToUpdate.pop();
                  if (tracker) {
                    var promise = service.loadRateByIdAsArray(tracker.rateInstanceId);
                    promise.then(function (data) {
                      reRenderRow(grid, data, tracker.position);
                    }, function (failureData) {

                    });
                  }
                }
              }, 5);
            };
            setupPoll();

            scope.$on('$destroy', function () {
              if (timer) {
                $interval.cancel(timer);
              }
            });
            scope.reload = function () {
              grid.data('kendoGrid').dataSource.read();
            };
          }
        }
      }
    };
  }
])
;