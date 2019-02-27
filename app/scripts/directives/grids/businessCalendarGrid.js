'use strict';

angular.module('ratesUiApp').directive('businessCalendarGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'lookupService',
  function ($parse, configService, $compile, storageService, constantsService, lookupService) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/schemaDefinitionDictionaryGrid.html',
      scope: {
        itemsForEdit: '=itemsForEdit',
        refresh: '=refresh',
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

            var selectedDataType = '';
            var selectedDictionaryType = '';

            scope.displayUpdateCount = function () {
              return scope.changeCount > 0;
            };

            var grid;
            var pageSize = 20;
            scope.noData = false;

            if (grid) {
              $(iElement).find('.schema-dictionary-grid').data().kendoGrid.destroy();
              $(iElement).find('.schema-dictionary-grid').empty();
            }

            scope.ready = true;
            var alreadyInit = false;
            scope.$watch('refresh', function (value) {
              var insertIds = -1;
              if (!value) {
                return;
              }
              var realValue = scope.itemsForEdit;

              var columns = [];
              columns.push({
                title: 'Holiday name',
                field: 'name',
                filterable: false
              });

              columns.push({
                title: 'Date',
                field: 'dateAsObject',
                format: "{0:dd-MM-yyyy}"
              });

              columns.push({
                command: ['edit', 'destroy'],
                width: 175
              });

              var alreadyInitAddButton = false;
              var items = scope.itemsForEdit;
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
                columns: columns,
                width: '100%',
                batch: true,
                editable: 'inline',
                save: function (arg1) {
                  var model = arg1.model;
                  var updated = false;
                  for (var i = 0; i < scope.itemsForEdit.length; i++) {
                    if (model.id === scope.itemsForEdit[i].id) {
                      var updated = JSON.parse(kendo.stringify(model));
                      updated.dateAsObject = model.dateAsObject;
                      scope.itemsForEdit[i] = updated;
                      updated = true;
                    }
                  }

                  if (!updated) {
                    model.id = insertIds;
                    insertIds--;
                    scope.itemsForEdit.unshift(model);
                  }

                  scope.$apply();
                },
                cancel: function (data) {
                  grid.data('kendoGrid').dataSource.read();
                  this.refresh();
                },
                toolbar: ['create'],
                dataSource: {
                  data: items,
                  transport: {
                    read: function (o) {
                      o.success(items);
                    },
                    update: function (o) {
                      o.success();
                    },
                    destroy: function (o, o1) {
                      var found = false;
                      for (var i = 0; i < items.length; i++) {
                        if (o.data.id === items[i].id) {
                          items.splice(i, 1);
                        }
                      }
                      scope.$apply();
                      o.success();
                    },
                    save: function (o) {
                      o.success();
                    },
                    create: function (o) {
                      o.success();
                    }
                  },
                  schema: {
                    model: {
                      id: 'id',
                      fields: {
                        name: {
                          editable: true,
                          validation: {
                            required: true
                          }
                        },
                        dateAsObject: {
                          editable: true,
                          type: 'date',
                          validation: {
                            required: true
                          }
                        }
                      }
                    }
                  }
                },
                edit: function (data) {
                  return data;
                },

                resizable: false,
                scrollable: true,
                autoBind: true,
                sortable: true,
                dataBound: function () {
                  var $grid = $(this.element[0]),
                    newWidth = $grid.find('.k-grid-content').width() - 15;
                  $grid.find('.k-grid-header-wrap > table, .k-grid-content > table').css('width', newWidth);
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
              grid = $(iElement).find('.schema-dictionary-grid').kendoGrid(gridConfig);
              alreadyInit = true;
            });

            var refreshedCount = 0;
            scope.$watch('refreshTrigger', function (newVal) {
              if (scope.currentVal !== newVal && refreshedCount !== 0) {
                refreshedCount++;
                grid.data('kendoGrid').dataSource.read();
              } else if (refreshedCount === 0) {
                refreshedCount++;
              }
            });

            scope.$watch('killAndReload', function (newVal) {

            });
          }
        }
      }
    }
  }]);