'use strict';

angular.module('ratesUiApp')
  .controller('dataViolationController', ['$scope', 'violationsData', '$modal', function ($scope, violationsData, $modal) {
    $scope.data = violationsData.get();
    $scope.dataManager = violationsData;
    $scope.ready = true;
  }]);

