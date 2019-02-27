'use strict';

angular.module('ratesUiApp').controller('dataDictionaryItemModalController', ['$scope', 'notificationService', 'rateDefinitionService',
  'lookupService', 'configService', 'rateSchemaService', '$modalInstance', 'bundle',
  function ($scope, notificationService, rateDefinitionService, lookupService, configService, rateSchemaService,
            $modalInstance, bundle) {

    $scope.modal = {};
    $scope.modal.newRateSchemaEntryItem = {};
    $scope.modal.currentRateSchemaDef = bundle.currentRateSchemaDef;

    var referenceDataPromise = rateSchemaService.getReferenceData();
    referenceDataPromise.then(function (data) {
        $scope.modal.referenceData = data;
        $scope.modal.ready = true;
      },
      function (error) {
        console.log(error);
        $scope.error = error;
        $scope.ready = true;
      });

    $scope.modal.onDicTypeChanged = function () {
      if ($scope.modal.dicType != null && $scope.modal.dicType != '') {
        $scope.modal.selectedDataDictionaryDefs = $scope.modal.referenceData.dataDictionaryDefs.filter(function (def) {
          return def.dicType == $scope.modal.dicType;
        });
      } else {
        $scope.modal.selectedDataDictionaryDefs = null;
      }

    };

    $scope.modal.onDicNameChanged = function () {
      console.log($scope.modal.newRateSchemaEntryItem);
      var fieldAggAlgPromise = lookupService.getFieldAggregationAlgs($scope.modal.newRateSchemaEntryItem.dicDTO.type);
      fieldAggAlgPromise.then(function (data) {
          $scope.modal.selectedFieldAggregationAlgs = data;
          $scope.modal.ready = true;
        },
        function (error) {
          console.log(error);
          $scope.error = error;
          $scope.ready = true;
        });

    };

    $scope.modal.onAlgNameChanged = function () {
      console.log($scope.modal.newRateSchemaEntryItem);
    };

    $scope.modal.doSaveOp = function () {
      if ($scope.modal.currentRateSchemaDef.dictionaryItems == undefined) {
        $scope.modal.newRateSchemaEntryItem.visibilitySeq = 0;
      } else {
        $scope.modal.newRateSchemaEntryItem.visibilitySeq = $scope.modal.currentRateSchemaDef.dictionaryItems.length;
      }
      $scope.modal.newRateSchemaEntryItem.preSourceFieldCleansers = [];
      $scope.modal.newRateSchemaEntryItem.postSourceProcessors = [];
      $scope.modal.newRateSchemaEntryItem.rawRateFieldValidators = [];
      $scope.modal.newRateSchemaEntryItem.postAggregationFieldValidators = [];

      //validation
      var isExisting = false;
      angular.forEach($scope.modal.currentRateSchemaDef.dictionaryItems, function (item, index) {
        if (item.dicDTO.name == $scope.modal.newRateSchemaEntryItem.dicDTO.name) {
          $scope.modal.errorMessage = 'The name is existed in the list already';
          isExisting = true;
        }
      });

      console.log(isExisting);

      if (!isExisting && $scope.modal.currentRateSchemaDef.dictionaryItems != undefined) {
        $scope.modal.currentRateSchemaDef.dictionaryItems.push($scope.modal.newRateSchemaEntryItem);
        //$scope.modal.currentRateSchemaDef.dictionaryItems.sort(compareDataDictionary);
        $scope.modal.newRateSchemaEntryItem = {};
        $modalInstance.close($scope.modal.newRateSchemaEntryItem);
      }
    };

    /*
     function compareDataDictionary(a, b) {
     if (a.visibilitySeq < b.visibilitySeq)
     return -1;
     if (a.visibilitySeq > b.visibilitySeq)
     return 1;
     return 0;
     }*/


    $scope.modal.doCancelOp = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);