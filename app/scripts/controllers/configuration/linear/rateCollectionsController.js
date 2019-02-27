'use strict';

angular.module('ratesUiApp')
  .controller('rateCollectionsController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getRateColFilter();
      $scope.mode = 'definition';
    }]);