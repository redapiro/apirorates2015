'use strict';

/**
 * The 'instance' is inherited from the parent scope, and reflects the scriptable instance loaded
 */
angular.module('ratesUiApp')
  .directive('feedInstanceForm', ['$location', 'lookupService', 'rateSchemaService',
    function ($location, lookupService, rateSchemaService) {
      return {
        templateUrl: 'views/directives/scriptable/instance/feedInstanceForm.html',
        restrict: 'AE',
        replace: true,
        link: function postLink(scope, element, attrs) {
          scope.providers = [];
          scope.provider = {};
          scope.rateSchemaDefinitions = [];
          scope.rateSchemaDefinition = {};

          lookupService.getProviders().then(function (providers) {
            scope.providers = providers.data;
          });

          rateSchemaService.listAll().then(function (rateSchemaDefinitions) {
            scope.rateSchemaDefinitions = rateSchemaDefinitions;
            console.log(scope.rateSchemaDefinitions);
          });

          scope.$watch('instance', function (theInstance) {
            if (theInstance) {
              scope.provider.selected = {id: theInstance.dataProviderId, name: theInstance.dataProvider};
              scope.rateSchemaDefinition.selected = {id: theInstance.schemaId, name: theInstance.schemaName};
            }
          });

          // Watch changes in rateSchemaDefinition object
          scope.changedRateSchemaDefinition = function (selected) {
            if (selected) {
              scope.instance.schemaId = selected.id;
              scope.instance.schemaName = selected.name;
            }
          };
        }
      };
    }]);
