'use strict';

angular.module('ratesUiApp')
  .controller('runTimeCrossRatesDistributionController', ['$scope', 'notificationService', 'runtimeCrossRatesDistributionService', 'configService',
    function ($scope, notificationService, runtimeCrossRatesDistributionService, configService) {

      $scope.columns = [];
      $scope.datasourceUrl = configService.getHost() + '/config/crossRateDistributions/search';
      runtimeCrossRatesDistributionService.findColumns(function (data) {
          $scope.columns = data;
          $scope.ready = true;
        },
        function (error) {
          console.log(error);
          $scope.error = error;
          $scope.ready = true;
        });

      $scope.extraColumnsToAdd = [];
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
                var promise = runtimeCrossRatesDistributionService.distribute(dataItem.id);
                promise.then(function (result) {
                  alert('Done: Remove this and replace with growl');
                });

                $scope.$apply();
              },
              /**
               * This is not important, but supplied
               */
              name: 'Edit',
              /**
               * This is the name of the label on the button
               */
              text: 'Distribute',
              /**
               * Sets the icon for the button
               */
              imageClass: 'k-icon k-i-group',
              /**
               * Applies style to be 100%
               */
              className: 'full-width'
            }
          ]
        });


    }]);
