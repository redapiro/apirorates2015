'use strict';

angular.module('ratesUiApp')
  .controller('fieldAggregationAlgorithmController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getFieldAggregationAlgorithm();
      $scope.mode = 'instances';
    }]);