'use strict';

angular.module('ratesUiApp').directive('schemaOptionSelectorGrid', ['$parse',
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
        actionColumns: '=actionColumns',
        refreshTrigger: '=refreshTrigger',
        toolbarAction: '=toolbarAction',
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
              if (!value) {
                return;
              }
              var realValue = scope.itemsForEdit;

              var columns = [];

              function customEditor(container, options) {
                if (options.model.options.length > 0) {
                  $('<input data-option-label=" " data-selector-type=dictionaryType placeholder="Select" required  data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                      autoBind: false,
                      dataSource: {
                        data: options.model.options
                      }
                    });
                  return;
                }

                if (options.model.type === 'DATE') {
                  $('<input data-selector-type=dictionaryType required  data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDatePicker({
                      format: 'yyyy-MM-dd',
                      change: function (e) {
                        //alert(moment(kendo.toString(this.value())).format('yyyy-mm-dd'));
                        options.model.typedValue = kendo.toString(this.value(), 'yyyy-MM-dd');
                      }
                    });
                  return;
                }

                if (options.model.type === 'DECIMAL' || options.model.type === 'DOUBLE') {
                  $('<input data-selector-type=dictionaryType required  data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoNumericTextBox();
                  return;
                }

                if (options.model.type === 'INTEGER') {
                  $('<input data-selector-type=dictionaryType required  data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoNumericTextBox({});
                  return;
                }

                if (options.model.type === 'STRING') {
                  //container.append('<input data-selector-type=dictionaryType required  data-bind="value:' + options.field + '"/>');
                  $('<input class="k-textbox" data-selector-type=dictionaryType required  data-bind="value:' + options.field + '"/>').appendTo(container);
                }
              }

              columns.push({
                title: 'Dictionary Name',
                field: 'dictionaryName',
                filterable: false,
                editable: false
              });

              columns.push({
                title: 'Dictionary Type',
                field: 'dicType',
                filterable: false,
                editable: false
              });

              columns.push({
                title: 'Field Type',
                field: 'type',
                filterable: false,
                editable: false
              });

              columns.push({
                title: 'Value',
                field: 'typedValue',
                filterable: false,
                editor: customEditor
              });

              columns.push({
                command: ['edit'],
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
                  for (var i = 0; i < scope.itemsForEdit.length; i++) {
                    if (model.dictionaryId === scope.itemsForEdit[i].dictionaryId) {
                      if (model.type === 'STRING') {
                        model.typedValue = model.typedValue.trim();
                      }
                      //if(model.type  === 'DOUBLE'){
                      //  model.typedValue = parseFloat(model.typedValue.trim());
                      //}
                      //if(model.type  === 'DECIMAL'){
                      //  model.typedValue = parseFloat(model.typedValue.trim());
                      //}
                      scope.itemsForEdit[i] = JSON.parse(kendo.stringify(model));
                    }
                  }
                  scope.$apply();
                },
                cancel: function (data) {
                  grid.data('kendoGrid').dataSource.read();
                  this.refresh();
                },

                dataSource: {
                  data: items,
                  schema: {
                    model: {
                      id: 'dictionaryId',
                      fields: {
                        dictionaryName: {
                          editable: false
                        },
                        dicType: {
                          editable: false
                        },
                        type: {
                          editable: false
                        },
                        typedValue: {
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