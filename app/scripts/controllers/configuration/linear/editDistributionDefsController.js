'use strict';

angular.module('ratesUiApp')
  .controller('editDistributionDefsController', ['$scope', 'notificationService', 'distributionService', 'configService', '$q', '$routeParams', '$location',
    function ($scope, notificationService, distributionService, configService, $q, $routeParams, $location) {
      var crossRateDistributionPromise;
      if($routeParams.distributionId) {
        crossRateDistributionPromise = distributionService.getById($routeParams.distributionId);
      }else {
        crossRateDistributionPromise = $q.when(
          {
            rateCollection: {},
            dataSinkIds: [],
            distributionFormatter: {}
          }
        )
      }

      var refPromise =  distributionService.getReferences();
      $q.all([crossRateDistributionPromise, refPromise]).then(function(response){
        $scope.instance = response[0];
        $scope.references = response[1];
        $scope.ready = true;
      });

      function goBack() {
        $location.path('/setup/rates/linear/distributions');
      }

      $scope.doCancelOp = function () {
        goBack();
      };

      $scope.doSaveOp = function () {
        $scope.inProgress = true;
        var savePromise = distributionService.save($scope.instance);
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
