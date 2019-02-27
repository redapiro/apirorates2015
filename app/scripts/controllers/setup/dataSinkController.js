'use strict';

angular.module('ratesUiApp')
  .controller('dataSinkController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getDataSink();
      $scope.mode = 'definition';
    }]);