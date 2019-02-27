'use strict';

angular.module('ratesUiApp')
  .controller('editCrossRateCollectionController', ['$scope', 'notificationService', 'crossRateCollectionService', 'lookupService',
    'configService', '$routeParams', '$location', '$q', 'rateDefinitionService',
    function ($scope, notificationService, crossRateCollectionService, lookupService, configService, $routeParams, $location, $q, rateDefinitionService) {
      //init cross rate collection
      $scope.editMode = true;
      $scope.innerEditMode = false;
      $scope.innerRefreshView = new Date();
      $scope.gridAction = {};
      $scope.gridAction.title = "Create";
      $scope.gridAction.icon = "icon-plus-sign";
      $scope.innerColumns = undefined;
      $scope.ready = false;
      var crossRateCollectionItemId = $routeParams.crossRateCollectionItemId;
      var promiseForCrossRateCollection;
      if(crossRateCollectionItemId) {
        promiseForCrossRateCollection = crossRateCollectionService.getById(crossRateCollectionItemId);
      }else{
        promiseForCrossRateCollection = $q.when(
          {
            items: []
          }
        )
      }


      //init new cross rate line item
      $scope.innerExtraColumnsToAdd = [];

      $scope.item = {};
      $scope.item.rateDef = {};
      $scope.item.dataDictionary = {};

      function prepareItemsForEdit() {
        angular.forEach($scope.instance.items, function(item){
          item.market = item.rateDef.market,
          item.editData = {
            title: item.title,

            symbol: item.rateDef.symbol,
            attribute: item.dataDictionary.name
          }
        });
        $scope.itemsForEdit = $scope.instance.items;
        $scope.refresh = new Date();
      }

      //get reference data
      var referencePromised = crossRateCollectionService.getReferenceData();
      var lookupPromised = lookupService.searchMarkets();
      $q.all([referencePromised, lookupPromised, promiseForCrossRateCollection]).then(function (results) {
        $scope.dataDictionaries = results[0]['dataDictionary'];
        $scope.markets = results[1];
        $scope.instance = results[2];
        prepareItemsForEdit();
        $scope.ready = true;
      });

      $scope.changedMarket = function () {
        delete $scope.selectedRateDefinition;
      };

      $scope.rateDefinitions = [];
      $scope.getRateDefinitions = function (prefix) {
        if($scope.item.rateDef.market){
          lookupService.searchSymbol(prefix, $scope.item.rateDef.market.id).then(function(values){
            $scope.rateDefinitions = values;
          });
        }
      };



      var resetForm = function(form) {
        if (form && form.$setPristine) {//only supported from v1.1.x
          form.$setPristine();
        }
      };

      $scope.doSaveOp = function() {
        var savePromise = crossRateCollectionService.save($scope.instance);
        savePromise.then(function (data) {
          $location.path('/setup/rates/riskFactors/collections');
          $scope.instance.id = data.object.id;
          notificationService.sendInfo('Updated', 'Cross Rate updated');
        }, function (failure) {
          $scope.errorMessages = failure.errorMessages;
          //$scope.editMode = true;
          //$scope.innerEditMode = false;
          notificationService.sendInfo('Failure', 'Not able to save Cross Rate Line Item');
        });
      };

      $scope.doCancelOp = function() {
        $location.path('/setup/rates/riskFactors/collections').search({});
      };

    }]);
