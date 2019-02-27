'use strict';

angular.module('ratesUiApp').directive('schemaDefinitionDictionaryGrid', ['$parse',
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
        dictionaryItems: '=dictionaryItems',
        referenceData: '=referenceData',
        actionColumns: '=actionColumns',
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
            scope.$watch('dictionaryItems', function (realValue) {
              if (!realValue) {
                return;
              }
              if (grid) {
                $(iElement).find('.schema-dictionary-grid').data().kendoGrid.destroy();
                $(iElement).find('.schema-dictionary-grid').empty();
              }

              var columns = [];

              function findAlgorithms(container, options) {
                $('<input data-text-field="name" data-selector-type=algorithm data-value-field="id" data-bind="value:' + options.field + '"/>')
                  .appendTo(container)
                  .kendoDropDownList({
                    optionLabel: 'Select',
                    enabled: false,
                    dataValueField: 'id',
                    dataTextField: 'name',
                    autoBind: false,
                    dataBound: function (e) {
                    },
                    dataSource: {
                      transport: {
                        read: function (operation, thing) {
                          setTimeout(function () {
                              lookupService.getFieldAggregationAlgs(selectedDataType).then(function (data) {
                                operation.success(data);
                                if (data.length > 0) {
                                  $('[data-selector-type=algorithm]').data('kendoDropDownList').enable();
                                }
                              })
                            }, 100
                          );
                        }
                      }
                    }
                  });
              }


              function dataDictionaryDefs() {

                var items = [];
                for (var i = 0; i < scope.referenceData.dataDictionaryDefs.length; i++) {
                  if (scope.referenceData.dataDictionaryDefs[i].dicType === selectedDictionaryType) {
                    items.push(scope.referenceData.dataDictionaryDefs[i]);
                  }
                }

                return items;
              }

              function dataNameEditor(container, options) {
                function refreshAlgorithms(e1) {
                  var kendoComboSites = e1.sender.element.closest('tr').find('[data-selector-type=algorithm]').data('kendoDropDownList');
                  for (var i = 0; i < scope.referenceData.dataDictionaryDefs.length; i++) {
                    if (scope.referenceData.dataDictionaryDefs[i].id === e1.sender._selectedValue) {
                      selectedDataType = scope.referenceData.dataDictionaryDefs[i].type;
                    }
                  }

                  if (kendoComboSites) {
                    kendoComboSites.dataSource.transport.options = {
                      read: {
                        url: configService.getHostUrl() + '/lookup/fieldAggregationAlgs?dataType=' + selectedDataType,
                        dataType: 'json',
                        beforeSend: function (xhr, options) {
                          xhr.setRequestHeader('token', auth.token);
                          xhr.setRequestHeader('Accepts', 'application/json');
                        }
                      }
                    };
                    kendoComboSites.dataSource.read();
                    kendoComboSites.refresh();
                  }
                }

                $('<input data-selector-type=dataDictionaryDefs required data-text-field="name" data-value-field="id" data-bind="value:dicDTO' + '"/>')
                  .appendTo(container)
                  .kendoDropDownList({
                    optionLabel: 'Select',
                    enabled: false,
                    autoBind: false,
                    dataSource: {
                      transport: {
                        read: function (operation) {
                          setTimeout(function () {
                              var data = dataDictionaryDefs();
                              operation.success(data);
                              if (data.length > 0) {
                                $('[data-selector-type=dataDictionaryDefs]').data('kendoDropDownList').enable();
                              }
                            }, 100
                          );
                        }
                      }
                    },
                    dataBound: function (e1) {
                      refreshAlgorithms(e1);
                    },
                    change: function (e1, e2) {
                      refreshAlgorithms(e1);
                    }
                  });
              }

              function dictionaryTypeEditor(container, options) {
                $('<input data-selector-type=dictionaryType required data-text-field="id" data-value-field="id" data-bind="value:' + options.field + '"/>')
                  .appendTo(container)
                  .kendoDropDownList({
                    optionLabel: 'Select',
                    autoBind: false,
                    dataSource: {
                      data: scope.referenceData.dictionaryTypes
                    },
                    change: function (e1, e2) {
                      var kendoComboSites = e1.sender.element.closest('tr').find('[data-selector-type=dataDictionaryDefs]').data('kendoDropDownList');
                      selectedDictionaryType = e1.sender._selectedValue;
                      kendoComboSites.dataSource.read();
                      kendoComboSites.refresh();
                    }
                  });
              }

              columns.push({
                title: 'Type',
                field: 'dicDTO.dicType',
                filterable: false,
                editor: dictionaryTypeEditor
              });

              columns.push({
                title: 'Dictionary',
                field: 'dicDTO.name',
                filterable: false,
                width: 150,
                template: "#:data.dicDTO==null?'':data.dicDTO.name#",
                editor: dataNameEditor
              });

              columns.push({
                title: 'Data Type',
                field: 'dicDTO.type',
                filterable: false,
                editable: false,
                template: "#:data.dicDTO==null?'':data.dicDTO.type#"
              });

              columns.push({
                title: 'Aggregation Algorithm',
                field: 'aggregationAlgorithmInstance',
                width: 180,
                filterable: false,
                sortable: false,
                template: "#:data.aggregationAlgorithmInstance==null?'':data.aggregationAlgorithmInstance.name#",
                editor: findAlgorithms
              });

              columns.push({
                title: 'CA Scaling',
                field: 'caScaling',
                template: '<input type="checkbox" #= caScaling ? "checked=checked" : "" # disabled="disabled" ></input>',
                //attributes: {class: 'ob-fld-boolean'},
                filterable: false
              });


              //columns.push(
              //  {
              //    title: 'Display Order',
              //    width: 120,
              //    template: '<button type="button" id="editButton" class="k-button small-button-width"><span class="k-icon k-i-arrowhead-n"></span></button><button type="button" id="editButton1" class="k-button small-button-width"><span class="k-icon  k-i-arrowhead-s"></span></button>'
              //  });


              columns.push({
                command: ['edit'],

                width: 175
              });

              // Now add any additional columns to the already supplied
              if (scope.actionColumns && scope.actionColumns.length > 0) {
                for (var colCount = 0; colCount < scope.actionColumns.length; colCount++) {
                  var col = scope.actionColumns[colCount];
                  col.title = 'Actions';
                  col.command[0].click = function (arg1) {
                    arg1.originalEvent.preventDefault();
                    var dataItem = this.dataItem($(arg1.currentTarget).closest("tr"));
                    col.command[0].doOnClick(dataItem);
                  };

                  if (col.command.length == 2) {
                    col.command[1].click = function (arg1) {
                      arg1.originalEvent.preventDefault();
                      var dataItem = this.dataItem($(arg1.currentTarget).closest("tr"));
                      col.command[1].doOnClick(dataItem);
                    };
                  }
                  columns.push(scope.actionColumns[colCount]);
                }
              }

              var alreadyInitAddButton = false;
              var items = realValue;
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
                  for (var i = 0; i < scope.dictionaryItems.length; i++) {
                    if (model && model.id && (model.id === scope.dictionaryItems[i].id)) {
                      scope.dictionaryItems[i] = JSON.parse(kendo.stringify(model));
                      console.log(scope.dictionaryItems[i]);
                      updated = true;
                    }
                  }
                  if (!updated) {
                    scope.dictionaryItems.push(model);
                  }
                  scope.$apply();
                },
                cancel: function (data) {
                  grid.data('kendoGrid').dataSource.read();
                  this.refresh();
                },
                toolbar: [
                  {
                    name: 'Add',
                    text: 'Add new record',
                    imageClass: 'k-icon k-add'
                  }
                ],

                dataSource: {
                  change: function (data) {
                    // Change the order
                    for (var j = 0; j < this._data.length; j++) {
                      if (typeof this._data[j].id !== "undefined") {
                        scope.dictionaryItems[j] = JSON.parse(kendo.stringify(this._data[j]));
                      }
                    }
                  },
                  data: items,
                  schema: {
                    model: {
                      id: 'id',
                      fields: {
                        //'dicDTO.type': {editable: false},
                        //'dicDTO.name': {editable: false},
                        //'dicDTO.dicType': {editable: false},
                        'visible': {
                          type: 'boolean'
                        },
                        'caScaling': {
                          type: 'boolean'
                        },
                        'visibilitySeq': {
                          type: 'number'
                        }
                      }
                    }
                  }
                },
                edit: function (data) {
                  var model = data.model.dicDTO;
                  for (var i = 0; i < scope.referenceData.dataDictionaryDefs.length; i++) {
                    if (scope.referenceData.dataDictionaryDefs[i].id === model.id) {
                      selectedDataType = scope.referenceData.dataDictionaryDefs[i].type;
                      selectedDictionaryType = scope.referenceData.dataDictionaryDefs[i].dicType;
                    }
                  }
                  $('[name=\'dicDTO.type\']').attr("disabled", true);
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
                    $('.schema-dictionary-grid').find('a.k-grid-Add').unbind('click');
                    $('.schema-dictionary-grid').find('a.k-grid-Add').click(function (e) {
                      var dataSource = $('.schema-dictionary-grid').data('kendoGrid').dataSource;
                      dataSource.insert({
                        'dicDTO': {
                          'id': '',
                          'lockedForApproval': '',
                          'inactive': false,
                          'name': '',
                          'dicType': '',
                          'type': ''
                        },
                        'visible': true,
                        'visibilitySeq': 0,
                        'caScaling': true,
                        'aggregationAlgorithmInstance': {
                          'id': undefined,
                          'name': ''
                        }
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

              var dataGrid = grid.data("kendoGrid");

              var selectedClass = 'k-state-selected-light';
              $('.schema-dictionary-grid').on('click', 'tbody td:first', function (e) {
                if (e.ctrlKey || e.metaKey) {
                  $(this).toggleClass(selectedClass);
                } else {
                  $(this).addClass(selectedClass).siblings().removeClass(selectedClass);
                }
              });

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
                  var elements = item.parent().children('.' + selectedClass).clone(true);

                  item.data('multidrag', elements).siblings('.' + selectedClass).remove();
                  table.append(elements);
                  helper.append(table);
                  for (var i = 0; i < elements[0].children.length; i++) {
                    $(elements[0].children[i]).width(item[0].children[i].clientWidth);
                  }
                  return helper;
                }
              });
              $.fn.reverse = [].reverse;
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
                    //dataGrid.dataSource.getByUid(thisUid).set("dirty",true);

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

              alreadyInit = true;
            });

            var refreshedCount = 0;
            scope.$watch('refreshTrigger', function (newVal) {
              if (scope.currentVal !== newVal && refreshedCount !== 0) {
                refreshedCount++;
                //grid.data('kendoGrid').refresh();
                //grid.data('kendoGrid').dataSource.read();
              } else if (refreshedCount === 0) {
                refreshedCount++;
              }
            });

          }
        }
      }
    }
  }]);