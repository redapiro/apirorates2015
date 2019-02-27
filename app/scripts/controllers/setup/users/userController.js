'use strict';

angular.module('ratesUiApp').controller('userController', ['$scope', 'notificationService', 'userService', 'configService', '$location',
  function ($scope, notificationService, userService, configService, $location) {

    $scope.columns = [];
    $scope.datasourceUrl = configService.getHost() + '/user/search';
    $scope.extraColumnsToAdd = [];

    $scope.gridAction = {};
    $scope.gridAction.title = "Create";
    $scope.gridAction.icon = "icon-plus-sign";
    $scope.gridAction.action = function () {
      $location.path('/setup/users/editUser/user/').search({});
    };

    $scope.extraColumnsToAdd.push({
      command: [
        {
          /**
           * This is actioned with the data used to render the table, open your modals and
           * other functionality here
           * @param dataItem
           */
          doOnClick: function (dataItem) {
            $location.path('/setup/users/user/'+dataItem.id);
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
          className: 'full-width',
          /**
           * show flag
           */
          showFlag: "show"
        }
      ]
    });

    userService.findUserColumns().then(function (data) {
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