'use strict';

angular.module('ratesUiApp')
  .controller('detailedAuditController', ['$scope', 'notificationService', 'auditService', '$routeParams',
    function ($scope, notificationService, auditService, $routeParams) {
      $scope.columns = {};

      $scope.reference = $routeParams.reference;
      auditService.findCombinedColumns(function (data) {
          $scope.columns = data;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $scope.ready = true;
        },
        function (error) {
          // Handled globally now
        });
    }]);
