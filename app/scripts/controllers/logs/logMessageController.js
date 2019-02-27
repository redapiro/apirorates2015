'use strict';

angular.module('ratesUiApp')
  .controller('logMessageController', ['$scope', 'notificationService', 'logMessageService', 'configService', '$routeParams', '$location', '$modal',
    function ($scope, notificationService, logMessageService, configService, $routeParams, $location, $modal) {
      $scope.columns = [];

      $scope.extraColumnsToAdd = [];
      $scope.refreshView = new Date();
      $scope.editMode = false;

      $scope.viewLog = function (log) {
        $scope.editMode = true;
        $scope.stackTrace = "";
        for (var i = 0; i < log.stack.length; i++) {
          $scope.stackTrace += log.stack[i];
          $scope.stackTrace += "\n";
        }
      };

      if ($routeParams.rootTaskId) {
        console.log($routeParams.rootTaskId);
        $scope.datasourceUrl = configService.getHost() + '/system/log/filter?rootTaskId=' + $routeParams.rootTaskId;
      } else {
        $scope.datasourceUrl = configService.getHost() + '/system/log/search';
      }

      var promise = logMessageService.findColumns();
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

      $scope.displayActionFunction = function() {
        function checkObject(instance){
          return instance.stackTraceExisting;
        }
        return checkObject;
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
              doOnClick: function (log) {
                $scope.viewLog(log);
                $scope.$apply();
              },
              /**
               * This is not important, but supplied
               */
              name: 'Trace',
              /**
               * This is the name of the label on the button
               */
              text: 'Trace',
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

      $scope.doCloseOp = function () {
        $scope.editMode = false;
        $scope.refreshView = new Date();
      };

    }]);
    
    
