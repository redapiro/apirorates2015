'use strict';

angular.module('ratesUiApp').controller('editSchemaDefinitionPreSourceFieldCleanserController', ['$scope', 'configService', '$location',
  'constantsService',
  'storageService',
  'schemaDefinitionHelper',
  function ($scope, configService, $location,
            constantsService, storageService, schemaDefinitionHelper) {
    $scope.editView = 'editSchemaDefinitionPreSourceFieldCleanser';
    //List Rate Schema Definition in Left Column
    $scope.field = 'preSourceFieldCleansers';
    $scope.referenceField = 'preSourceFieldCleanserInsts';
    $scope.supportedDictionaryItems = [];

    schemaDefinitionHelper.init($scope, $scope.field, $scope.referenceField);

    $scope.$watch('selectedDictionary', function (item) {
      if(!$scope.schemaDefinition) {
        return;
      }
      for(var i=0; i < $scope.schemaDefinition.dictionaryItems.length; i++){
        if($scope.schemaDefinition.dictionaryItems[i].dicDTO.id === item.dicDTO.id) {
          $scope.schemaDefinition.dictionaryItems[i] = item;
        }
      }
    });
    //
    $scope.$watch('schemaDefinition', function(changes){
      storageService.saveObject(constantsService.getSchemaDefinition(), $scope.schemaDefinition);
    }, true);

    function back() {
      $location.path('/setup/rates/definitions/schemaDefinitions');
    }

    $scope.doSaveOp = function () {
      schemaDefinitionHelper.save($scope, $scope.field, $scope.referenceField);
    };

    $scope.doCancelOp = function () {
      back();
    }

  }]);