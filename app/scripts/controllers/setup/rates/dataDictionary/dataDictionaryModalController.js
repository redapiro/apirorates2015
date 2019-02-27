'use strict';

angular.module('ratesUiApp').controller('dataDictionaryModalController', ['$scope', 'notificationService', 'dataDictionaryService', '$modalInstance', 'bundle', '$q',
  function ($scope, notificationService, dataDictionaryService, $modalInstance, bundle, $q) {
    $scope.modal = {};
    $scope.modal.dataDictionary = {};

    if (bundle.dataDictionaryId != null) {
      var dataDictionaryPromise = dataDictionaryService.getById(bundle.dataDictionaryId);
      dataDictionaryPromise.then(function (data) {
        $scope.modal.dataDictionary.id = data.id;
        $scope.modal.dataDictionary.dicType = data.dicType;
        $scope.modal.dataDictionary.name = data.name;
        $scope.modal.dataDictionary.description = data.description;
        $scope.modal.dataDictionary.type = data.type;
        $scope.modal.dataDictionary.options = data.options;
      }, function (failure) {
        notificationService.sendInfo('Updated', 'Not able to get data dictionary.');
        console.log("get data dictionary failure : " + faliure);
      });
    } else {
      $scope.modal.dataDictionary.dicType = bundle.dicType;
    }

    var referenceDataPromise = dataDictionaryService.getReferenceData();
    referenceDataPromise.then(function (data) {
      $scope.modal.dicTypes = data.dicTypes;
      $scope.modal.types = data.types;
      console.log("get reference data : " + data);
    });

    $scope.modal.save = function () {
      $scope.modal.inProgress = true;
      console.log($scope.modal.dataDictionary);

      var createPromise = dataDictionaryService.create($scope.modal.dataDictionary);
      createPromise.then(function (data) {
        $scope.modal.dataDictionary.id = data.id;
        $scope.modal.inProgress = false;
        notificationService.sendInfo('Updated', 'Data dictionary is updated.');
        $modalInstance.close($scope.modal.dataDictionary);
      }, function (failure) {
        notificationService.sendInfo('Failure', 'Not able to save data dictionary.');
        console.log("save data dictionary failure : " + faliure);
      });

    };

    $scope.modal.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
