'use strict';

angular.module('ratesUiApp')
  .controller('postCloseProcessController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getPostCloseProc();
      $scope.mode = 'definition';
    }
  ]);