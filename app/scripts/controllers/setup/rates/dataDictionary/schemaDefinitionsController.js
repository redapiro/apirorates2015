'use strict';

angular.module('ratesUiApp').controller('schemaDefinitionsController', ['$scope', 'notificationService', 'rateSchemaService',
  'configService', '$location', 'constantsService', 'storageService',
  function ($scope, notificationService, rateSchemaService, configService, $location, constantsService, storageService) {
    // Delte schema def from local storage
    storageService.remove(constantsService.getSchemaDefinition());

    //List Rate Schema Definition in Left Column
    $scope.columns = [];
    $scope.datasourceUrl = configService.getHost() + '/config/rateSchemaDef/search';
    $scope.extraColumnsToAdd = [];
    $scope.refreshView = new Date();
    $scope.currentRateSchemaDef = {};
    $scope.referenceData = {};
    $scope.editMode = false;

    $scope.rawValMap = [];
    $scope.preSourceMap = [];
    $scope.postProcMap = [];
    $scope.postAggMap = [];

    $scope.gridAction = {};
    $scope.gridAction.title = "Create";
    $scope.gridAction.icon = "icon-plus-sign";
    $scope.gridAction.action = function () {
      $location.path('/setup/rates/definitions/schemaDefinitions/new').search({});
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
              if(dataItem) {
                $location.path('/setup/rates/definitions/schemaDefinitions/'+dataItem.id).search();
              }
              $scope.$apply();
            },
            /**
             * This is not important, but supplied
             */
            name: 'View',
            /**
             * This is the name of the label on the button
             */
            text: 'View',
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

    var promise = rateSchemaService.findColumns();
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