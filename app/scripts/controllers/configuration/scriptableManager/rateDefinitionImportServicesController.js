'use strict';

angular.module('ratesUiApp')
  .controller('rateDefinitionImportServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getRateDefImportService();
      $scope.mode = 'definition';
    }]);