'use strict';

angular.module('ratesUiApp').directive('editCrossRateCollectionGrid', ['$parse',
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
        markets: '=markets',
        gridTitle: '=gridTitle'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {

          },
          post: function postLink(scope, iElement, attrs) {
            var auth = storageService.fetchObject(constantsService.getUserAuth());
            var grid;
            var editedItem = {};
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

              function marketEditor(container, options) {
                editedItem = options.model;
                angular.forEach(scope.markets, function (market) {
                  if (editedItem.editData.market === market.name) {
                    editedItem.editData.newMarket = market;
                  }
                });

                $('<input data-option-label=" " data-selector-type=market data-value-field="id"  data-text-field="name" required  data-bind="value:market"/>')
                  .appendTo(container)
                  .kendoDropDownList({
                    autoBind: false,
                    dataSource: {
                      data: scope.markets
                    },
                    dataBound: function (value) {

                    },
                    change: function (change) {
                      var newValue = change.sender._selectedValue;

                      angular.forEach(scope.markets, function (market) {
                        if (newValue === market.id) {
                          editedItem.editData.newMarket = market;
                          var kendoComboSites = change.sender.element.closest('tr').find('[data-selector-type=symbol]').data('kendoComboBox');
                          kendoComboSites.value(null);
                          kendoComboSites.dataSource.read();
                          kendoComboSites.refresh();

                          var atrributeCombo = change.sender.element.closest('tr').find('[data-selector-type=attribute]').data('kendoDropDownList')
                          atrributeCombo.value(null);
                          atrributeCombo.dataSource.read();
                          atrributeCombo.refresh();
                        }
                      });
                    }
                  });


              }

              function buildParameterMap(data, options) {
                var prefix = '';
                if (!data.filter || data.filter.filters.length === 0) {
                  prefix = prefix + editedItem.editData.symbol;
                } else {
                  var obj = {};
                  obj.filterscount = data.filter.filters.length;
                  obj.filterscount = data.filter.filters.length;
                  for (var i = 0; i < data.filter.filters.length; i++) {
                    obj['filter' + i] = {};
                    obj['filter' + i]['value'] = data.filter.filters[i].value;
                  }
                  prefix = prefix + obj.filter0.value;
                }

                return 'prefix=' + prefix + '&marketId=' + editedItem.market.id;
              }

              function editTitle(container, options) {
                $('<input type="text" autocomplete = "off" required class="k-input k-textbox" name="title" data-bind="' + options.field + '">').appendTo(container);
              }

              function symbolEditor(container, options) {
                $('<input name-data-option-label=" " placeholder="Type in symbol" data-selector-type=symbol data-value-field="id"  data-text-field="symbol" required  data-bind="value:rateDef"/>')
                  .appendTo(container)
                  .kendoComboBox({
                    minLength: 1,
                    filter: 'contains',
                    autoBind: false,
                    suggest: true,
                    enabled: false,
                    dataSource: {
                      serverFiltering: true,
                      transport: {
                        read: {
                          url: configService.getHostUrl() + '/config/rateDef/prefixsearchWithDefinitions',
                          beforeSend: function (xhr, options) {
                            xhr.setRequestHeader('token', auth.token);
                          },
                          dataType: 'json'
                        },
                        parameterMap: buildParameterMap
                      }
                    },
                    filterable: {
                      extra: true,
                      operators: {
                        string: {
                          startswith: 'Starts with',
                          eq: 'Is equal to',
                          neq: 'Is not equal to'
                        }
                      }
                    },
                    dataBound: function (value) {
                      $('[data-selector-type=symbol]').data('kendoComboBox').enable();
                    },
                    change: function (change) {
                      change.sender.element.closest('tr').find('[data-selector-type=attribute]').data('kendoDropDownList').dataSource.data(getData());
                      change.sender.element.closest('tr').find('[data-selector-type=attribute]').data('kendoDropDownList').value(null);
                    }
                  });

                $('[data-selector-type=symbol]').kendoValidator({
                  rules: {
                    invalidRoom: function (input) {
                      if (input.is('[data-selector-type=symbol]')) {
                        if ($('[data-selector-type=symbol]').data('kendoComboBox').selectedIndex == -1) {
                          return false;
                        }
                      }
                      return true;
                    }
                  },
                  messages: {
                    invalidRoom: "Symbol must be selected."
                  }
                });

                $('[data-selector-type=symbol]').data("kendoComboBox").input.attr("placeholder", "Type in symbol");
              }

              var getData = function () {
                var data;
                if (editedItem.rateDef.attributes) {
                  data = editedItem.rateDef.attributes;
                } else {
                  data = [];
                }

                return data;
              };

              function editAttribute(container, options) {
                $('<input data-selector-type=attribute required data-text-field="name" data-value-field="id" data-bind="value:dataDictionary"/>')
                  .appendTo(container)
                  .kendoDropDownList({
                    autoBind: false,
                    optionLabel: 'Select',
                    dataSource: {
                      data: getData()
                    },
                    change: function (e1, e2) {

                    }
                  });

                $('[data-selector-type=attribute]').kendoValidator({
                  rules: {
                    required: function (input) {
                      if (input.is('[data-selector-type=attribute]')) {
                        if ($('[data-selector-type=attribute]').data('kendoDropDownList').selectedIndex === 0) {
                          return false;
                        } else {
                          return true;
                        }
                      }
                    }
                  },
                  required: {
                    invalidRoom: "Attribute must be selected."
                  }
                });
              }

              columns.push({
                title: 'Title',
                field: 'title',
                filterable: false,
                editable: true
                //editor: editTitle
              });

              columns.push({
                title: 'Market',
                field: 'market.name',
                filterable: false,
                editable: true,
                editor: marketEditor
              });

              columns.push({
                title: 'Symbol',
                field: 'rateDef.symbol',
                filterable: false,
                editable: false,
                editor: symbolEditor
              });

              columns.push({
                title: 'Attribute',
                field: 'dataDictionary.name',
                filterable: false,
                editor: editAttribute
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
                  var model = editedItem;
                  var updated = false;
                  for (var i = 0; i < scope.itemsForEdit.length; i++) {
                    if (model.index === scope.itemsForEdit[i].index) {
                      scope.itemsForEdit[i] = JSON.parse(kendo.stringify(model));
                      updated = true;
                    }
                  }

                  if (!updated) {
                    model.index = insertIds;
                    scope.itemsForEdit.push(model);
                    insertIds--;
                  }

                  scope.$apply();
                },
                cancel: function (data) {
                  grid.data('kendoGrid').dataSource.read();
                  this.refresh();
                },

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
                        if (o.data.index === items[i].index) {
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
                      id: 'index',
                      fields: {
                        title: {

                          validation: {
                            required: true
                          }
                        }
                      }
                    }
                  }
                },
                toolbar: [
                  {
                    name: 'Add',
                    text: 'Add new record',
                    imageClass: 'k-icon k-add'
                  }
                ],
                edit: function (data) {
                  editedItem = data.model;
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

                  if (!alreadyInitAddButton) {
                    alreadyInitAddButton = true;
                    $('.schema-dictionary-grid').find('a.k-grid-Add').click(function (e) {
                      var dataSource = $('.schema-dictionary-grid').data('kendoGrid').dataSource;
                      dataSource.insert({
                        editData: {},
                        rateDef: {},
                        market: {},
                        dataDictionary: {}
                      });
                      var theGrid = $('.schema-dictionary-grid').data('kendoGrid');
                      theGrid.editRow($(".schema-dictionary-grid tr:eq(" + ( 1) + ")"));
                    });
                  }
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