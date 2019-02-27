'use strict';

angular.module('ratesUiApp')
  .controller('systemStatusController', ['$rootScope', '$scope', 'notificationService', 'systemStatusService',
    '$modalInstance', 'bundle', '$q',
    function ($rootScope, $scope, notificationService, systemStatusService, $modalInstance, bundle, $q) {
      $scope.modal = {};
      $scope.modal.error = false;

      $scope.modal.isCloseable = function () {
        systemStatusService.isCloseable();
      };

      $scope.modal.getNewState = function () {
        var currentState = $rootScope.currentState;
        var newState = systemStatusService.getNextState(currentState);
        return newState;
      };

      $scope.getFriendlyName = function (newState) {
        var status = systemStatusService.getFriendlyName(newState);
        if (systemStatusService.getFriendlyName(newState)) {
          return status;
        }
        return newState;
      };


      $scope.modal.transition = function () {
        $modalInstance.close();
        var currentState = $rootScope.currentState;
        var newStatus = systemStatusService.getNextState(currentState);
        var promise = systemStatusService.transition(newStatus);
        promise.then(function (response) {
          if (response.code !== 0) {
            notificationService.sendError('Failed to transition', response.message);
          } else {
            $modalInstance.close();
          }
        });
      };

      $scope.modal.reject = function () {
        $modalInstance.close();
      };
    }]);
