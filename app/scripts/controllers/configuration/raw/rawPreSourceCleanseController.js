'use strict';

angular.module('ratesUiApp')
  .controller('rawPreSourceCleanseController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getPreSourceFieldCleanser();
      $scope.mode = 'definition';
    }]);