'use strict';

angular.module('ratesUiApp')
  .directive('schemaDefinitionsNavTabs', ['$location','$routeParams','$location', function ($location, $routeParams) {
    return {
      templateUrl: '/views/directives/schemaDefinitionNavTabs.html',
      restrict: 'EA',
      replace: true,
      link: function postLink(scope, element, attrs) {
        var schemaDefinitionId = $routeParams.schmaDefinitionId;
        if($routeParams.schmaDefinitionId === 'new'){
          schemaDefinitionId = undefined;
        }

        scope.enableOtherTabs = function(){
          return schemaDefinitionId;
        };

        scope.isDataDictionary = function() {
          return scope.editView === 'editSchemaDefinitionDataDictionary';
        };

        scope.isPreSourceFieldCleanser = function () {
          return scope.editView === 'editSchemaDefinitionPreSourceFieldCleanser';
        };

        scope.isPostSourceProcessor = function () {
          return scope.editView === 'editSchemaDefinitionPostSourceProcessor';
        };

        scope.isRawFieldValidation = function () {
          return scope.editView === 'editSchemaDefinitionRawFieldValidation';
        };

        scope.isPostAggregationFieldValidation = function () {
          return scope.editView === 'postAggregationFieldValidation';
        };

        scope.goToDataDictionary = function() {
          $location.path('/setup/rates/definitions/schemaDefinitions/'+$routeParams.schmaDefinitionId);
        };

        scope.goToPreSourceFieldCleanser = function() {
          $location.path('/setup/rates/definitions/schemaDefinitions/'+$routeParams.schmaDefinitionId+'/preSourceFieldCleanser');
        };

        scope.goToPostSourceProcessor = function() {
          $location.path('/setup/rates/definitions/schemaDefinitions/'+$routeParams.schmaDefinitionId+'/postSourceProcessor');
        };

        scope.goToRawFieldValidation = function() {
          $location.path('/setup/rates/definitions/schemaDefinitions/'+$routeParams.schmaDefinitionId+'/rawFieldValidation');
        };

        scope.goToPostAggregationFieldValidation = function() {
          $location.path('/setup/rates/definitions/schemaDefinitions/'+$routeParams.schmaDefinitionId+'/postAggregationFieldValidation');
        };
      }
    };
  }]);