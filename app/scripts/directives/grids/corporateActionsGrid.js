'use strict';

angular.module('ratesUiApp').directive('corporateActionsGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'approvalsService',
  'notificationService',
  'corporateActionsService',
  '$modal',
  function ($parse, configService, $compile, storageService, constantsService, approvalsService, notificationService,
            corporateActionsService,
            $modal) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/corporateActionsGrid.html',
      scope: {
        columns: '=columns'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {

          },
          post: function postLink(scope, iElement, attrs) {
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

            var columnFieldToPathMap = {};

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

                for (var i = 0; i < data.length; i++) {
                  var column = {
                    field: data[i].datafield,
                    title: data[i].displayName
                  };

                  if (data[i].displayName === 'Status') {
                    column.width = '55px';
                  }

                  column.filterable = false;
                  columns.push(column);
                }

                scope.corprateActionsModal = {
                  backdrop: true,
                  keyboard: true,
                  backdropClick: false,
                  templateUrl: 'views/modals/corporateActionsModal.html',
                  controller: 'corporateActionsModalController'
                };

                scope.modifyCorporateAction = function (id) {
                  scope.corprateActionsModal.resolve = {
                    bundle: function () {
                      return {
                        'id': id
                      };
                    },
                    result: function () {
                    }
                  };

                  var rateModal = $modal.open(
                    scope.corprateActionsModal
                  );
                  rateModal.result.then(function (selectedItem) {
                    grid.data('kendoGrid').dataSource.read();
                  }, function () {
                    grid.data('kendoGrid').dataSource.read();
                  });
                };


                var viewChange = function (arg1) {
                  arg1.originalEvent.preventDefault();
                  var dataItem = this.dataItem($(arg1.currentTarget).closest("tr"));
                  scope.modifyCorporateAction(dataItem.id);
                  scope.$apply();
                };

                columns.push(
                  {
                    command: [
                      {
                        name: 'Edit',
                        text: 'View',
                        title: 'Edit',
                        imageClass: 'k-icon k-i-pencil',
                        click: viewChange,
                        className: 'full-width'
                      }
                    ]
                  });

                // Instantiate grid type
                var url = configService.getHost() + '/corporateActions/search';
                var dataSource = new kendo.data.DataSource({
                  serverPaging: true,
                  serverSorting: true,
                  serverFiltering: true,
                  pageSize: 20,
                  transport: {
                    read: {
                      url: url,
                      beforeSend: function (xhr, options) {
                        xhr.setRequestHeader('token', auth.token);
                      },
                      dataType: 'json'
                    },
                    parameterMap: function (data) {
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