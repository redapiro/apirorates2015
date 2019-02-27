'use strict';

angular.module('ratesUiApp')
  .controller('aggregatedController', ['$scope', 'aggregatedService', 'constantsService', 'configService',
    function ($scope, aggregatedService, constantsService, configService) {
      $scope.aggregatedRateSearchPath = configService.getHostUrl() + '/rates/aggregated/search';
      $scope.totalResults = 1;
      $scope.fillerArray = [];
      $scope.rawRates = [];
      $scope.ready = false;
      $scope.displayDateCriteria = false;
      $scope.tableType = 'aggregated';


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
