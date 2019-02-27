'use strict';

angular.module('ratesUiApp')
  .controller('rateDistributionFormatterController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getDistributionFormatter();
      $scope.mode = 'definition';
    }]);
