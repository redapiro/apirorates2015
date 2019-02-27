'use strict';

angular.module('ratesUiApp')
  .controller('feedInstanceController', ['$scope', 'rawService', 'feedImportService', 'notificationService', '$modalInstance',
    function ($scope, rawService, feedImportService, notificationService, $modalInstance) {
      $scope.modal = {};
      $scope.modal.loading = true;
      $scope.modal.selected = null;
      $scope.modal.feedInstances = [];
      $scope.modal.inProgress = true;
      $scope.modal.overwrite = false;

      rawService.findFeedInstances(function (success) {
        $scope.modal.feedInstances = success;
        $scope.modal.inProgress = false;
      }, function (failure) {
        console.log(failure);
      });

      $scope.$watch("modal.feed", function (feed) {
        $scope.modal.overwrite = false;
        if (feed != null && feed.inlineOnly) {
          $scope.modal.overwrite = true;
        }
      });

      $scope.importFeed = function () {
        $scope.modal.inProgress = true;
        $modalInstance.close($scope.modal.feed);

        if (!$scope.modal.overwrite) {
          $scope.modal.payload = null;
        }

        feedImportService.importFeed($scope.modal.feed.id, $scope.modal.payload, function (data) {
          $scope.modal.inProgress = false;
          notificationService.sendInfo('Import started',
            'The import of feed named ' + $scope.modal.feed.name + ' has started');
        }, function (failure) {
          $scope.modal.inProgress = false;
        });
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);
