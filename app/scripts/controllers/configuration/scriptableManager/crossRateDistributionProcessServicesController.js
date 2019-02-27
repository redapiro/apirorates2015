'use strict';

angular.module('ratesUiApp')
  .controller('crossRateDistributionProcessServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getCrossRateDisProcService();
      $scope.mode = 'definition';
    }]);