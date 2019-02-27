'use strict';

angular.module('ratesUiApp')
  .controller('aggregationServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getAggregationService();
      $scope.mode = 'definition';
    }]);