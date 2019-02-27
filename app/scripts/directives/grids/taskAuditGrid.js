'use strict';

angular.module('ratesUiApp').directive('taskAuditGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  function ($parse, configService, $compile, storageService, constantsService) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/simpleGrid.html',
      scope: {
        columns: '=columns',
        datasourceUrl: '=datasourceUrl',
        logColumns: '=logColumns',
        //actionColumns: '=actionColumns',
        refreshTrigger: '=refreshTrigger',
        toolbarAction: '=toolbarAction',
        gridTitle: '=gridTitle'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {

          },
          post: function postLink(scope, iElement, attrs) {
            var auth = storageService.fetchObject(constantsService.getUserAuth());
            var grid;
            scope.totalInvalid = 0;
            scope.changeCount = 0;
            var source;
            scope.ready = false;

            scope.displayUpdateCount = function () {
              return scope.changeCount > 0;
            };

            var grid;
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
                      return 'filter=' + JSON.stringify(theObj);
                    }

                    var obj = {};
                    obj.filterscount = data.filter.filters.length;
                    obj.filterscount = data.filter.filters.length;
                    for (var i = 0; i < data.filter.filters.length; i++) {
                      obj['filter' + i] = {};
                      obj['filter' + i]['value'] = data.filter.filters[i].value;
                    }
                    return 'prefix=' + obj.filter0.value;
                  }
                }
              });
            };

            var buildRemoteSourceWidget = function (element) {
              var obj = element.kendoComboBox({
                placeholder: 'Select',
                minLength: 2,
                filter: 'contains',
                autoBind: false,
                suggest: true,
                dataSource: createSymbolSource(),
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

            var createStaticSourcedFilter = function (path) {
              var source = path.filterValues;

              return {
                buildWidget: function (element) {
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
                }
              }
            };

            var buildToolbarTemplate = function () {
              if (!scope.toolbarAction) {
                return '';
              }
              var template = '<div id="toolbar" data-role="toolbar" class="k-toolbar ">' +
                '<div class="k-separator" data-overflow="auto" style="visibility: visible;">&nbsp;</div>' +
                '<div><a id="toolbarAction" class="k-button k-button-icontext" > <span class=" k-icon k-add"></span>' + scope.toolbarAction.title + '</a></div>' +
                '<div class="k-separator" data-overflow="auto" style="visibility: visible;">&nbsp;</div>' +
                '</div>';
              return template;
            };

            var columnFieldToPathMap = {};

            scope.$watch('columns', function (data) {

              if (grid) {
                $(iElement).find('.simple-grid').data().kendoGrid.destroy();
                $(iElement).find('.simple-grid').empty();
              }

              scope.currentColumns = data;
              if (data) {
                if (data.length === 0) {
                  scope.noData = true;
                  return;
                }

                scope.ready = true;
                var columns = [];
                var model = {};
                model.fields = {};

                var startSource = function (arg1) {
                  arg1.originalEvent.preventDefault();
                  scope.sourcingTriggered = true;
                  scope.distributionTriggered = false;
                  scope.$apply();
                };

                var startDistribution = function (arg1) {
                  arg1.originalEvent.preventDefault();
                  scope.sourcingTriggered = false;
                  scope.distributionTriggered = true;
                  scope.$apply();
                };

                for (var i = 0; i < data.length; i++) {
                  var column = {
                    field: data[i].datafield,
                    title: data[i].displayName,
                    sortable: data[i].sortable,
                    filterable: false
                  };

                  if (data[i].type === 'BOOLEAN') {
                    column.template = '<input type="checkbox" #= ' + data[i].datafield + ' ? "checked=checked" : "" #  onclick="return false"></div>'
                  }

                  if (data[i].datafield === 'symbol' && data[i].showFilter) {
                    column.filterable = {};
                    var closureSymbol = function (col) {
                      col.filterable.ui = function (element) {
                        return buildRemoteSourceWidget(element);
                      };
                    };
                    closureSymbol(column);
                  }


                  if (data[i].showFilter && data[i].datafield !== 'symbol') {
                    column.filterable = {};
                    column.data = data[i];
                    column.filterValues = data[i].filterValues;
                    var closure = function (column) {
                      var staticSourced = createStaticSourcedFilter(column);
                      column.filterable.ui = function (element) {
                        return staticSourced.buildWidget(element);
                      };
                    };
                    closure(column);
                  }
                  columns.push(column);
                }

                scope.currentVal = {};
                var refreshedCount = 0;
                scope.$watch('refreshTrigger', function (newVal) {
                  if (scope.currentVal !== newVal && refreshedCount !== 0) {
                    refreshedCount++;
                    grid.data('kendoGrid').dataSource.read();
                  } else if (refreshedCount === 0) {
                    refreshedCount++;
                  }
                });

                var detailInit = function (e) {
                  var detailRow = e.detailRow;
                  console.log(detailRow);
                  detailRow.find(".tabstrip").kendoTabStrip({
                    animation: {
                      open: {effects: "fadeIn"}
                    }
                  });

                  var data = scope.logColumns;
                  var columns = [];
                  var model = {};
                  model.fields = {};

                  for (var i = 0; i < data.length; i++) {
                    var column = {
                      field: data[i].datafield,
                      title: data[i].displayName,
                      sortable: data[i].sortable,
                      filterable: false
                    };

                    if (data[i].type === 'BOOLEAN') {
                      column.template = '<input type="checkbox" #= ' + data[i].datafield + ' ? "checked=checked" : "" #  onclick="return false"></div>'
                    }

                    if (data[i].showFilter) {
                      column.filterable = {};
                      column.data = data[i];
                      column.filterValues = data[i].filterValues;
                      var closure = function (column) {
                        var staticSourced = createStaticSourcedFilter(column);
                        column.filterable.ui = function (element) {
                          return staticSourced.buildWidget(element);
                        };
                      };
                      closure(column);
                    }
                    columns.push(column);
                  }

                  function displayNoResultsFound() {
                    var grid = $(detailGrid);
                    // Get the number of Columns in the grid
                    var dataSource = grid.data('kendoGrid').dataSource;
                    var colCount = columns.length;

                    // If there are no results place an indicator row
                    if (dataSource._view.length == 0) {
                      grid.find('.k-grid-content tbody')
                        .append('<tr class="kendo-data-row"><td colspan="' + colCount + '" style="text-align:center"><b>No logs for this task audit</b></td></tr>');
                    }

                    // Get visible row count
                    var rowCount = grid.find('.k-grid-content tbody tr').length;

                    // If the row count is less that the page size add in the number of missing rows
                    if (rowCount < dataSource._take) {
                      var addRows = dataSource._take - rowCount;
                      for (var i = 0; i < addRows; i++) {
                        grid.find('.k-grid-content tbody').append('<tr class="kendo-data-row"><td>&nbsp;</td></tr>');
                      }
                    }
                  }

                  var detailGrid = detailRow.find('.logs').kendoGrid({
                    dataSource: {
                      schema: {                               // describe the result format
                        data: function (data) {              // the data which the data source will be bound to is in the values field
                          scope.currentResults = data;
                          return data.results;
                        },
                        total: function (data) {
                          return data.totalResults;
                        }
                      },
                      serverPaging: true,
                      serverSorting: true,
                      serverFiltering: true,
                      scrollable: true,
                      pageSize: 5,
                      transport: {
                        read: {
                          url: configService.getHost() + '/system/log/filter?rootTaskId=' + e.data.rootUuid,
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
                              obj['filter' + i]['path'] = data.filter.filters[i].field;
                              obj['filter' + i]['value'] = data.filter.filters[i].value;
                              obj['filter' + i]['type'] = data.filter.filters[i].operator;

                              // if it is a date, convert to UTC

                              if (obj['filter' + i]['type'] === 'date') {
                                var day = new Date(obj['filter' + i]['value']).toISOString();
                                obj['filter' + i]['value'] = day;
                              }
                            }
                            data.filterData = JSON.stringify(obj);
                          }
                          //
                          //if (data.sort && data.sort.length > 0) {
                          //  data.sortdatafield = columnFieldToPathMap[data.sort[0].field];
                          //  data.sortorder = data.sort[0].dir;
                          //}
                          return data;
                        }
                      }
                    },
                    scrollable: true,
                    sortable: true,
                    pageable: true,
                    columns: columns,
                    height: 200,
                    resizable: true,

                    autoBind: true,
                    dataBound: function () {
                      var $grid = $(this.element[0]);
                      displayNoResultsFound($grid);
                    }
                  });
                };

                // Instantiate grid type
                var dataSource = new kendo.data.DataSource({
                  serverPaging: true,
                  serverSorting: true,
                  serverFiltering: true,
                  pageSize: 20,
                  transport: {
                    read: {
                      url: scope.datasourceUrl,
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
                          obj['filter' + i]['path'] = data.filter.filters[i].field;
                          obj['filter' + i]['value'] = data.filter.filters[i].value;
                          obj['filter' + i]['type'] = data.filter.filters[i].operator;

                          // if it is a date, convert to UTC

                          if (obj['filter' + i]['type'] === 'date') {
                            var day = new Date(obj['filter' + i]['value']).toISOString();
                            obj['filter' + i]['value'] = day;
                          }
//                        obj['filter' + i]['path'] = columnFieldToPathMap[data.filter.filters[i].field];
                        }
                        data.filterData = JSON.stringify(obj);
                      }

                      if (data.sort && data.sort.length > 0) {
                        data.sortdatafield = columnFieldToPathMap[data.sort[0].field];
                        data.sortorder = data.sort[0].dir;
                      }
                      return data;
                    }
                  },
                  schema: {                               // describe the result format
                    data: function (data) {              // the data which the data source will be bound to is in the values field
                      scope.currentResults = data;
                      return data.results;
                    },
                    total: function (data) {
                      return data.totalResults;
                    },
                    model: model
                  }
                });
                var isToolbarInit = false;
                var gridConfig = {
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
                  toolbar: buildToolbarTemplate(),
                  columns: columns,
                  height: $(document).height() - 200,
                  dataSource: dataSource,
                  resizable: true,
                  detailInit: detailInit,
                  detailTemplate: '<div class="tabstrip"><ul><li class="k-state-active">Log Messages</li></ul><div><div class="logs"></div></div></div>',
                  scrollable: true,
                  autoBind: true,
                  sortable: true,
                  dataBound: function () {
                    var $grid = $(this.element[0]),
                      newWidth = $grid.find('.k-grid-content').width() - 15;
                    $grid.find('.k-grid-header-wrap > table, .k-grid-content > table').css('width', newWidth);

                    if (!isToolbarInit) {
                      isToolbarInit = true;
                      initToolbar();
                    }

                    var dataSource = this.dataSource;
                    this.element.find('tr.k-master-row').each(function() {
                      var row = $(this);
                      var data = dataSource.getByUid(row.data('uid'));

                      // this example will work if ReportId is null or 0 (if the row has no details)
                      if (!data.get('hasLogs')) {
                        row.find('.k-hierarchy-cell a').css({ opacity: 0.2, cursor: 'default' }).click(function(e) { e.stopImmediatePropagation(); return false; });
                      }
                    });
                  }
                };

                var setPageable = function () {
                  gridConfig.pageable = {
                    refresh: true,
                    input: true,
                    pageSizes: [20, 50, 100, 500]
                  }
                };

                if (typeof attrs.paginated === 'string') {
                  try {
                    var paginatedSet = JSON.parse(attrs.paginated.toLowerCase());
                    if (paginatedSet) {
                      setPageable();
                    }
                  } catch (error) {
                    // ignore, do nothing
                    setPageable();
                  }
                } else {
                  // Default to pageable
                  setPageable();
                }

                if (typeof attrs.pixelHeight === 'string') {
                  try {
                    var height = parseInt(attrs.pixelHeight);
                    if (height > 0) {
                      gridConfig.height = height;
                    }
                  } catch (error) {
                    // set to optimum full screen size
                    gridConfig.height = 560;
                  }
                }
                grid = $(iElement).find('.simple-grid').kendoGrid(gridConfig);
              }

              function initToolbar() {
                $(grid).find("#toolbarAction").click(function () {
                  scope.toolbarAction.action();
                  scope.$apply();
                });
              }
            });
          }
        }
      }
    };
  }
]);