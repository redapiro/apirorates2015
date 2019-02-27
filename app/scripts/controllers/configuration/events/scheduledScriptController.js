'use strict';

angular.module('ratesUiApp')
  .controller('scheduledScriptController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getScheduledScript();
      $scope.mode = 'definition';
    }]);