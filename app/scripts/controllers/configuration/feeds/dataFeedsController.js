'use strict';

angular.module('ratesUiApp')
  .controller('dataFeedsController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getFeed();
      $scope.mode = 'definition';
    }]);
