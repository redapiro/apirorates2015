'use strict';

angular.module('ratesUiApp').directive('ratesDrillDownGrid', ['$parse',
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
  function ($parse, configService, $compile, storageService, constantsService, notificationService, socketWatcherService, feedImportService, rawService, aggregatedService, historicalService, rateSchemaService, $interval, $window, loginService, $modal) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/ratesDrillDownGrid.html',
      scope: {
        columns: '=columns',
        sourceUrl: '=sourceUrl',
        rateDefinitionId: '=rateDefinitionId',
        tableType: '=tableType',
        schemaId: '=schemaId'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {
            scope.dateForm = new Date();
            scope.dateTo = new Date();
          },
          post: function postLink(scope, iElement) {
            scope.ready = false;
            // Get auth object from storage
            var auth = loginService.getLoggedinUser();
            if (!auth) {
              return;
            }

            var service = rawService;

            scope.columns = [];
            scope.searchUUID;

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

            var pageSize = 20;
            scope.noData = false;

            scope.$watch('columns', function (data) {
              if (data && !(data.length > 0)) {
                return;
              }

              if (grid) {
                if ($('.rateDrillDown').data() && $('.rateDrillDown').data().kendoGrid) {
                  $('.rateDrillDown').data().kendoGrid.destroy();
                  $('.rateDrillDown').empty();
                }
              }
              scope.currentColumns = data;
              if (data) {
                if (data.length === 0) {
                  scope.noData = true;
                  return;
                }

                scope.ready = true;
                var columns = [];
                var column = {};
                for (var i = 0; i < data.length; i++) {
                  column = data[i];
                  if (data[i].filterValues && data[i].filterValues.length > 0) {
                    column.filterable = true;
                  } else {
                    column.filterable = false;
                  }

                  if (column.field === 'status') {
                    column.width = '55px';
                  } else {
                    column.width = '100px';
                  }

                  columns.push(column);
                }

                // Instantiate grid
                var dataSource = new kendo.data.DataSource({
                  serverPaging: true,
                  serverSorting: true,
                  serverFiltering: true,
                  pageSize: 5,
                  transport: {
                    read: {
                      url: scope.sourceUrl,
                      beforeSend: function (xhr, options) {
                        xhr.setRequestHeader('token', auth.token);
                      },
                      dataType: 'json'
                    },
                    parameterMap: function (data, operation) {
                      var getType = function (col) {
                        for (var i = 0; i < scope.currentColumns.length; i++) {
                          if (col === scope.currentColumns[i].datafield) {
                            return scope.currentColumns[i].type;
                          }
                        }
                      };

                      if (data.filter && data.filter.filters && data.filter.filters.length > 0) {
                        var obj = {};
                        obj.filterscount = data.filter.filters.length;
                        for (var i = 0; i < data.filter.filters.length; i++) {
                          obj['filter' + i] = {};
                          obj['filter' + i]['field'] = columnFieldToPathMap[data.filter.filters[i].field];
                          obj['filter' + i]['value'] = data.filter.filters[i].value;
                          obj['filter' + i]['type'] = getType(columnFieldToPathMap[data.filter.filters[i].field]);

                          // if it is a date, convert to UTC
                          if (obj['filter' + i]['type'] === 'date') {
                            var day = new Date(obj['filter' + i]['value']).toISOString();
                            obj['filter' + i]['value'] = day;
                          }


                          obj['filter' + i]['path'] = columnFieldToPathMap[data.filter.filters[i].field];
                        }
                        data.filterData = JSON.stringify(obj);
                      }

                      if (data.sort && data.sort.length > 0) {
                        data.sortdatafield = columnFieldToPathMap[data.sort[0].field];
                        data.sortorder = data.sort[0].dir;
                      }
                      data.schemaId = scope.schemaId;
                      data.rateDefinitionId = scope.rateDefinitionId;
                      var dataCop = JSON.parse(JSON.stringify(data));
                      dataCop.page = null;
                      dataCop.pageSize = null;
                      dataCop.skip = null;
                      dataCop.take = null;

                      var key = "last_aggregated_search";
                      var dataCopStr = JSON.stringify(dataCop);
                      var prevCopStr = '' + localStorage.getItem(key);
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

                grid = $('.rateDrillDown').kendoGrid({
                  filterable: {
                    extra: false
                  },
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
                  height: 500,
                  navigatable: true,
                  selectable: true,
                  dataSource: dataSource,
                  resizable: true,
                  autoBind: true,
                  pageable: {
                    refresh: true,
                    input: true,
                    pageSizes: [5, 10]
                  },
                  sortable: true,
                  dataBound: function () {
                    //var gridContent = this.element.find('.k-grid-content');
                    //if (this.dataSource.totalPages() < 20 ) {
                    //  gridContent.css('height', gridContent.height() + this.pager.element.innerHeight());
                    //  this.pager.element.hide();
                    //}
                    //else {
                    //  this.pager.element.show();
                    //  gridContent.css('height', gridContent.height() - this.pager.element.innerHeight());
                    //}
                  }
                });
              }
            });

            scope.$on('destroyDrillDownGrid', function () {
              if ($('.rateDrillDown').data() && $('.rateDrillDown').data().kendoGrid) {
                $('.rateDrillDown').data().kendoGrid.destroy();
                $('.rateDrillDown').empty();
              }
            });

            scope.$on('$destroy', function () {
              if ($('.rateDrillDown').data() && $('.rateDrillDown').data().kendoGrid) {
                $('.rateDrillDown').data().kendoGrid.destroy();
                $('.rateDrillDown').empty();
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