'use strict';

angular.module('ratesUiApp')
  .controller('rawImportServicesController', ['$scope', 'scriptableTypesConstantsService',
    function ($scope, scriptableTypesConstantsService) {
      $scope.scriptableEntity = scriptableTypesConstantsService.getFeedService();
      $scope.mode = 'definition';
    }]);