'use strict';

angular.module('ratesUiApp')
  .controller('eventProcessorServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getEventProcessorService();
      $scope.mode = 'definition';
    }]);