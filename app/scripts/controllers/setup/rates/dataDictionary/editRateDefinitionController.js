'use strict';

angular.module('ratesUiApp')
  .controller('editRateDefinitionController', ['$scope', 'notificationService', 'rateDefinitionService', 'configService',
    '$routeParams', '$q', '$location', 'rateDefinitionService', 'lookupService',
    function ($scope, notificationService, rateDefinitionId, configService, $routeParams, $q, $location, rateDefinitionService, lookupService) {
      var rateDefinitionId = $routeParams.rateDefinitionId;
      $scope.editMode = false;
      if(rateDefinitionId){
        $scope.editMode = true;
      }
      var referenceDataPromise = rateDefinitionService.getReferenceData();
      var rateDefinitionServicePromise;
      $scope.options = [];
      if (rateDefinitionId) {
        rateDefinitionServicePromise = rateDefinitionService.getById(rateDefinitionId);
      } else {
        rateDefinitionServicePromise = $q.when({});
      }

      function prepareRateDefEntryItems() {
        var itemsForEdit = [];
        if (!$scope.rateDefinition.schemaDefinition) {
          return;
        }

        if ($scope.rateDefinition.schemaDefinition && $scope.rateDefinition.schemaDefinition.dictionaryItems) {
          angular.forEach($scope.rateDefinition.schemaDefinition.dictionaryItems, function (dictionary) {
            var obj = {
              dicType: dictionary.dicDTO.dicType,
              dictionaryId: dictionary.dicDTO.id,
              dictionaryName: dictionary.dicDTO.name,
              options: dictionary.dicDTO.options,
              type: dictionary.dicDTO.type
            };
            if (dictionary.dicDTO.dicType !== 'ATTRIBUTE') {
              itemsForEdit.push(obj);
            }
          });
        }

        // now populate existing options (if any)
        if ($scope.rateDefinition.rateDefEntryItems && $scope.rateDefinition.rateDefEntryItems.list) {
          angular.forEach($scope.rateDefinition.rateDefEntryItems.list, function (entryItem) {
            angular.forEach(itemsForEdit, function (itemForEdit) {
              if (itemForEdit.dictionaryId === entryItem.dictionaryId) {
                itemForEdit.typedValue = entryItem.typedValue;
              }
            });
          });
        }

        $scope.itemsForEdit = itemsForEdit;
        $scope.refresh = new Date();
      }

      $scope.itemsValid = true;
      $scope.$watch('itemsForEdit', function (changed) {
        $scope.itemsValid = true;
        angular.forEach(changed, function (value) {
          if (!value) {
            return;
          }

          if (value.type === 'STRING' ) {
            if(value.typedValue && value.typedValue>0) {
              value.typedValue = value.typedValue.trim();
              if(value.typedValue.length === 0){
                delete value.typedValue;
              }
            }
            else{
              if (!value.typedValue) {
                delete value.typedValue;
              }
            }
          }
          if (value.type === 'DOUBLE' && value.typedValue) {
            value.typedValue = parseDouble(value.typedValue);
          }
          if (value.type === 'DECIMAL' && value.typedValue) {
            value.typedValue = parseFloat(value.typedValue);
          }
          $scope.itemsValid = $scope.itemsValid && (value.typedValue != undefined);
          //console.log(value.typedValue);
          //console.log($scope.itemsValid);
        });
      }, true);

      $q.all([referenceDataPromise, rateDefinitionServicePromise]).then(function (response) {
        $scope.referenceData = response[0];
        $scope.rateDefinition = response[1];
        prepareRateDefEntryItems();
        $scope.$watch('rateDefinition.schemaDefinition', function (newDefinition) {
          prepareRateDefEntryItems();
        });
      }, function (error) {

      });

      function goBack() {
        $location.path('/setup/rates/definitions/rateDefinition');
      }

      $scope.getSymbols = function (prefix) {
        if ($scope.rateDefinition && $scope.rateDefinition.market) {
          lookupService.searchSymbolLabel(prefix, $scope.rateDefinition.market.id).then(function (values) {
            $scope.symbols = values;
          });
        }
      };

      $scope.save = function () {
        $scope.inProgress = true;
        if (!rateDefinitionId) {
          $scope.rateDefinition.rateDefEntryItems = {
            list: []
          }
        }

        $scope.rateDefinition.rateDefEntryItems.list = $scope.itemsForEdit;
        rateDefinitionService.save($scope.rateDefinition).then(function (data) {
          $scope.rateDefinition = data.object;
          prepareRateDefEntryItems();
          $scope.inProgress = false;
          notificationService.sendInfo('Updated', 'Rate definition has been updated.');
          goBack();
        }, function (failure) {
          $scope.inProgress = false;
          notificationService.sendError('Failure', 'Not able to save data dictionary.');
          console.log("save data dictionary failure : " + failure);
        });
      };

      $scope.cancel = function () {
        goBack();
      };

    }]);
