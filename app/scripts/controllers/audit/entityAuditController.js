'use strict';

angular.module('ratesUiApp')
  .controller('entityAuditController', ['$scope', 'notificationService', 'auditService', '$routeParams',
    function ($scope, notificationService, auditService, $routeParams) {

      $scope.columns = [];

      if ($routeParams.taskUUID) {
        $scope.taskUUID = $routeParams.taskUUID;
      }

      auditService.findEntityColumns(function (data) {
          $scope.columns = data;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $scope.ready = true;
        },
        function (error) {
          console.log(error);
          $scope.error = error;
//          notificationService.sendError('Error', 'There was an error connecting to server: ' + error.data);
          $scope.ready = true;
        });

    }]);
