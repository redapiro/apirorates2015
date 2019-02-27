'use strict';

angular.module('ratesUiApp').directive('schemaDefinitionPreSourceFieldCleanserGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  'lookupService',
  '$timeout',
  function ($parse, configService, $compile, storageService, constantsService, lookupService, $timeout) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/schemaPreSourceFieldCleanserGrid.html',
      scope: {
        selectionItems: '=selectionItems',
        refreshTrigger: '=refreshTrigger',
        items: '=items',
        selectedDictionary: '=selectedDictionary'
      },
      compile: function compile() {
        return {
          pre: function preLink(scope) {

          },
          post: function postLink(scope, iElement, attrs) {
            var auth = storageService.fetchObject(constantsService.getUserAuth());
            var grid;
            var dataGrid;

            scope.totalInvalid = 0;
            scope.changeCount = 0;
            var source;
            scope.ready = false;

            scope.displayUpdateCount = function () {
              return scope.changeCount > 0;
            };

            var pageSize = 20;
            scope.noData = false;

            var items = [];

            if (grid) {
              $(iElement).find('.schema-dictionary-grid').data().kendoGrid.destroy();
              $(iElement).find('.schema-dictionary-grid').empty();
            }


            var draggableAlreadyInit = false;

            scope.ready = true;
            var alreadyInit = false;
            var alreadyInitGrid = false;
            scope.$watch('selectionItems', function (realValue) {


              if (!realValue) {
                return;
              }
              if (alreadyInitGrid) {
                return;
              } else {
                alreadyInitGrid = true;
              }

              if (grid) {
                $('#theMainGrid').data().kendoGrid.destroy();
                $('#theMainGrid').empty();
              }
              var columns = [];

              // Build up the columns based on reference data

              columns.push({
                field: 'name',
                title: 'Name',
                editable: false,
                filterable: false,
                sortable: false
              });

              columns.push({
                field: 'supportedType',
                title: 'Data Type',
                editable: false,
                filterable: false,
                sortable: false
              });


              columns.push({
                field: 'description',
                title: 'Description',
                editable: false,
                filterable: false,
                sortable: false
              });

              columns.push({
                field: 'enabled',
                title: 'Enabled',
                editable: true,
                filterable: false,
                sortable: false,
                template: '<input type="checkbox" #= enabled ? "checked=checked" : "" # disabled="disabled" ></input><span></span>'
              });

              columns.push({
                command: ['edit'],
                width: 175
              });

              var buildTemplate = function (arg1, arg2) {
                var template = '<div id="toolbar" data-role="toolbar" class="k-toolbar ">' +
                  '<label class="category-label" for="category">Dictionary:</label>' +
                  '<input id="category"  data-selector-type=dictionaryType  required style="width:350px" >';
                return template;
              };

              var gridConfig = {
                filterable: {
                  extra: false
                },
                filterMenuInit: function (e) {
                  var helperText = e.container.find('div:eq(1)');
                  var firstValueDropDown = e.container.find('select:eq(0)').data('kendoDropDownList');

                  setTimeout(function () {
                    helperText.hide();
                    firstValueDropDown.wrapper.hide();
                  });
                },
                columns: columns,
                width: '100%',
                batch: true,
                editable: 'inline',
                toolbar: buildTemplate,
                save: function (arg1) {
                  var changedItem = arg1.model;

                  angular.forEach(scope.selectedDictionary.items, function (item) {
                    if (item.id === changedItem.id) {
                      item.enabled = changedItem.enabled;
                    }
                  });

                  var modField = [attrs.modificationField];
                  scope.selectedDictionary[modField] = [];
                  for (var i = 0; i < scope.selectedDictionary.items.length; i++) {
                    var item = scope.selectedDictionary.items[i];
                    if (item.enabled) {
                      scope.selectedDictionary[modField].push(item);
                    }
                  }

                  // Force the item to be updated in scope by change a var
                  var jsonCopy = JSON.parse(JSON.stringify(scope.selectedDictionary));
                  scope.selectedDictionary = [];
                  scope.selectedDictionary = jsonCopy;
                  scope.$apply();
                },
                edit: function (data) {

                },
                cancel: function (data) {
                  var $grid = $(this.element[0]);
                  $grid.data('kendoGrid').dataSource.data(scope.selectedDictionary.items);
                  //$grid.data('kendoGrid').refresh();
                },

                dataSource: {
                  change: function (args) {
                    if (scope.selectedDictionary && scope.selectedDictionary.items) {
                      for (var j = 0; j < this._data.length; j++) {
                        if (typeof this._data[j].id !== 'undefined') {
                          scope.selectedDictionary.items[j] = JSON.parse(kendo.stringify(this._data[j]));
                          scope.selectedDictionary.items[j].marker = new Date();
                        }
                      }
                      scope.$apply();
                    }
                  },
                  data: items,
                  schema: {
                    model: {
                      id: 'id',
                      fields: {
                        enabled: {
                          type: 'boolean'
                        },
                        description: {
                          type: 'string',
                          editable: false
                        },
                        name: {
                          type: 'string',
                          editable: false
                        },
                        supportedType: {
                          type: 'string',
                          editable: false
                        }

                      }
                    }
                  }
                },
                resizable: false,
                scrollable: true,
                autoBind: true,
                sortable: true,
                dataBound: function () {
                  var $grid = $(this.element[0]),
                    newWidth = $grid.find('.k-grid-content').width() - 15;
                  $grid.find('.k-grid-header-wrap > table, .k-grid-content > table').css('width', newWidth);
                  setupSelect($grid, realValue);
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
              grid = $(iElement).find('.schema-pre-source-cleanser-grid').kendoGrid(gridConfig);

              dataGrid = grid.data('kendoGrid');
              if (!draggableAlreadyInit) {
                draggableAlreadyInit = true;
                var selectedClass = 'k-state-selected-light';
                $('.schema-pre-source-cleanser-grid').on('click', 'tbody td:first', function (e) {
                  if (e.ctrlKey || e.metaKey) {
                    $(this).toggleClass(selectedClass);
                  } else {
                    $(this).addClass(selectedClass).siblings().removeClass(selectedClass);
                  }
                });
                //$.fn.reverse = [].reverse;

                //alert('ballsack');
                dataGrid.table.kendoDraggable({
                  dragstart: function () {
                    $('body').css('cursor', 'move');
                  },
                  dragend: function () {
                    $('body').css('cursor', 'pointer');
                  },
                  filter: 'tbody tr',
                  group: 'gridGroup',
                  axis: 'y',
                  hint: function (item) {
                    var origWidth = $(item).width();
                    var helper = $('<div class="k-grid k-widget drag-helper" style="width:' + origWidth + 'px"/>');
                    if (!item.hasClass(selectedClass)) {
                      item.addClass(selectedClass).siblings().removeClass(selectedClass);
                    }
                    var table = $('<table style="width:100%">');
                    var elements = item.parent().children('.' + selectedClass).clone();
                    for (var i = 0; i < elements[0].children.length; i++) {
                      $(elements[0].children[i]).width(item[0].children[i].clientWidth);
                    }
                    item.data('multidrag', elements).siblings('.' + selectedClass).remove();
                    table.append(elements);
                    helper.append(table);
                    return helper;
                  }
                });


                dataGrid.table.kendoDropTarget({
                  group: 'gridGroup',
                  drop: function (e) {

                    var draggedRows = e.draggable.hint.find("tr");
                    e.draggable.hint.hide();
                    var dropLocation = $(document.elementFromPoint(e.clientX, e.clientY)),
                      dropGridRecord = dataGrid.dataSource.getByUid(dropLocation.parent().attr('data-uid'));
                    if (dropLocation.is("th")) {
                      return;
                    }

                    var beginningRangePosition = dataGrid.dataSource.indexOf(dropGridRecord),//beginning of the range of dropped row(s)
                      rangeLimit = dataGrid.dataSource.indexOf(dataGrid.dataSource.getByUid(draggedRows.first().attr('data-uid')));//start of the range of where the rows were dragged from

                    //if dragging up, get the end of the range instead of the start
                    if (rangeLimit > beginningRangePosition) {
                      draggedRows.reverse();//reverse the records so that as they are being placed, they come out in the correct order
                    }

                    //assign new spot in the main grid to each dragged row
                    draggedRows.each(function () {
                      var thisUid = $(this).attr('data-uid'),
                        itemToMove = dataGrid.dataSource.getByUid(thisUid);

                      dataGrid.dataSource.remove(itemToMove);
                      dataGrid.dataSource.insert(beginningRangePosition, itemToMove);

                    });

                    //set the main grid moved rows to be dirty
                    draggedRows.each(function () {
                      var thisUid = $(this).attr('data-uid');
                    });

                    //remark things as visibly dirty
                    var dirtyItems = $.grep(dataGrid.dataSource.view(), function (e) {
                      return e.dirty === true;
                    });
                    for (var a = 0; a < dirtyItems.length; a++) {
                      var thisItem = dirtyItems[a];
                      dataGrid.tbody.find("tr[data-uid='" + thisItem.get("uid") + "']").find("td:eq(0)").addClass("k-dirty-cell");
                      dataGrid.tbody.find("tr[data-uid='" + thisItem.get("uid") + "']").find("td:eq(0)").prepend('<span class="k-dirty"></span>')
                    }
                  }
                });
              }

              alreadyInit = true;
            });

            var refreshedCount = 0;
            //scope.$watch('refreshTrigger', function (newVal) {
            //  if (scope.currentVal !== newVal) {
            //    if (scope.selectedDictionary && scope.selectedDictionary.items) {
            //      $(grid).data('kendoGrid').dataSource.data(scope.selectedDictionary.items);
            //      $(grid).data('kendoGrid').refresh();
            //    }
            //  }
            //});

            scope.index = 0;

            function onSelect(e) {
              scope.index = e.item.index();
              //alert(scope.index);
              //if ("kendoConsole" in window) {
              //  var dataItem = this.dataItem(e.item.index());
              //  kendoConsole.log("event :: select (" + dataItem.text + " : " + dataItem.value + ")" );
              //}
            }

            var dropDown;

            function setupSelect(theGridInstance, initialData) {
              //console.log(dropDown);
              if (!dropDown && initialData && initialData.length >= 0) {
                dropDown = theGridInstance.find('#category').kendoDropDownList({
                  dataTextField: 'selectDisplayName',
                  dataValueField: 'dicDTOId',
                  optionLabel: 'Select dictionary..',
                  autoBind: true,
                  dataSource: {
                    data: initialData
                  },
                  select: onSelect,
                  change: function () {
                    var value = this.value();
                    if (value === '') {
                      scope.items = [];
                      dataGrid.dataSource.data([]);
                      //$grid.data('kendoGrid').refresh();
                      return;
                    }
                    for (var i = 0; i < scope.selectionItems.length; i++) {
                      if (value === scope.selectionItems[i].dicDTOId) {
                        scope.selectedDictionary = scope.selectionItems[i];
                      }
                    }
                    dataGrid.dataSource.data(scope.selectedDictionary.items);
                    dataGrid.refresh();
                  }
                });
              }
            }

            scope.$watch('selectionItems', function (realValue) {
              //console.log(realValue);
              if (dropDown && realValue && (realValue.length >= 0)) {
                //console.log($('#category'));
                $('#category').data('kendoDropDownList').dataSource.data([]);
                $('#category').data('kendoDropDownList').dataSource.data(realValue);
                $('#category').data('kendoDropDownList').select(scope.index);
                $(grid).data('kendoGrid').dataSource.data(realValue.items);
                $(grid).data('kendoGrid').refresh();
                for (var i = 0; i < scope.selectionItems.length; i++) {
                  scope.selectionItems.tracker = new Date();
                }
              }
            });
          }
        }
      }
    }
  }
])
;