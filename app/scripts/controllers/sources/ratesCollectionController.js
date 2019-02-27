'use strict';

angular.module('ratesUiApp')
  .controller('ratesCollectionController', ['$scope', 'notificationService', 'ratesCollectionService', 'configService', '$modal',
    function ($scope, notificationService, ratesCollectionService, configService, $modal) {
      $scope.columns = [];
      $scope.datasourceUrl = configService.getHost() + '/ratecollections/listAll';
      $scope.extraColumnsToAdd = [];
      $scope.refreshView = new Date();

      $scope.aggregatedModalOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: false,
        templateUrl: 'views/modals/approvals/aggregatedApproval.html',
        controller: 'aggregatedApprovalController'
      };

      $scope.approveAggregatedRate = function (approvalInstanceId, aggregatedInstanceId) {
        $scope.aggregatedModalOptions.resolve = {
          bundle: function () {
            return {
              'approvalInstanceId': approvalInstanceId,
              'aggregatedInstanceId': aggregatedInstanceId
            };
          },
          result: function () {

          }
        };

        var rateModal = $modal.open(
          $scope.aggregatedModalOptions
        );

        rateModal.result.then(function () {
          // Trigger a refresh
          $scope.refreshView = new Date();
        }, function () {
          $scope.refreshView = new Date();
        });
      };

      var promise = ratesCollectionService.findColumns();
      promise.then(function (data) {
          $scope.columns = data;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $scope.ready = true;
        },
        function (error) {
          console.log(error);
          $scope.error = error;
          $scope.ready = true;
        });
    }]);
