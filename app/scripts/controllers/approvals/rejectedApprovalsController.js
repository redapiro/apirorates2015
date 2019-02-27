'use strict';

angular.module('ratesUiApp')
  .controller('rejectedApprovalsController', ['$scope', 'notificationService', 'approvalsService', 'configService', '$modal',
    function ($scope, notificationService, approvalsService, configService, $modal) {
      $scope.columns = [];
      $scope.datasourceUrl = configService.getHost() + '/actions/approvals/rejected';
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

      $scope.extraColumnsToAdd.push(
        {
          command: [
            {
              /**
               * This is actioned with the data used to render the table, open your modals and
               * other functionality here
               * @param dataItem
               */
              doOnClick: function (dataItem) {
                $scope.approveAggregatedRate(dataItem.id, dataItem.targetEntityId);
                $scope.$apply();
              },
              /**
               * This is not important, but supplied
               */
              name: 'Edit',
              /**
               * This is the name of the label on the button
               */
              text: 'View',
              /**
               * Sets the icon for the button
               */
              imageClass: 'k-icon k-i-pencil',
              /**
               * Applies style to be 100%
               */
              className: 'full-width'
            }
          ]
        });

      var promise = approvalsService.findColumns();
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
