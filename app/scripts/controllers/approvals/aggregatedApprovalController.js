'use strict';

angular.module('ratesUiApp')
  .controller('aggregatedApprovalController', ['$scope', 'notificationService', 'approvalsService', 'aggregatedService',
    '$modalInstance', 'bundle', '$q',
    function ($scope, notificationService, approvalsService, aggregatedService, $modalInstance, bundle, $q) {
      $scope.modal = {};
      $scope.modal.submittedRate;
      $scope.modal.existingRate;


      $scope.approvalLoad = approvalsService.getById(bundle.approvalInstanceId);
      $scope.aggregatedRateLoad = aggregatedService.loadRateById(bundle.aggregatedInstanceId);

      var getAttributesByProp = function (fullInvalidRate, propertyName) {
        var arrayOfValues = [];
        for (var property in fullInvalidRate.dictionaryValues) {
          var prop = fullInvalidRate.dictionaryValues[property];
          if (prop.dictionaryId) {
            arrayOfValues.push(prop[propertyName]);
          }
        }
        return arrayOfValues;
      };

      $q.all([$scope.approvalLoad, $scope.aggregatedRateLoad]).then(function (approval) {
        $scope.modal.approvalEntity = approval[0];
        $scope.modal.submittedRate = approval[0].targetEntity;
        $scope.modal.existingRate = approval[1];
        $scope.modal.entityName = approval[0].entityName;

        var rowNames = getAttributesByProp($scope.modal.existingRate, 'name');

        var submittedDictionaryValues = getAttributesByProp($scope.modal.submittedRate, 'typedValue');
        var existingDictionaryValues = getAttributesByProp($scope.modal.existingRate, 'typedValue');

        // Create array of all values
        var allValues = [];
        allValues.push({
            'name': 'Currency',
            'oldValue': $scope.modal.existingRate.rateDefinition.currency,
            'submittedValue': $scope.modal.submittedRate.rateDefinition.currency,
            'match': $scope.modal.submittedRate.currency === $scope.modal.existingRate.currency
          }
        );

        allValues.push({
            'name': 'Symbol',
            'oldValue': $scope.modal.existingRate.rateDefinition.symbol,
            'submittedValue': $scope.modal.submittedRate.rateDefinition.symbol,
            'match': $scope.modal.submittedRate.symbol === $scope.modal.existingRate.symbol
          }
        );

        allValues.push({
            'name': 'Instrument',
            'oldValue': $scope.modal.existingRate.rateDefinition.instrumentType,
            'submittedValue': $scope.modal.submittedRate.rateDefinition.instrumentType,
            'match': $scope.modal.submittedRate.instrumentType === $scope.modal.existingRate.instrumentType
          }
        );

        allValues.push({
            'name': 'Schema',
            'oldValue': $scope.modal.existingRate.rateDefinition.schemaName,
            'submittedValue': $scope.modal.submittedRate.rateDefinition.schemaName,
            'match': $scope.modal.submittedRate.schemaName === $scope.modal.existingRate.schemaName
          }
        );


        for (var i = 0; i < rowNames.length; i++) {
          allValues.push({
            'name': rowNames[i],
            'oldValue': existingDictionaryValues[i],
            'submittedValue': submittedDictionaryValues[i],
            'match': existingDictionaryValues[i] === submittedDictionaryValues[i]
          })
        }

        $scope.modal.allValues = allValues;

        $scope.modal.approve = function () {
          var acceptedPromise = approvalsService.approve(bundle.approvalInstanceId);
          acceptedPromise.then(function () {
            notificationService.sendInfo('Updated', 'Change was approved');
            $modalInstance.close();
          });
        };

        $scope.modal.reject = function () {
          var rejectedPromise = approvalsService.reject(bundle.approvalInstanceId);
          rejectedPromise.then(function () {
            notificationService.sendInfo('Updated', 'Change was rejected');
            $modalInstance.close();
          });
        };

        $scope.modal.cancel = function () {
          $modalInstance.close();
        };

        $scope.modal.displayCloseButton = function () {
          if ($scope.modal.approvalEntity && $scope.modal.approvalEntity.approvalStatus) {
            return $scope.modal.approvalEntity.approvalStatus === 'SUBMITTED';
          }
          return false;
        }
      });
    }]);
