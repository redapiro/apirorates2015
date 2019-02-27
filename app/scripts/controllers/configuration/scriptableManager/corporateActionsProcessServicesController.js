'use strict';

angular.module('ratesUiApp')
  .controller('corporateActionsProcessServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getCorpActionProcService();
      $scope.mode = 'definition';
    }]);