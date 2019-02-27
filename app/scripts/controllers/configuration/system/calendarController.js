'use strict';

angular.module('ratesUiApp')
  .controller('calendarController', ['$scope', 'notificationService', 'calendarService', 'configService', '$location',
    function ($scope, notificationService, calendarService, configService, $location) {
      $scope.columns = [];
      $scope.datasourceUrl = configService.getHost() + '/config/calendar/search';
      $scope.extraColumnsToAdd = [];
      $scope.gridAction = {};
      $scope.gridAction.title = "Create";
      $scope.gridAction.icon = "icon-plus-sign";
      $scope.gridAction.action = function () {
        $location.path('/configuration/system/editCalendar').search({});
      };

      $scope.editCalendar = function (calendar) {
        $scope.editMode = true;
        $scope.instance = {};
        $scope.instance.additionalHolidays = [];
        $scope.newHoliday = {
          "name": "",
          "date": null
        };
        if (calendar) {
          var promise = calendarService.getById(calendar.id);
          promise.then(function (data) {
              $scope.instance = data;
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
        }
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
                $location.path('/configuration/system/editCalendar').search({calendarId: dataItem.id});
                $scope.$apply();
              },
              /**
               * This is not important, but supplied
               */
              name: 'Edit',
              /**
               * This is the name of the label on the button
               */
              text: 'Edit',
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

      var promise = calendarService.findColumns();
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
