'use strict';

angular.module('ratesUiApp')
  .controller('taskAuditController', ['$scope', 'notificationService', 'auditService', 'configService', '$window','logMessageService', '$q',
    function ($scope, notificationService, auditService, configService, $window, logMessageService, $q) {

      $scope.columns = [];
      $scope.refreshView = new Date();
      $scope.extraColumnsToAdd = [];
      $scope.datasourceUrl = configService.getHost() + '/audit/task/search';

      var logColumnsPromise = logMessageService.findColumns();
      var columnsPromise = auditService.findTaskColumns();

      $q.all([columnsPromise, logColumnsPromise]).then(function(response){
        $scope.columns = response[0];
        $scope.logColumns = response[1];
        $scope.ready = true;
      });

      columnsPromise.then(function (data) {
          $scope.columns = data;
          $scope.ready = true;
        },
        function (error) {
          $scope.error = error;
          $scope.ready = true;
        });

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
                //Eg. http://127.0.0.1:9000/#/configuration/logs/logMessages?rootTaskId=1401755655703004
                console.log(dataItem.rootUuid);
                $window.location.href = "#/log/logMessages?rootTaskId=" + dataItem.rootUuid;
              },
              /**
               * This is not important, but supplied
               */
              name: 'View Log',
              /**
               * This is the name of the label on the button
               */
              text: 'Logs',
              /**
               * Sets the icon for the button
               */
              imageClass: 'k-icon k-i-search',
              /**
               * Applies style to be 100%
               */
              className: 'full-width'
            }
          ]
        });

    }]);
