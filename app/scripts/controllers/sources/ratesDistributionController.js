'use strict';

angular.module('ratesUiApp')
  .controller('ratesDistributionController', ['$scope', 'notificationService', 'ratesDistributionService', 'configService',
    function ($scope, notificationService, ratesDistributionService, configService) {

      $scope.columns = [];
      $scope.datasourceUrl = configService.getHost() + '/config/distributions/search';
      $scope.date = new Date();
      ratesDistributionService.findColumns(function (data) {
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
                var promise = ratesDistributionService.distribute(dataItem.id);
                promise.then(function (result) {
                  $scope.date = new Date();
                }, function (failure) {
                  $scope.date = new Date();
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
