'use strict';

angular.module('ratesUiApp')
  .controller('authenticationServiceImplController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getAuthentication();
      $scope.mode = 'definition';
    }]);