'use strict';

angular.module('ratesUiApp')
  .controller('crossRateCollectionController', ['$scope', 'notificationService', 'crossRateCollectionService', 'lookupService',
    'configService', '$routeParams', '$location', '$q', 'rateDefinitionService',
    function ($scope, notificationService, crossRateCollectionService, lookupService, configService, $routeParams, $location, $q, rateDefinitionService) {
      //init cross rate collection
      $scope.columns = [];
      $scope.datasourceUrl = configService.getHost() + '/config/crossRateCollection/search';
      $scope.extraColumnsToAdd = [];
      $scope.refreshView = new Date();
      $scope.editMode = false;
      $scope.innerEditMode = false;

      $scope.gridAction = {};
      $scope.gridAction.title = "Create";
      $scope.gridAction.icon = "icon-plus-sign";
      $scope.innerColumns = undefined;
      $scope.gridAction.action = function () {
        $location.path('/setup/rates/riskFactors/collections/edit').search({});
      };

      $scope.refreshView = new Date();

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
                //$location.search({'crossRateCollectionItemId': dataItem.id});
                $location.path('/setup/rates/riskFactors/collections/edit').
                  search({'crossRateCollectionItemId': dataItem.id});
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
               * Sets the icon for the button.
               */
              imageClass: 'k-icon k-i-pencil',
              /**
               * Applies style to be 100%
               */
              className: 'full-width'
            }
          ]
        });

      // Fetch the columns for display
      crossRateCollectionService.findColumns().then(function (data) {
          $scope.columns = data;
          $scope.ready = true;
        },
        function (error) {
          console.log(error);
          $scope.error = error;
          $scope.ready = true;
        });
    }]);
