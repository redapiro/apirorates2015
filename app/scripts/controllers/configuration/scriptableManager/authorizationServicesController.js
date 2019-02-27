'use strict';

angular.module('ratesUiApp')
  .controller('authorizationServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getAuthorization();
      $scope.mode = 'definition';
    }]);