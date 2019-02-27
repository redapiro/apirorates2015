'use strict';

angular.module('ratesUiApp').controller('rateDefinitionController', ['$scope', 'notificationService', 'rateDefinitionService', 'lookupService', 'configService', '$location',
  function ($scope, notificationService, rateDefinitionService, lookupService, configService, $location) {

    $scope.columns = [];
    $scope.datasourceUrl = configService.getHost() + '/config/rateDef/search';
    $scope.extraColumnsToAdd = [];
    $scope.refreshView = new Date();
    $scope.references = {};

    $scope.gridAction = {};
    $scope.gridAction.title = "Create";
    $scope.gridAction.icon = "icon-plus-sign";
    $scope.gridAction.action = function () {
      $location.path('/setup/rates/definitions/editRateDefinition').search({});
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
              $location.path('/setup/rates/definitions/editRateDefinition').search({rateDefinitionId: dataItem.id});
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

    var promise = rateDefinitionService.findColumns();
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