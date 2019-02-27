'use strict';

/**
 * The 'instance' is inherited from the parent scope, and reflects the scriptable instance loaded
 */
angular.module('ratesUiApp')
  .directive('fieldAggregationAlgorithmDefinitionForm', ['$location', 'lookupService', 'rateSchemaService',
    function ($location, lookupService, rateSchemaService) {
      return {
        templateUrl: 'views/directives/scriptable/definition/fieldAggregationAlgorithmDefinitionForm.html',
        restrict: 'AE',
        link: function postLink(scope, element, attrs) {
          scope.dataTypes = [];
          lookupService.getDataTypes().then(function (value) {
            scope.dataTypes = value;
          });
        }
      };
    }]);
