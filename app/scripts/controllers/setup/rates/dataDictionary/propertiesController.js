'use strict';

angular.module('ratesUiApp')
  .controller('propertiesController', ['$scope', 'notificationService', 'dataDictionaryService', 'configService', '$location',
    function ($scope, notificationService, dataDictionaryService, configService, $location) {
      $scope.columns = [];
      $scope.datasourceUrl = configService.getHost() + '/config/dictionary/properties/search';
      $scope.extraColumnsToAdd = [];
      $scope.refreshView = new Date();


      $scope.gridAction = {};
      $scope.gridAction.title = "Create";
      $scope.gridAction.icon = "icon-plus-sign";
      $scope.gridAction.action = function () {
        $location.path('/setup/rates/definitions/editDataDictionary').search({
          type: 'PROPERTY'
        });
      };

      $scope.editDataDictionary = function (dataDictionaryId) {
        $scope.dataDictionaryModalOptions.resolve = {
          bundle: function () {
            return {
              'dataDictionaryId': dataDictionaryId,
              'dicType': "PROPERTY"
            };
          },
          result: function () {

          }
        };

        var dataDictionaryModal = $modal.open(
          $scope.dataDictionaryModalOptions
        );

        dataDictionaryModal.result.then(function () {
          // Trigger a refresh
          $scope.refreshView = new Date();
        }, function () {
          $scope.refreshView = new Date();
        });
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
                $location.path('/setup/rates/definitions/editDataDictionary').search({
                  type: dataItem.dicType,
                  dataDictionaryId: dataItem.id
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

      var promise = dataDictionaryService.findColumns();
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
