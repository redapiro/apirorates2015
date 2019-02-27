'use strict';

angular.module('ratesUiApp')
  .controller('xRateDistributionFormatterController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getCrossRatedistributionFormatter();
      $scope.mode = 'definition';
    }]);
