'use strict';

angular.module('ratesUiApp')
  .controller('distributionProcessServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getDistributionProcService();
      $scope.mode = 'definition';
    }]);