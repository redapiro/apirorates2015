'use strict';

angular.module('ratesUiApp')
  .directive('scriptable', ['$location', 'lookupService', 'scriptableTypeService', '$compile', function ($location, lookupService,
                                                                                                         scriptableTypeService, $compile) {
    return {
      templateUrl: 'views/directives/scriptable/scriptable.html',
      restrict: 'E',
      replace: true,
      scope: {
        instance: '=instance',
        recreateTable: '=recreateTable',
        scriptableEntityType: '=scriptableEntityType',
        refreshReferenceData: '=refreshReferenceData',
        mode: '=mode',
        existingDefinitions: '=instanceForm',
        definitionForm: '=definitionForm',
        onSave: '&',
        onCancel: '&',
        validationFailure: '=validationFailure'
      },
      link: {
        pre: function preLink(scope, element, attrs) {

        },
        post: function postLink(scope, element, attrs) {
          scope.location = $location.$$path;
          var resetModes = function () {
            scope.isInstanceMode = ('instance' === scope.mode);
            scope.isDefinitionMode = ('definition' === scope.mode);
            scope.showForm = true;
          };

          scope.existingDefinitions = [];
          resetModes();
          if (scope.instanceForm) {
            if ($('#customFormElements').length === 0) {
              var theElement = element.find('div[instance-form]');
              theElement.html(('<' + scope.instanceForm + ' id="customFormElements"></' + scope.instanceForm + '>'));
              $compile(theElement)(scope);
            }
          }

          if (scope.definitionForm) {
            if ($('#definitionCustomFormElements').length === 0) {
              var theElement = element.find('div[definition-form]');
              theElement.html(('<' + scope.definitionForm + ' id="definitionCustomFormElements"></' + scope.definitionForm + '>'));
              $compile(theElement)(scope);
            }
          }

          scope.$watch('mode', function () {
            resetModes();
          });

          scope.implementationLanguages = [];
          scope.selectedLanguage = {fieldName: 'Script'};

          scope.displayAdvanced = false;
          scope.scriptableEntity = {};
          scope.showingScript = true;
          scope.showForm = true;
          scope.isShowForm = function () {
            return scope.showForm;
          };

          scope.setShowForm = function () {
            return scope.showForm = true;
          };

          scope.unsetShowForm = function () {
            return scope.showForm = false;
          };


          scope.showScript = function () {
            scope.showingScript = true;
          };

          scope.hideScript = function () {
            scope.showingScript = false;
          };

          var _session;
          var _renderer;
          var editor;

          scope.aceLoaded = function (_editor) {
            editor = _editor;
            // Editor part
            _session = _editor.getSession();
            _renderer = _editor.renderer;
            _renderer.setShowGutter(true);

            // Options
            _editor.setReadOnly(false);
            _session.setUndoManager(new ace.UndoManager());
            _renderer.setShowGutter(true);
            _editor.setReadOnly(true);

            // Events
            _editor.on("changeSession", function () {

            });
            _session.on("change", function () {
            });
          };

          scope.$watch('language', function (value) {
            if (value) {
              scope.selectedLanguage = value;
              scope.displayAdvanced = value.displayAdvanced;
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

          var scriptableLanguages = lookupService.getScriptableLanguages();
          scriptableLanguages.then(function (scriptableLangues) {
            scope.implementationLanguages = scriptableLangues;
            scope.$watch('instance', function (value) {
              scope.showScript();
              if (!scope.instance) {
                scope.instance = {};
                scope.instance = {
                  name: '',
                  description: '',
                  language: '',
                  script: '',
                  jsonSchema: ''
                };
              }

              if (value && value.language) {
                for (var i = 0; i < scope.implementationLanguages.length; i++) {
                  if (value.language ===
                    scope.implementationLanguages[i].knownImplementationLanguage) {
                    scope.language = scope.implementationLanguages[i];
                  }
                }
              }
            });
          });

          scope.$watch('refreshReferenceData', function () {
            if (scope.isInstanceMode) {
              var promise = scriptableTypeService.listAll(scope.scriptableEntityType + 'Definition');
              promise.then(function (data) {
                scope.existingDefinitions = data;
              });
            }
          });

          scope.$watch('validationFailure', function (changedValidation) {
            if (changedValidation) {
              scope.validationError = changedValidation;
            }
          });

          scope.doSaveOp = function () {
            if (scope.isDefinitionMode) {
              scope.instance.language = scope.selectedLanguage.knownImplementationLanguage;
            }
            scope.onSave();
          };

          scope.doCancelOp = function () {
            scope.onCancel();
          };

          scope.isValidLanguage = function () {
            return scope.scriptableEntity.language.length > 0;
          }
        }
      }
    };
  }]);
