'use strict';

angular.module('ratesUiApp')
  .controller('dataProviderController', ['$scope', 'notificationService', 'dataProviderService', 'configService', '$modal',
    function ($scope, notificationService, dataProviderService, configService, $modal) {
      $scope.columns = [];
      $scope.datasourceUrl = configService.getHost() + '/config/dataProvider/search';
      $scope.extraColumnsToAdd = [];
      $scope.refreshView = new Date();
      $scope.editMode = false;
      $scope.references = {};

      $scope.gridAction = {};
      $scope.gridAction.title = "Create";
      $scope.gridAction.icon = "icon-plus-sign";
      $scope.gridAction.action = function () {
        $scope.editDataProviders(null);
      };

      $scope.editDataProviders = function (dataProvider) {
        $scope.editMode = true;
        $scope.instance = {};
        if (dataProvider) {
          var promise = dataProviderService.getById(dataProvider.id);
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
                $scope.editDataProviders(dataItem);
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

      var promise = dataProviderService.findColumns();
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

      /*
       var refPromise = dataProviderService.getReferences();
       refPromise.then(function (data) {
       $scope.references = data;
       if (!$scope.$$phase) {
       $scope.$apply();
       }
       $scope.ready = true;
       },
       function (error) {
       console.log(error);
       $scope.error = error;
       $scope.ready = true;
       });*/


      $scope.doCancelOp = function () {
        $scope.editMode = false;
        $scope.refreshView = new Date();
      };

      $scope.doSaveOp = function () {
        $scope.inProgress = true;
        var savePromise = dataProviderService.save($scope.instance);
        savePromise.then(function (data) {
          $scope.editMode = false;
          $scope.refreshView = new Date();
          notificationService.sendInfo('Updated', 'dataProvider updated');
        }, function (failure) {
          $scope.editMode = false;
          notificationService.sendInfo('Failure', 'Not able to save dataProvider');
        });
      };

    }]);
