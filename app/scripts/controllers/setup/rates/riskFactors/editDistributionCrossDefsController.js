'use strict';

angular.module('ratesUiApp')
  .controller('editDistributionCrossDefsController', ['$scope', 'notificationService', 'crossRateDistributionService', 'configService', '$q', '$routeParams', '$location',
    function ($scope, notificationService, crossRateDistributionService, configService, $q, $routeParams, $location) {
      var crossRateDistributionPromise;
      if($routeParams.distributionId) {
        crossRateDistributionPromise = crossRateDistributionService.getById($routeParams.distributionId);
      }else {
        crossRateDistributionPromise = $q.when(
          {
            rateCollection: {},
            dataSinkIds: [],
            distributionFormatter: {}
          }
        )
      }

      var refPromise =  crossRateDistributionService.getReferences();
      $q.all([crossRateDistributionPromise, refPromise]).then(function(response){
        $scope.instance = response[0];
        $scope.references = response[1];
        $scope.ready = true;
      });

      function goBack() {
        $location.path('/setup/rates/riskFactors/distributions');
      }

      $scope.doCancelOp = function () {
        goBack();
      };

      $scope.doSaveOp = function () {
        $scope.inProgress = true;
        var savePromise = crossRateDistributionService.save($scope.instance);
        savePromise.then(function (data) {
          $scope.editMode = false;
          $scope.instance = data.object;
          goBack();
          notificationService.sendInfo('Updated', 'Distribution updated');
        }, function (failure) {
          $scope.errorMessages = failure.errorMessages;
          $scope.editMode = false;
          notificationService.sendInfo('Failure', 'Not able to save distribution');
        });
      };

    }]);
