'use strict';

angular.module('ratesUiApp')
  .controller('rawPostSourceProcessController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getPostSourceProc();
      $scope.mode = 'definition';
    }]);