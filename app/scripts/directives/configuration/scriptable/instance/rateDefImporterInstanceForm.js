'use strict';

/**
 * The 'instance' is inherited from the parent scope, and reflects the scriptable instance loaded
 */
angular.module('ratesUiApp')
  .directive('rateDefImporterInstanceForm', ['$location', 'lookupService', 'rateSchemaService',
    function ($location, lookupService, rateSchemaService) {
      return {
        templateUrl: 'views/directives/scriptable/instance/rateDefImporterInstanceForm.html',
        restrict: 'AE',
        link: function postLink(scope, element, attrs) {
          scope.rateSchemaDefinitions = [];
          scope.rateSchemaDefinition = {};

          rateSchemaService.listAll().then(function (rateSchemaDefinitions) {
            scope.rateSchemaDefinitions = rateSchemaDefinitions;
            console.log(scope.rateSchemaDefinitions);
          });

          scope.$watch('instance', function (theInstance) {
            if (theInstance) {
              scope.rateSchemaDefinition.selected = {id: theInstance.schemaId, name: theInstance.schemaName};
            }
          });

          // Watch changes in rateSchemaDefinition object
          scope.$watch('rateSchemaDefinition.selected', function (selected) {
            if (selected) {
              scope.instance.schemaId = selected.id;
              scope.instance.schemaName = selected.name;
            }
          });
        }
      };
    }]);
