'use strict';

angular.module('ratesUiApp').controller('editSchemaDefinitionDataDictionaryController', ['$scope', 'notificationService',
  'rateSchemaService', 'configService', '$routeParams', '$q', '$location', 'ngProgressLite', 'constantsService', 'storageService',
  function ($scope, notificationService, rateSchemaService, configService, $routeParams, $q, $location, ngProgressLite,
            constantsService, storageService) {
    $scope.editView = 'editSchemaDefinitionDataDictionary';

    //List Rate Schema Definition in Left Column
    $scope.columns = [];
    $scope.datasourceUrl = configService.getHost() + '/config/rateSchemaDef/search';
    $scope.ready = false;

    var schemaDefinitionId = $routeParams.schmaDefinitionId;
    if($routeParams.schmaDefinitionId === 'new'){
      schemaDefinitionId = null;
    }

    // Check if we are editing one already
    var schemaToEdit = storageService.fetchObject(constantsService.getSchemaDefinition());

    var referenceDataPromise = rateSchemaService.getReferenceData();
    ngProgressLite.start();
    if(schemaDefinitionId){
      var schemaDefPromise;
      if(schemaToEdit){
        schemaDefPromise = $q.when(schemaToEdit);
      } else {
        // Fetch from server if this is a fresh request
        schemaDefPromise = rateSchemaService.getById(schemaDefinitionId);
      }

      $q.all([schemaDefPromise, referenceDataPromise]).then(function(results){
        $scope.schemaDefinition = results[0];
        // enumerate a fake id for tracking
        for(var i=0; i<$scope.schemaDefinition.dictionaryItems.length; i++){
          $scope.schemaDefinition.dictionaryItems[i].id = i;
          if(!$scope.schemaDefinition.dictionaryItems[i].aggregationAlgorithmInstance){
            $scope.schemaDefinition.dictionaryItems[i].aggregationAlgorithmInstance = {
              id: '-1',
              name: ''
            };
          }
        }

        $scope.referenceData = results[1];
        // Save to local store for usage across edits
        $scope.ready = true;
        storageService.saveObject(constantsService.getSchemaDefinition(), results[0]);
        ngProgressLite.done();
      });
    } else {
      $q.all([referenceDataPromise]).then(function(results){
        $scope.referenceData = results[0];
        $scope.schemaDefinition = {
          dictionaryItems: []
        };
        $scope.ready = true;
        ngProgressLite.done();
      }, function(error){
        ngProgressLite.done();
      });
    }

    $scope.$watch('schemaDefinition', function(changes){
      storageService.saveObject(constantsService.getSchemaDefinition(), changes);
    }, true);

    function back() {
      $location.path('/setup/rates/definitions/schemaDefinitions');
    }

    $scope.doSaveOp = function () {
      $scope.inProgress = true;
      // Clean up unset algs
      ngProgressLite.start();
      var savePromise = rateSchemaService.save($scope.schemaDefinition);
      savePromise.then(function (data) {
        delete $scope.errorMessages;
        var isNew = !$scope.schemaDefinition.id;
        $scope.schemaDefinition = data.object;
        $scope.refreshView = new Date();
        if(isNew) {
          $location.path('/setup/rates/definitions/editSchemaDefinitionDataDictionary').search({'schmaDefinitionId': $scope.schemaDefinition.id});
        }
        notificationService.sendInfo('Updated', 'Rate schema definition updated');
        ngProgressLite.done();
      }, function (failure) {
        $scope.errorMessages = failure.errorMessages;
        ngProgressLite.done();
      });
    };

    $scope.doCancelOp = function() {
      back();
    };
  }]);