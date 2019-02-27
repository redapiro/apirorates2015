'use strict';

angular.module('ratesUiApp')
  .controller('logManagementController', ['$scope', 'logManagementService', 'ngProgressLite', 'notificationService',
    function ($scope, logManagementService, ngProgressLite, notificationService) {
      ngProgressLite.start();
      logManagementService.findLoggers().then(function(data){
        $scope.loggers = data;
        ngProgressLite.done();
      });

      $scope.doSaveOp = function() {
        ngProgressLite.start();
        var itemsToSave = [];
        for(var i=0; i< $scope.loggers.length; i++){
          if($scope.loggers[i].dirty){
            itemsToSave.push($scope.loggers[i]);
          }
        }
        logManagementService.saveLoggers(itemsToSave).then(function(data){
          $scope.loggers = data;
          notificationService.sendInfo('Updated', 'Logger levels have been updated.');
          ngProgressLite.done();
        }, function(error){
          notificationService.sendInfo('Failed', 'Logger levels failed to update');
          ngProgressLite.done();
        })
      };

      $scope.doCancelOp = function() {
        ngProgressLite.start();
        logManagementService.findLoggers().then(function(data){
          $scope.loggers = data;
          ngProgressLite.done();
        });
      }
}]);