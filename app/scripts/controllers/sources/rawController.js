'use strict';

angular.module('ratesUiApp')
  .controller('rawController', ['$scope', 'rawService', 'constantsService', '$modal', 'storageService',
    'notificationService', 'configService',
    function ($scope, rawService, constantsService, $modal, storageService, notificationService, configService) {

      $scope.rawRateSearchPath = configService.getHostUrl() + '/rates/raw/search';
      $scope.totalResults = 1;
      $scope.fillerArray = [];
      $scope.rawRates = [];
      $scope.ready = false;
      $scope.tableType = 'raw';
      $scope.displayDateCriteria = false;

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
