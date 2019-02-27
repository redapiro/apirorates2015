'use strict';

angular.module('ratesUiApp').directive('crossRateHistoricalGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'notificationService',
  'socketWatcherService',
  'feedImportService',
  'crossRateHistoricalService',
  '$interval',
  '$window',
  'loginService',
  'crossRateCollectionService',
  'lookupService',
  '$modal',
  '$http',
  function ($parse, configService, $compile, storageService, constantsService, notificationService, socketWatcherService, feedImportService, crossRateHistoricalService, $interval, $window, loginService, crossRateCollectionService, lookupService, $timeout, $http) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/crossRatesHistoricalGrid.html',
      scope: {
        editable: '=editable',
        sourceUrl: '=sourceUrl',
        tableType: '=tableType',
        displayDateCriteria: '=displayDateCriteria'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {

          },
          post: function postLink(scope, iElement) {
            scope.displayGraph = false;
            function displayFromDate() {
              if (!scope.displayGraph) {
                return;
              }
              // Get from the columns all the titles
              var titles = [];
              angular.forEach(scope.columns, function (column) {
                if (column.displayName !== 'DATE') {
                  titles.push(column.displayName);
                }
              });

              var seriesOptions = [],
                seriesCounter = 0,
                names = titles,
              // create the chart when all data is loaded
                createChart = function () {
                  $('#crossRateContainer').highcharts('StockChart', {
                    rangeSelector: {
                      selected: 4
                    },

                    yAxis: {
                      labels: {
                        formatter: function () {
                          return (this.value > 0 ? ' + ' : '') + this.value;
                        }
                      },
                      plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'silver'
                      }]
                    },

                    //plotOptions: {
                    //  series: {
                    //    compare: 'percent'
                    //  }
                    //},

                    tooltip: {
                      //pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                      valueDecimals: 2
                    },

                    series: seriesOptions
                  });
                  initSelectionForId('#graphView', '#crossRateVisual');
                };


              $http.get(configService.getHostUrl() + '/rates/crossrate/plotPoints?crossRateId=' + scope.selectedCrossRateCollection.id, {}, {
                headers: {'Accept': 'application/json'}
              }).success(function (response) {
                angular.forEach(response, function (plotSeries) {
                  seriesOptions.push(plotSeries);
                });

                console.log(seriesOptions);
                createChart();
              });
            }


            storageService.saveObject(constantsService.getSelectedSourcesTab(), 'crossRateHistorical');
            scope.ready = false;
            var myNewChart;
            // Get auth object from storage
            var auth = loginService.getLoggedinUser();
            if (!auth) {
              return;
            }


            var initSelectionForId = function (element, id) {
              console.log($(element).find(id)[0]);
              $(element).find(id).removeClass('k-textbox');
              var dropDown = $(grid).find(id).kendoDropDownList({
                dataTextField: 'name',
                dataValueField: 'id',
                autoBind: true,
                value: scope.selectedCrossRateCollection.id,
                dataSource: {
                  type: 'json',
                  transport: {
                    read: {
                      url: configService.getHostUrl() + '/config/crossRateCollection/allActive',
                      beforeSend: function (xhr, options) {
                        xhr.setRequestHeader('token', auth.token);
                      }
                    }
                  }, dataBound: function (data) {
                  }
                },
                change: function () {
                  var value = this.value();
                  for (var i = 0; i < scope.crossRateCollections.length; i++) {
                    if (value === scope.crossRateCollections[i].id) {
                      scope.selectedCrossRateCollection = scope.crossRateCollections[i];
                    }
                  }

                  scope.$apply();

                }
              });
            };


            var service = crossRateHistoricalService;

            scope.selectedCrossRateCollection = {
              id: ''
            };

            scope.dateFrom = new Date((new Date()).valueOf() - 1000 * 3600 * 24);

            lookupService.getSystemDate().then(function (success) {
              scope.dateFrom = new Date(success.data.systemDate);
              scope.systemDateReady = true;
            });

            scope.format = 'dd/MM/yyyy';
            scope.serverQueryObject;
            var dayInms = 86400000;
            scope.schemas = [];


            scope.columns = [];
            scope.searchUUID;

            crossRateCollectionService.listAllActive().then(function (response) {
              scope.crossRateCollections = response;
              if (scope.crossRateCollections && scope.crossRateCollections.length > 0) {
                scope.selectedCrossRateCollection = scope.crossRateCollections[0];
              }
              if (scope.crossRateCollections && scope.crossRateCollections.length === 0) {
                scope.noData = true;
              }
            });

            scope.initialiseSchemeSelection = function () {
              scope.$watch('selectedCrossRateCollection', function (selectedCrossRate) {
                if (selectedCrossRate && selectedCrossRate.id && selectedCrossRate.id.length > 0) {
                  var promise = service.findColumns(selectedCrossRate.id);
                  promise.then(function (columns) {
                    scope.columns = columns;
                    displayFromDate();
                    if (columns.length > 0) {
                      displayFromDate();
                    }
                  }, function (failure) {
                    // FAiled to get columns
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
              })
            }


            scope.doDownload = function () {
              $window.open(service.getDownloadLink(scope.serverQueryObject), '_self');
            };

            var idsToUpdate = [];
            var grid;

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
              scope.clear = function () {
                scope.dt = null;
              };
              // Disable weekend selection
              scope.disabled = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
              };
              scope.toggleMin = function () {
                scope.minDate = ( scope.minDate ) ? null : new Date();
              };
              scope.toggleMin();
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
            scope.currentResults;
            scope.currentColumns;

            //var updateCallback = {
            //  messageType: 'feedStat',
            //  id:'feedStat',
            //  doCallback: function (changed) {
            //    if (changed.messageType === 'feedStat') {
            //      scope.processed = changed.payLoad.totalProcessed;
            //      scope.totalInvalid = changed.payLoad.totalInvalid;
            //      scope.$apply();
            //    }
            //  }
            //};
            //
            //socketWatcherService.registerCallback('trackProcessed', updateCallback);

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
                    return 'prefix=' + obj.filter0.value;
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
                      startswith: "Starts with",
                      eq: "Is equal to",
                      neq: "Is not equal to"
                    }
                  }
                }
              });
              return obj;
            };

            scope.$watch('columns', function (data) {
              if (scope.crossRateCollections && scope.crossRateCollections.length === 0) {
                scope.noData = true;
                return;
              }
              if (grid && $('#grid').data()) {
                $('#grid').data().kendoGrid.destroy();
                $('#grid').empty();
              }

              if (data && data.length === 0) {
                scope.noData = true;
                return;
              }

              scope.currentColumns = data;

              var columns = [];
              for (var i = 0; i < data.length; i++) {
                var column = {
                  field: data[i].datafield,
                  title: data[i].displayName,
                  filterable: false,
                  sortable: false
                };

                columns.push(column);
              }

              scope.rateModalOptions = {
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: 'views/modals/rateAdjustment.html',
                controller: 'rateAdjustmentController'
              };

              var buildTemplate = function () {
                var template = '<div id="toolbar" data-role="toolbar" class="k-toolbar ">' +
                  '<label class="category-label" for="crossRate">Cross rate collection:</label>' +
                  '<input type="search" id="crossRate" style="width: 200px" class="k-textbox" />' +
                  '<div class="k-separator" data-overflow="auto" style="visibility: visible;">&nbsp;</div>' +
                  '<label class="category-label" for="marketDate">Date from:</label>' +
                  '<input type="search" id="marketDate" style="width: 150px" class="k-textbox"/>' +
                  '<div class="k-separator" data-overflow="auto" style="visibility: visible;">&nbsp;</div>' +
                  '<div><a id="visual" class=" k-button k-button-icontext" > </span> Graph view</a></div>' +
                  '<div><a id="downloadAsCSV" class="button-grid-right k-button k-button-icontext" > <span class=" k-icon k-i-arrow-s"></span> Download as CSV</a></div>' +
                  '</div>';
                return template;
              };

              // Instantiate grid
              var dataSource = new kendo.data.DataSource({
                serverPaging: true,
                serverSorting: true,
                serverFiltering: false,
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
                    data.crossRateId = scope.selectedCrossRateCollection.id;
                    if (scope.dateFrom) {
                      data.dateFrom = scope.dateFrom.getTime();
                    }
                    var dataCop = JSON.parse(JSON.stringify(data));
                    dataCop.page = null;
                    dataCop.pageSize = null;
                    dataCop.skip = null;
                    dataCop.take = null;

                    var key = "last_crossrate_search";
                    var dataCopStr = JSON.stringify(dataCop);
                    var prevCopStr = "" + localStorage.getItem(key);
                    localStorage.setItem(key, dataCopStr);
                    if (dataCopStr == prevCopStr) {
                      //clear the uuid
                      data.uuid = scope.searchUUID;
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
                    return data.totalResults
                  }
                }
              });

              var isToolbarInit = false;
              grid = $('#grid').kendoGrid({
                filterable: {
                  extra: false
                },
                toolbar: buildTemplate(),
                filterMenuInit: function (e) {
                  var helperText = e.container.find("div:eq(1)");
                  var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");

                  setTimeout(function () {
                    helperText.hide();
                    firstValueDropDown.wrapper.hide();
                  });
                },
                serverSorting: true,
                virtual: true,
                columns: columns,
                height: 560,
                dataSource: dataSource,
                resizable: true,
                autoBind: true,
                scrollable: true,
                pageable: {
                  refresh: true,
                  input: true,
                  pageSizes: [20, 50, 100]
                },
                sortable: true,
                dataBound: function (e) {
                  if (!isToolbarInit) {
                    isToolbarInit = true;
                    initToolbar();
                  }
                  if (!scope.crossRateCollections || scope.crossRateCollections.length === 0) {
                    $(e.sender.wrapper)
                      .find('tbody')
                      .append('<tr class="kendo-data-row"><td class="no-data"><p class="alert alert-warning show-hide"><i class="fa fa-exclamation-triangle"></i>There are no active or defined Cross Rate Collections. They may be defined <a href = "#/configuration/rates/crossrate/collections">here</a></p></td></tr>');
                  }
                }
              });
            });

            function initToolbar() {

              initSelectionForId(grid, '#crossRate');


              $(grid).find("#marketDate").removeClass('k-textbox');
              var dateTo = $(grid).find("#marketDate").kendoDatePicker({
                format: 'dd/MM/yyyy',
                value: scope.dateFrom,
                change: function (e) {
                  var value = this.value();
                  scope.dateFrom = value;
                  scope.$apply();
                  //if (scope.selectedCrossRate && scope.selectedCrossRate.id && scope.selectedCrossRate.id.length > 0) {
                  scope.reload();
                  //}
                },
                dataBound: function () {

                }
              });
              $(grid).find("#downloadAsCSV").click(function () {
                scope.doDownload();
              });
              $(grid).find("#visual").click(function () {
                scope.displayGraph = true;
                displayFromDate();
                scope.$apply();
              });

              $(iElement).find("#dataView").click(function () {
                scope.displayGraph = false;
                scope.$apply();
              });
            }

            scope.reload = function () {
              grid.data('kendoGrid').dataSource.read();
            };

            // GRAPHS STUFF HERE
          }
        };
      }
    };
  }
])
;
