'use strict';

angular.module('ratesUiApp')
  .controller('postAggregationValidationController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getPostAggRateFieldValidation();
      $scope.mode = 'definition';
    }]);