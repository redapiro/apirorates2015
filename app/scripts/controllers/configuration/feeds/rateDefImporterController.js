'use strict';

angular.module('ratesUiApp')
  .controller('rateDefImporterController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getRateDefImport();
      $scope.mode = 'definition';
    }]);
