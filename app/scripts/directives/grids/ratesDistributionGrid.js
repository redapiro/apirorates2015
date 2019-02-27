'use strict';

angular.module('ratesUiApp').directive('ratesDistributionGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'notificationService',
  '$modal',
  function ($parse, configService, $compile, storageService, constantsService, notificationService, $modal) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/ratesDistributionGrid.html',
      scope: {
        columns: '=columns'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {

          },
          post: function postLink(scope, iElement) {
            // Get auth object from storage
            var auth = storageService.fetchObject(constantsService.getUserAuth());
            scope.totalInvalid = 0;
            scope.currentResults;
            scope.currentColumns;

            scope.changeCount = 0;
            var source;
            scope.ready = false;

            scope.displayUpdateCount = function () {
              return scope.changeCount > 0;
            };

            var grid;
            var pageSize = 20;
            scope.noData = false;

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

            var columnFieldToPathMap = {};

            function renderErrorFieldsAndIcons(grid, results) {
              grid.find('tr[role=row]').each(function (index) {
                var rowData = results[index];
                $(this).find('td').each(function (arg) {
                  //first td is status
                  if (arg == 0) {
                    var cell = $(this);
                    if (rowData.status === 'EMPTY') {
                      cell.attr('data-title', 'EMPTY');
                      cell.attr('class', 'show-title');
                      cell.html('<i class="icon-fire icon-red"></i>');
                    } else if (rowData.status === 'PARTIAL') {
                      cell.attr('data-title', 'PARTIAL');
                      cell.attr('class', 'show-title');
                      cell.html('<i class="icon-warning-sign icon-yellow"></i>');
                    } else if (rowData.status == 'READY') {
                      cell.attr('data-title', 'READY');
                      cell.attr('class', 'show-title');
                      cell.html('<i class="icon-ok icon-green"></i>');
                    }
                  }
                });
              });
            }

            scope.$watch('columns', function (data) {
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
                    title: data[i].displayName
                  };

                  if (data[i].displayName === 'Status') {
                    column.width = '55px';
                  }

                  if (data[i].showFilter) {
                    console.log(column);
                    var obj = data[i];
                    column.filterable = {};
                    column.data = data[i];
                    column.filterValues = data[i].filterValues;
                    var staticSourced = createStaticSourcedFilter(column);
                    column.filterable.ui = function (element) {
                      return staticSourced.buildWidget(element);
                    };
                  } else {
                    column.filterable = false;
                  }

                  if (data[i].displayName === 'Action') {
                    column.command = [{
                      name: 'Source',
                      text: 'Source',
                      title: 'Source',
                      imageClass: 'k-icon k-i-pencil',
                      click: startSource,
                      className: 'span6'
                    },
                      {
                        name: 'Distribute',
                        text: 'Distribute',
                        title: 'Distribute',
                        imageClass: 'k-icon k-i-pencil',
                        click: startDistribution,
                        className: 'span6'
                      }];
                  }

                  columns.push(column);
                }

                var modifyRate = function (arg1) {
                  arg1.originalEvent.preventDefault();
                  var dataItem = this.dataItem($(arg1.currentTarget).closest("tr"));
                  scope.editRate(dataItem[0].id);
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
                      url: configService.getHost() + '/config/distributions/listAll',
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
                      return data;
                    }
                  },
                  schema: {                               // describe the result format
                    data: function (data) {              // the data which the data source will be bound to is in the values field
                      scope.currentResults = data;
                      return data;
                    },
                    total: function (data) {
                      return data.length;
                    },
                    model: model
                  }
                });

                var grid = $("#grid").kendoGrid({
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
                  height: 560,
                  dataSource: dataSource,
                  autoBind: true,
                  pageable: {
                    refresh: true,
                    input: true,
                    pageSizes: [20, 50, 100, 500]
                  },
                  sortable: true,
                  dataBound: function () {
                    renderErrorFieldsAndIcons(grid, scope.currentResults);
                  }
                });
              }
            });
          }
        }
      }
    };
  }
]);