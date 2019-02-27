'use strict';

angular.module('ratesUiApp').directive('detailedAuditGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'notificationService',
  '$modal',
  function ($parse, configService, $compile, storageService, constantsService, notificationService, $modal) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/detailedAuditGrid.html',
      scope: {
        columns: '=columns',
        'reference': '='
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

            scope.$watch('columns', function (columnData) {
              if (!columnData.entityColumns || !columnData.diffColumns) {
                scope.noData = true;
                return;
              }
              scope.noData = false;
              var data = columnData.entityColumns;
              scope.currentEntityColumns = columnData.entityColumns;
              scope.currentDiffColumns = columnData.diffColumns;

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

                scope.fullEntityModalOptions = {
                  backdrop: true,
                  keyboard: true,
                  backdropClick: false,
                  templateUrl: 'views/modals/fullEntityAuditModal.html',
                  controller: 'fullEntityAuditController'
                };

                scope.showFullEntityModal = function () {
                  scope.fullEntityModalOptions.resolve = {
                    referenceId: function () {
                      return dataItem;
                    },
                    result: function () {

                    }
                  };
                  var theModal = $modal.open(
                    scope.fullEntityModalOptions
                  );
                  theModal.result.then(function (selectedItem) {

                  }, function () {

                  });
                };
                scope.$apply();
                scope.showFullEntityModal();
              };

              // Instantiate grid
              var dataSource = new kendo.data.DataSource({
//                  serverPaging: true,
                serverSorting: false,
                serverFiltering: true,
//                  pageSize: 20,
                transport: {
                  read: {
                    url: configService.getHost() + '/audit/detailed/data',
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

                    if (scope.reference) {
                      data.reference = scope.reference;
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
                detailInit: detailInit,
                autoBind: true,
//                  pageable: {
//                    refresh: true,
//                    input: true,
//                    pageSizes: [20, 50, 100, 500]
//                  },
                sortable: false,
                dataBound: function () {
                }
              });

              function detailInit(e) {
                console.log(e);
                // build columns

                var diffColumns = [];
                for (var i = 0; i < columnData.diffColumns.length; i++) {
                  columnFieldToPathMap[columnData.diffColumns[i].datafield] = columnData.diffColumns[i].datafield;
                  var column = {
                    field: columnData.diffColumns[i].datafield,
                    title: columnData.diffColumns[i].displayName
                  };
                  column.filterable = false;
                  diffColumns.push(column);
                }


                $("<div/>").appendTo(e.detailCell).kendoGrid({
                  dataSource: {
                    data: e.data.diffEntries
//                    transport: {
//                      read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
//                    },
//                    serverPaging: false,
//                    serverSorting: false,
//                    serverFiltering: false,
//                    pageSize: 5,
//                    filter: { field: "EmployeeID", operator: "eq", value: e.data.EmployeeID }
                  },
                  scrollable: false,
                  sortable: true,
//                  pageable: true,
                  columns: diffColumns
                });
              }
            });
          }
        }
      }
    };
  }
]);