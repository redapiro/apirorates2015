'use strict';

angular.module('ratesUiApp').directive('logManagementGrid', ['$parse',
  'configService',
  '$compile',
  'storageService',
  'constantsService',
  function ($parse, configService, $compile, storageService, constantsService) {
    return {
      restrict: 'A',
      templateUrl: 'views/directives/grids/logManagementGrid.html',
      scope: {
        data: '=data',
        actionColumns: '=actionColumns',
        refreshTrigger: '=refreshTrigger',
        toolbarAction: '=toolbarAction',
        displayActionFunction: '&displayActionFunction',
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

            var selectors = [
              'OFF',
              'FATAL',
              'ERROR',
              'WARN',
              'INFO',
              'DEBUG',
              'TRACE',
              'ALL'
            ];

            function createLevelSelector(container, options) {
              $('<input data-selector-type=levelSelector data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                  autoBind: false,
                  dataSource: {
                    data: selectors
                  }
                });
            }


            scope.displayUpdateCount = function () {
              return scope.changeCount > 0;
            };

            var grid;
            scope.noData = false;

            var buildToolbarTemplate = function () {
              var template = '<div id="toolbar" data-role="toolbar" class="k-toolbar ">' +
                '<label class="category-label" for="category">Filter:</label>' +
                '<input type="search" id="category" class="k-textbox" style="width: 300px"/>';
                template = template +
                '<div class="k-separator" data-overflow="auto" style="visibility: visible;">&nbsp;</div>' +
                '</div>';
              return template;
            };

            var columnFieldToPathMap = {};

            scope.$watch('data', function (data) {

              if (grid) {
                $(iElement).find('.simple-grid').data().kendoGrid.destroy();
                $(iElement).find('.simple-grid').empty();
              }

              if (data) {
                if (data.length === 0) {
                  scope.noData = true;
                  return;
                }
                scope.ready = true;
                scope.columns = [
                  {
                    title: 'Logger',
                    field: 'name',
                    filterable: false
                  },
                  {
                    title: 'Level',
                    field: 'level',
                    filterable: false,
                    editor: createLevelSelector,
                    template: function(data){
                      if(data.dirty){
                        return '<span class="k-dirty"></span>' + data.level;
                      }
                      else{
                        return data.level;
                      }
                    }
                  }
                ];

                scope.currentVal = {};
                var refreshedCount = 0;
                scope.$watch('refreshTrigger', function (newVal) {
                  if (scope.currentVal !== newVal && refreshedCount !== 0) {
                    refreshedCount++;
                    grid.data('kendoGrid').dataSource.read();
                  } else if (refreshedCount === 0) {
                    refreshedCount++;
                  }
                });

                // Instantiate grid type
                var dataSource = new kendo.data.DataSource({
                  data: scope.data,
                  schema: {
                    model: {
                      id: 'name',
                      fields: {
                        'name': {
                          type: 'string',
                          editable: false
                        },
                        'level': {
                          type: 'string',
                          editable: true
                        }
                      }
                    }
                  }
                });
                var isToolbarInit = false;
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
                  serverSorting: true,
                  virtual: true,
                  toolbar: buildToolbarTemplate(),
                  columns: scope.columns,
                  height: $(document).height() - 200,
                  dataSource: dataSource,
                  resizable: true,
                  scrollable: true,
                  autoBind: true,
                  sortable: true,
                  editable: true,
                  save: function (arg1) {
                    for(var i=0; i< scope.data.length; i++) {
                      if(scope.data[i].name === arg1.model.name){
                        scope.data[i] = arg1.model;
                        console.log(scope.data[i]);
                        break;
                      }
                    }
                    scope.$apply();
                  },
                  change: function(e){
                    if(e.action === 'itemchange'){
                      e.items[0].dirtyFields = e.items[0].dirtyFields || {};
                      e.items[0].dirtyFields[e.field] = true;
                    }
                  },
                  batch: true,
                  dataBound: function () {
                    var $grid = $(this.element[0]),
                      newWidth = $grid.find('.k-grid-content').width() - 15;
                    $grid.find('.k-grid-header-wrap > table, .k-grid-content > table').css('width', newWidth);

                    var handler;
                    if(scope.displayActionFunction){

                      $(iElement).find('.simple-grid tbody tr .k-grid-Trace').each(function () {
                        var currentDataItem = $('.simple-grid').data('kendoGrid').dataItem($(this).closest('tr'));
                        handler = scope.displayActionFunction();
                        console.log(currentDataItem);
                        if (!handler(currentDataItem)) {
                          $(this).remove();
                        }
                      });
                    }

                    if (!isToolbarInit) {
                      isToolbarInit = true;
                      initToolbar();
                      $('#category').keyup(function () {
                        var selecteditem = $('#category').val();
                        var kgrid = $('.simple-grid').data('kendoGrid');
                        selecteditem = selecteditem.toLowerCase();
                        var selectedArray = selecteditem.split(' ');

                        if (selecteditem) {
                          var orfilter = {logic: "or", filters: []};
                          var andfilter = {logic: "and", filters: []};
                          $.each(selectedArray, function (i, v) {
                            if (v.trim() == "") {
                            }
                            else {
                              $.each(selectedArray, function (i, v1) {
                                if (v1.trim() == "") {
                                }
                                else {
                                  orfilter.filters.push({field: "name", operator: "contains", value: v1});
                                  andfilter.filters.push(orfilter);
                                  orfilter = {logic: "or", filters: []};
                                }

                              });
                            }
                          });
                          kgrid.dataSource.filter(andfilter);
                        }
                        else {
                          kgrid.dataSource.filter({});
                        }
                      });
                    }
                    setTimeout(function(){
                      $('.simple-grid [role="row"]').toggle(true);
                    },500);

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
                grid = $(iElement).find('.simple-grid').kendoGrid(gridConfig);
              }

              function initToolbar() {
                $(grid).find("#toolbarAction").click(function () {
                  scope.toolbarAction.action();
                  scope.$apply();
                });
              }
            });
          }
        }
      }
    };
  }
]);