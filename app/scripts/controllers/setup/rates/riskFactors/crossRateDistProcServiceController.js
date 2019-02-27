'use strict';

angular.module('ratesUiApp')
  .controller('crossRateDistProcServiceController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getCrossRateDisProcService();
      $scope.mode = 'definition';
    }]);