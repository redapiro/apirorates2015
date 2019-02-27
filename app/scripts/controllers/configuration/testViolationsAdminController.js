'use strict';

angular.module('ratesUiApp')
  .controller('testViolationsAdminController', ['$scope', 'violationsTestAdminService', '$modal', function ($scope, violationsTestAdminService, $modal) {

    $scope.newViolationsTestTable = {};

    $scope.resetProgressing = false;
    $scope.removeAllProgressing = false;
    $scope.createNewAggregatedProgressing = false;
    $scope.clearAggregatedProgressing = false;

    violationsTestAdminService.listFeedFileNames(function (data) {
        $scope.feedFileNames = data;
      },
      function (error) {
        $scope.error = error;
      });

    $scope.$watch('feedFileName', function () {
      if ($scope.feedFileName != null) {
        violationsTestAdminService.getTable($scope.feedFileName, function (data) {
            $scope.violationsTestTable = data;

            violationsTestAdminService.getFeedRateCount(function (data) {
                $scope.feedRateCount = data;
              },
              function (error) {
                $scope.error = error;
              });


            violationsTestAdminService.getColumnNames(function (data) {
                $scope.columnNames = data;
              },
              function (error) {
                $scope.error = error;
              });

          },
          function (error) {
            $scope.error = error;
          });
      }
    });

    $scope.save = function () {
      violationsTestAdminService.save($scope.feedFileName, $scope.violationsTestTable, function (data) {
          $scope.success = "save success."
        },
        function (error) {
          $scope.error = error;
        });

    };

    $scope.calculatePercentage = function (rowValue, totals) {
      return 100 * rowValue / totals;
    };

    $scope.updateColTotals = function (column, vioForm, totals) {
      var tot = 0;
      for (var property in $scope.violationsTestTable) {
        var val = $scope.violationsTestTable[property][column];
        if (val) {
          tot += val;
        }
      }
      if (tot > totals) {
        return tot = -1;
      }
      return tot;
    };

    $scope.updateRowTotals = function (rowKey, vioForm, totals) {
      var tot = 0;
      for (var property in $scope.violationsTestTable) {
        if (rowKey == property) {
          for (var colKey in $scope.violationsTestTable[property]) {
            tot += $scope.violationsTestTable[property][colKey];
          }
        }
      }
      if (tot > totals) {
        return tot = -1;
      }
      return tot;
    };

    $scope.updateTotals = function (rowKey, rowValue, column) {
      var tot = 0;
      for (var property in $scope.violationsTestTable) {
        var val = $scope.violationsTestTable[property][column];
        if (val) {
          tot += val;
        }
      }
      return tot;
    };


    $scope.reset = function () {
      $scope.resetProgressing = true;
      violationsTestAdminService.reset(function (data) {
          $scope.success = "reset success.";
          $scope.resetProgressing = false;
        },
        function (error) {
          $scope.error = error;
        });
    };

    $scope.removeAll = function () {
      $scope.removeAllProgressing = true;
      violationsTestAdminService.removeAll(function (data) {
          $scope.success = "clear all violations success.";
          $scope.removeAllProgressing = false;
        },
        function (error) {
          $scope.error = error;
        });
    }

    $scope.createNewAggregatedViolationUpdateHistorical = function () {
      $scope.createNewAggregatedProgressing = true;
      violationsTestAdminService.createNewAggregatedViolationUpdateHistorical(function () {
          $scope.success = "create ArregratedViolationUpdateHistorical success.";
          $scope.createNewAggregatedProgressing = false;
        },
        function (error) {
          $scope.error = error;
        });
    }

    $scope.clearAggregatedViolationUpdateHistorical = function () {
      $scope.clearAggregatedProgressing = true;
      violationsTestAdminService.clearAggregatedViolationUpdateHistorical(function () {
          $scope.success = "clear ArregratedViolationUpdateHistorical success.";
          $scope.clearAggregatedProgressing = false;
        },
        function (error) {
          $scope.error = error;
        });
    }

  }]);
