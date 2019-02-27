'use strict';

angular.module('ratesUiApp').directive('rateDefsGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'notificationService',
  'socketWatcherService',
  'loginService',
  '$modal',
  function ($parse, configService, $compile, storageService, constantsService, notificationService, socketWatcherService,
            loginService, $modal) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/rateDefsGrid.html',
      scope: {
        columns: '=columns',
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
            storageService.saveObject(constantsService.getSelectedSourcesTab(), scope.tableType);

            // Get auth object from storage
            var auth = loginService.getLoggedinUser();
            if (!auth) {
              return;
            }
            scope.totalInvalid = 0;
            scope.currentResults;
            scope.currentColumns;

            scope.changeCount = 0;
            var source;
            var array = storageService.fetchObject(constantsService.getRawRatesToUpdate());
            if (array) {
              scope.changeCount = array.length;
            }
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

            scope.$watch('columns', function (data) {
              console.log(data);
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
                  var column = {
                    field: data[i].datafield,
                    title: data[i].displayName
                  };

                  if (data[i].showFilter) {
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
                  columns.push(column);
                }

                //TODO fix this up
                scope.rateSchemaDefModalOptions = {
                  backdrop: true,
                  keyboard: true,
                  backdropClick: false,
                  templateUrl: 'views/modals/viewRateSchemaDefModal.html',
                  controller: 'viewRateSchemaDefModalController'
                };

                scope.viewRateSchemaDefModal = function (schemaDefId) {
                  scope.rateSchemaDefModalOptions.resolve = {
                    schemaDefId: function () {
                      return schemaDefId;
                    },
                    result: function () {

                    }
                  };

                  var schemaModal = $modal.open(
                    scope.rateSchemaDefModalOptions
                  );

                  console.log(schemaModal);

                  schemaModal.result.then(function (selectedItem) {
                    grid.data('kendoGrid').dataSource.read();
                  }, function () {
                    grid.data('kendoGrid').dataSource.read();
                  });

                };

                var displayRateSchemaDef = function (arg1) {
                  arg1.originalEvent.preventDefault();
                  var dataItem = this.dataItem($(arg1.currentTarget).closest("tr"));
                  console.log(dataItem);
                  scope.viewRateSchemaDefModal(dataItem.schemaId);
                  scope.$apply();
                };

                columns.push(
                  {
                    command: [{
                      name: 'View',
                      text: 'View',
                      title: 'View',
                      imageClass: 'k-icon k-i-pencil',
                      click: displayRateSchemaDef,
                      className: 'full-width'
                    }]
                  }
                );

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
                      return data.entities;
                    },
                    total: function (data) {
                      return data.total;
                    },
                    model: model
                  }
                });

                console.log(columns);

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
//                    resizable: true,
                  autoBind: true,
                  pageable: {
                    refresh: true,
                    input: true,
                    pageSizes: [20, 50, 100, 500]
                  },
                  sortable: true,
                  dataBound: function () {

                    //TODO : custom row
                    /*                        grid.find('tr[role=row]').each(function (index, dom) {
                     var rowData = scope.currentResults.results[index];
                     $(this).find('td').each(function(arg1){
                     var cell = $(this);
                     var cellData = rowData[arg1];
                     if(!cellData) {
                     if(rowData[0] &&
                     rowData[0].field === 'rateStatus' &&
                     rowData[0].value === 'VIOLATION') {
                     cell.find("a").show();
                     return;
                     }else{
                     cell.find("a").hide();
                     return;
                     }
                     }

                     if (!cellData.valid){
                     cell.addClass('cell-error');
                     }

                     if(cellData.violations.length > 0){
                     cell.addClass('show-title');
                     cell.attr('data-title', cellData.violations[0]);
                     }

                     if(cellData.field === 'rateStatus') {
                     if(cellData.value === 'VIOLATION'){
                     cell.html('<td role="gridcell" class="show-title" data-title="VIOLATION"><i class="icon-warning-sign icon-red"></i></td>');
                     }else{
                     cell.html('<td role="gridcell" class="show-title" data-title="VALID"><i class="icon-ok icon-green"></i></td>');
                     }
                     }
                     });
                     });*/
                  }
                });
              }
            });

          }
        };
      }
    };
  }
]);

