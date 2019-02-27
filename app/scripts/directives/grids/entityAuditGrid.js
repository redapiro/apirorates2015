'use strict';

angular.module('ratesUiApp').directive('entityAuditGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'notificationService',
  '$location',
  function ($parse, configService, $compile, storageService, constantsService, notificationService, $location) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/entityAuditGrid.html',
      scope: {
        columns: '=columns',
        taskuuid: '=taskuuid'
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
                      startswith: "Starts with",
                      eq: "Is equal to",
                      neq: "Is not equal to"
                    }
                  }
                }
              });
            };

            var columnFieldToPathMap = {};

            scope.$watch('columns', function (data) {
              scope.currentColumns = data;
              if (data) {
                if (data.length === 0) {
                  return;
                  scope.noData = true;
                }

                scope.ready = true;
                var columns = [];
                var model = {};
                model.fields = {};

                for (var i = 0; i < data.length; i++) {
                  columnFieldToPathMap[data[i].datafield] = data[i].datafield;
                  var column = {
                    field: data[i].datafield,
                    title: data[i].displayName
                  };

                  if (data[i].showFilter) {
                    var obj = data[i];
                    column.filterable = {};
                    column.data = data[i];
                    column.filterValues = data[i].filterValues;
                    var cloz = function (col, i) {
                      col.filterable.ui = function (element) {
                        return buildWidget(element, col);
                      }
                    };
                    cloz(column, i);
                  } else {
                    column.filterable = false;
                  }
                  columns.push(column);
                }

                var showEntity = function (arg1) {
                  arg1.originalEvent.preventDefault();
                  var dataItem = this.dataItem($(arg1.currentTarget).closest("tr"));
                  $location.path('/audit/detailedAudit').search({'reference': dataItem.reference});
                  scope.$apply();
                };


                columns.push(
                  {
                    command: [
                      {
                        name: 'View',
                        text: 'View',
                        title: 'View',
                        imageClass: 'k-icon k-i-pencil',
                        click: showEntity,
                        className: 'full-width'
                      }
                    ]
                  });

                // Instantiate grid
                var dataSource = new kendo.data.DataSource({
                  serverPaging: true,
                  serverSorting: false,
                  serverFiltering: true,
                  pageSize: 20,
                  transport: {
                    read: {
                      url: configService.getHost() + '/entityaudit/entity/search',
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

                      if (scope.taskuuid) {
                        data.taskUUID = scope.taskuuid;
                      }
                      return data;
                    }
                  },
                  schema: {                               // describe the result format
                    data: function (data) {              // the data which the data source will be bound to is in the values field
                      scope.currentResults = data;
                      return data.entities;
                    },
                    total: function (data) {
                      return data.total;
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
                  serverSorting: false,
                  virtual: true,
                  columns: columns,
                  height: 560,
                  dataSource: dataSource,
//                  resizable: true,
                  autoBind: true,
                  pageable: {
                    refresh: true,
                    input: true,
                    pageSizes: [20, 50, 100, 500]
                  },
                  sortable: false,
                  dataBound: function () {
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