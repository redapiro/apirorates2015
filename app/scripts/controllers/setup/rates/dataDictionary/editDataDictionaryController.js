'use strict';

angular.module('ratesUiApp')
  .controller('editDataDictionaryController', ['$scope', 'notificationService', 'dataDictionaryService', 'configService',
    '$routeParams', '$q', '$location',
    function ($scope, notificationService, dataDictionaryService, configService, $routeParams, $q, $location) {
      var dataDictionaryId = $routeParams.dataDictionaryId;
      var referenceDataPromise = dataDictionaryService.getReferenceData();
      var dataDictionaryServicePromise;
      $scope.options = [];
      $scope.editMode = false;
      $scope.dataDictionary = {
        dicType: $routeParams.type,
        options: []
      };

      $scope.displayOptions = function(){
        return $routeParams.type === 'DIMENSION';
      };

      if(dataDictionaryId) {
        $scope.editMode = true;
        dataDictionaryServicePromise = dataDictionaryService.getById(dataDictionaryId);
      } else {
        dataDictionaryServicePromise = $q.when({
          dicType: $routeParams.type,
          options: []
        });
      }

      $q.all([referenceDataPromise, dataDictionaryServicePromise]).then(function (response) {
        $scope.types = response[0].types;
        $scope.dataDictionary = response[1];
        var count = 0;
        angular.forEach($scope.dataDictionary.options, function(option){
          $scope.options.push({
            id: count,
            option: option
          });
        });
      }, function (error) {

      });

      function goBack() {
        if($routeParams.type === 'DIMENSION'){
          $location.path('/setup/rates/definitions/dimensions');
        }

        if($routeParams.type === 'ATTRIBUTE'){
          $location.path('/setup/rates/definitions/attributes');
        }

        if($routeParams.type === 'PROPERTY'){
          $location.path('/setup/rates/definitions/properties');
        }
      }

      $scope.save = function () {
        $scope.inProgress = true;
        $scope.dataDictionary.options =[];
        angular.forEach($scope.options, function(updatedOption){
          $scope.dataDictionary.options.push(updatedOption.option);
        });
        dataDictionaryService.create($scope.dataDictionary).then(function (data) {
          $scope.dataDictionary.id = data;
          notificationService.sendInfo('Updated', 'Data dictionary is updated.');
          goBack();
        }, function (failure) {
          notificationService.sendInfo('Failure', 'Not able to save data dictionary.');
        });
      };

      $scope.hasOptions = function() {
        return $scope.options.length > 0;
      };

      $scope.remove = function (index) {
        $scope.options.splice(index, 1);
      };

      $scope.addNew = function() {
        $scope.options.push({
          id: $scope.options.length,
          option: ''
        });
      };

      $scope.cancel = function() {
          goBack();
      }
    }]);
