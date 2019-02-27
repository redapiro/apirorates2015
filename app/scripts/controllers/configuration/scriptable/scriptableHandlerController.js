'use strict';

/**
 * Fetch the scriptable entity so that we can present the edit custom form just for that type.
 */
angular.module('ratesUiApp')
  .controller('scriptableHandlerController', ['$scope', '$routeParams', 'scriptableTypeService', 'lookupService', '$location', 'notificationService',
    function ($scope, $routeParams, scriptableTypeService, lookupService, $location, notificationService) {
      $scope.scriptableInstanceId = $routeParams.scriptableInstanceId;
      $scope.baseEntity = $routeParams.baseEntity;
      $scope.mode = $routeParams.mode;
      $scope.isInstanceMode = ('instance' === $scope.mode);
      $scope.isDefinitionMode = ('definition' === $scope.mode);
      $scope.instanceForm = $routeParams.instanceForm;
      // Defaults for instances, overriden by definitions
      $scope.selectedLanguage = {
        displayAdvanced: true,
        displayName: 'Javascript',
        fieldName: 'Script',
        knownImplementationLanguage: 'JavaScript'
      };

      $scope.selectedTab = 'settings';

      $scope.setScriptTab = function() {
        $scope.selectedTab = 'script';
      };

      $scope.setSettingsTab = function() {
        $scope.selectedTab = 'settings';
      };


      $scope.isScriptTab = function() {
        return $scope.selectedTab === 'script';
      };

      $scope.isSettingsTab = function() {
        return $scope.selectedTab === 'settings';
      };


      function fetchLanguages() {
        lookupService.getScriptableLanguages().then(function (scriptableLangues) {
          $scope.implementationLanguages = scriptableLangues;
          for (var i = 0; i < $scope.implementationLanguages.length; i++) {
            if ($scope.instance.language ===
              $scope.implementationLanguages[i].knownImplementationLanguage) {
              $scope.selectedLanguage = $scope.implementationLanguages[i];
            }
          }
        });
      }

      $scope.createInstance = function (baseEntity) {
        $scope.instance = {};
        if ($scope.isInstanceMode) {
          scriptableTypeService.listAll($routeParams.scriptableEntity + 'Definition').then(function (definitions) {
            $scope.existingDefinitions = definitions;
          });
        }
        if ($scope.isDefinitionMode) {
          fetchLanguages();
        }
      };

      $scope.fetchInstance = function (baseEntity, scriptableInstanceId) {
        scriptableTypeService.getById(baseEntity, scriptableInstanceId).then(function (data) {
          $scope.instance = data;
          if ($scope.isInstanceMode) {
            scriptableTypeService.listAll($routeParams.scriptableEntity + 'Definition').then(function (definitions) {
              $scope.existingDefinitions = definitions;
              // Update the already selected definitions
              if (data.definitionId) {
                for (var i = 0; i < definitions.length; i++) {
                  if (definitions[i].id === data.definitionId) {
                    $scope.selectedDefinition = definitions[i];
                  }
                }
              }
            });
          }
          if ($scope.isDefinitionMode) {
            fetchLanguages();
          }
        }, function (failure) {
          //@TODO Display Error Page (part of audit)

        });
      };

      // Handle the update of the definition selection
      $scope.$watch('selectedDefinition', function (definition) {
        if(definition) {
          $scope.instance.definitionId = definition.id;
        }
      });

      //// Fix scriptable!
      //function jsonConfigToObjectFix () {
      //  if($scope.instance.jsonConfig){
      //    try {
      //      var object = JSON.parse($scope.instance.jsonConfig);
      //      $scope.instance.jsonConfig = object;
      //    }catch(exception) {
      //      // Ignore this, we want the server to do the validation of the object
      //    }
      //  }
      //}


      $scope.save = function () {
        //jsonConfigToObjectFix();
        var savePromise = scriptableTypeService.save($scope.baseEntity, $scope.instance);
        savePromise.then(function (data) {
          $location.path($routeParams.returnPath).search({});
          notificationService.sendInfo('Updated', 'Scriptable instance updated');
        }, function (failure) {
          if (failure && failure.errorMessages) {
            $scope.errorMessages = failure.errorMessages;
          }
        });
      };

      $scope.cancel = function() {
        $location.path($routeParams.returnPath).search({});
      };

      $scope.$watch('instance.', function (language) {
        if(language) {
          $scope.instance.language = language.knownImplementationLanguage;
        }
      });

      $scope.$watch('selectedLanguage', function (language) {
        //if(language) {
        //  $scope.instance.language = language.knownImplementationLanguage;
        //}
      });

      // Perform the load based on request
      if($scope.scriptableInstanceId) {
        $scope.fetchInstance($scope.baseEntity, $scope.scriptableInstanceId);
      }else{
        $scope.createInstance($scope.baseEntity);
      }

      $scope.doCancelOp = function () {
        $location.path($routeParams.returnPath);
      };

      var _session;
      var _renderer;
      var editor;

      $scope.aceLoaded = function (_editor) {
        editor = _editor;
        // Editor part
        _session = _editor.getSession();
        _renderer = _editor.renderer;
        _renderer.setShowGutter(true);

        // Options
        _editor.setReadOnly(false);
        _session.setUndoManager(new ace.UndoManager());
        _renderer.setShowGutter(true);
        _editor.setReadOnly(false);

        // Events
        _editor.on("changeSession", function () {

        });
        _session.on("change", function () {
        });
      };

      $scope.$watch('selectedLanguage', function (value) {

        if (value) {
          $scope.selectedLanguage = value;
          $scope.displayAdvanced = value.displayAdvanced;
//              editor.setTheme("ace/theme/github");
          editor.getSession().setUseWorker(false);
          editor.setReadOnly(false);
          _session.setMode('ace/mode/' + value.knownImplementationLanguage.toLowerCase());
          editor.focus();
        } else {
          // Default to text for unkown stuff
          _session.setMode('ace/mode/text');
        }
      });
    }]);
