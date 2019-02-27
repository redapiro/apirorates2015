'use strict';

angular.module('ratesUiApp')
  .controller('historicalController', ['$scope', 'historicalService', 'constantsService', '$modal', 'storageService',
    'notificationService', 'configService',
    function ($scope, historicalService, constantsService, $modal, storageService, notificationService, configService) {
      $scope.historicalRateSearchPath = configService.getHostUrl() + '/rates/historical/search';
      $scope.totalResults = 1;
      $scope.fillerArray = [];
      $scope.historicalRates = [];
      $scope.ready = false;
      $scope.displayDateCriteria = true;
      $scope.tableType = 'historical';

      $scope.paginationRequest = {
        currentPage: 0
      };

      $scope.changeCount = 0;

      $scope.$watch('changeCount', function (newVal) {
        $scope.changeCount = newVal;
      });

      $scope.filterActive = false;
      $scope.toggleFilter = function () {
        $scope.filterActive = !$scope.filterActive;
      };

    }]);
