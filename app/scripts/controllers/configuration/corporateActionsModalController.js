'use strict';

angular.module('ratesUiApp')
  .controller('corporateActionsModalController', ['$rootScope', '$scope', 'notificationService', 'corporateActionsService',
    'lookupService', '$modalInstance',
    'bundle', '$q', function ($rootScope, $scope, notificationService, corporateActionsService, lookupService, $modalInstance,
                              bundle, $q) {

      $scope.modal = {};
      $scope.modal.format = 'dd/MM/yyyy';
      $scope.modal.saving = false;
      $scope.modal.currentDate = moment($rootScope.systemDate);

      $scope.modal.reject = function () {
        $modalInstance.close();
      };

      $scope.modal.market = {};
      $scope.modal.rateDefinition = {};
      $scope.modal.type = {};
      $scope.modal.market = {};
      $scope.modal.types = [];
      $scope.modal.corporateAction = {};

      // If editing, we have an id to load with
      if (bundle && bundle.id) {
        var promise = corporateActionsService.get(bundle.id);
        promise.then(function (corporateAction) {
          $scope.modal.corporateAction = corporateAction;
          $scope.modal.marketId = corporateAction.rateDefinition.marketId;
          $scope.modal.schemaId = corporateAction.rateDefinition.schemaId;
          if (bundle && bundle.id) {
            var promise = $scope.getRateDefinitionsForSymbolAndMarket(
              corporateAction.rateDefinition.symbol, $scope.modal.marketId, $scope.modal.schemaId);
            promise.then(function (retrieved) {
              if (retrieved && retrieved.length > 0) {
                $scope.modal.selectedRateDefinition = {id: retrieved[0].id, text: retrieved[0].name};
              }
            });
          }
        });
      }

      $scope.getRateDefinitionsForSymbolAndMarket = function (prefix, marketId, schemaId) {
        return lookupService.searchSymbol(prefix, marketId, schemaId);
      };

      $scope.$watch('modal.selectedDate', function (date) {
        if (date) {
          var newDate = moment(date);
          $scope.modal.corporateAction.effectiveDate = newDate.format('d/MM/YYYY');
        }
      });

      $scope.modal.marketChanged = function () {
        delete $scope.modal.selectedRateDefinition;
        delete $scope.modal.corporateAction.corporateActionType;
      };

      $scope.modal.changedRateDefinition = function () {

      };

      var corpActions = corporateActionsService.getTypes();
      $q.all([corpActions]).then(function (payloads) {
        $scope.modal.types = payloads[0];
      });

      $scope.modal.getRateDefinitions = function (prefix) {
        return lookupService.searchSymbol(prefix.data.query, $scope.modal.marketId).then(prefix.success);
      };

      $scope.modal.rateDefinitionSelect = {
        minimumInputLength: 0,
        ajax: {
          data: function (term, page) {
            return {
              query: term
            };
          },
          transport: $scope.modal.getRateDefinitions,
          results: function (data) {
            var results = [];
            for (var i = 0; i < data.length; i++) {
              results.push({id: data[i].name, text: data[i].name});
            }

            return {results: results}
          }
        },
        initSelection: function (element, page) {

        }
      };

      $scope.modal.getMarkets = function () {
        var promise = lookupService.searchMarkets();
        promise.then(function (response) {
          $scope.modal.markets = response;
        })
      };
      $scope.modal.getMarkets();


      $scope.modal.save = function () {
        $scope.modal.saving = true;
        var promise = corporateActionsService.save($scope.modal.corporateAction);
        promise.then(function (data) {
          $scope.modal.saving = false;
          $modalInstance.close();
        });
      }
    }]);
