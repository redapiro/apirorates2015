'use strict';

angular.module('ratesUiApp')
  .controller('eventListenerController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getEventListener();
      $scope.mode = 'definition';
    }]);