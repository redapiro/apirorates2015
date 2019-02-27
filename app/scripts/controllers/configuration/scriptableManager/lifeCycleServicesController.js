'use strict';

angular.module('ratesUiApp')
  .controller('lifeCycleServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getLifeCycleProcService();
      $scope.mode = 'definition';
    }]);