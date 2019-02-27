'use strict';

angular.module('ratesUiApp').directive('configGrid', ['$parse', 'configService', function ($parse, configService) {
  return {
    restrict: 'A',
    scope: {
      data: '=data',
      dataManager: '=manager'
    },
    compile: function compile() {
      return {
        pre: function preLink(scope) {

        },
        post: function postLink(scope, iElement) {

          var storedColumns = [];
          scope.$on('dataEdited', function () {
//          scope.$watch('[data, data.results]', function (data) {
            var data = scope.data;
            if (data && data.totalResults) {
              var toolbar = '<button ng-click="console.log(\'qwer\');">Clear Filters</button>' +
                '<button ng-click="addNew()">Add new</button>';

              var columns = [];


              var fields = {};
              var obj = {};
              obj.fields = {};
              for (var i = 0; i < data.columnDefinitions.length; i++) {
                columns.push({
                  'field': data.columnDefinitions[i].field,
                  'title': data.columnDefinitions[i].name,
                  'type': data.columnDefinitions[i].type,
                  'path': data.columnDefinitions[i].path
                });

                obj.id = 'id';
                obj.fields[data.columnDefinitions[i].field] = {'type': data.columnDefinitions[i].type};
              }
              var addNew = function (e) {
                e.preventDefault();
                var row = $(e.toElement).closest("tr");
                var rowIdx = $("tr", grid.tbody).index(row) - 1;
                scope.dataManager.addRow(rowIdx, scope);
              };
              var deleteRow = function (e) {
                e.preventDefault();
                var row = $(e.toElement).closest("tr");
                var rowIdx = $("tr", grid.tbody).index(row) - 1;
                scope.dataManager.delete(rowIdx, scope);
              }
              columns.push({
                command: [
                  {'text': 'Delete', 'click': deleteRow},
                  {'text': 'Add New', 'click': addNew}
                ]
              });

              storedColumns = columns;

              var grid = $(iElement).kendoGrid({
                dataSource: {
                  data: data.results,
                  pageSize: 20

                },
                filterMenuInit: function (e) {
                  var helperText = e.container.find("div:eq(1)");
                  var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");

                  setTimeout(function () {
                    helperText.hide();
                    firstValueDropDown.wrapper.hide();
                  });
                },
                toolbar: toolbar,
                selectable: true,
                navigatable: true,
                height: 565,
                filterable: true,
                sortable: true,
                resizable: true,
                editable: true,
                pageable: {
                  refresh: true,
                  input: true,
                  pageSizes: [20, 50, 100, 500]
                },
                columns: columns
              });
            }
//          }, true);
          });
          scope.$broadcast('dataEdited');
        }
      };
    }
  };
}
]);