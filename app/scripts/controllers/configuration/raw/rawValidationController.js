'use strict';

angular.module('ratesUiApp')
  .controller('rawValidationController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getRawRateFieldValidation();
      $scope.mode = 'definition';
    }]);