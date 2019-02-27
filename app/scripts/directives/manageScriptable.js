'use strict';

angular.module('ratesUiApp')
  .directive('manageScriptable', ['scriptableTypeService', 'notificationService', '$location', '$routeParams',
    function (scriptableTypeService, notificationService, $location, $routeParams) {
      return {
        templateUrl: 'views/directives/scriptable/manageScriptable.html',
        restrict: 'E',
        replace: true,
        scope: {
          scriptableEntity: '=',
          instanceForm: '=instanceForm',
          definitionForm: '=definitionForm',
          gridTitle: '=gridTitle'
        },
        link: function postLink(scope, element, attrs) {
          if (!scope.scriptableEntity) {
            throw new Error('Scriptable Definition requires a valid entity. Supplied value was: ' + scope.scriptableEntity);
          }

          var path = 'configuration';

          if(attrs.configArea){
            path = 'setup';
          }

          if($routeParams.mode){
            scope.mode = $routeParams.mode;
          } else {
            scope.mode = 'instance';
          }

          scope.columns = [];
          scope.extraColumnsToAdd = [];
          scope.refreshView = new Date();
          scope.editMode = false;
          scope.scriptEntity = {};
          scope.refreshReferenceData = new Date();
          scope.serverValidationError = null;

          var resetModes = function () {
            scope.isInstanceMode = ('instance' === scope.mode);
            scope.isDefinitionMode = ('definition' === scope.mode);
          };
          resetModes();

          scope.enableDefinitions = function () {
            scope.mode = 'definition';
            scope.refreshReferenceData = new Date();
            resetModes();
            $location.path($location.path()).search('mode', 'definition');
          };

          scope.enableInstances = function () {
            scope.mode = 'instance';
            scope.refreshReferenceData = new Date();
            resetModes();
            $location.path($location.path()).search('mode', 'instance');
          };

          scope.baseEntity = scope.scriptableEntity;

          scope.gridAction = {};
          scope.gridAction.title = "Create";
          scope.gridAction.icon = "fa fa-plus";
          scope.gridAction.action = function () {
            var searchObj = {
              baseEntity: scope.baseEntity,
              mode: scope.mode,
              scriptableEntity: scope.scriptableEntity,
              returnPath: $location.path()
            };

            if(scope.instanceForm){
              searchObj.instanceForm = scope.instanceForm;
            }

            if(scope.definitionForm){
              searchObj.definitionForm = scope.definitionForm;
            }

            $location.path('/'+path+'/scriptable/scriptableHandler').search(searchObj);
          };

          scope.fetchInstance = function (scriptableInstance) {
            if (scriptableInstance && scriptableInstance.id) {
              var getPromise = scriptableTypeService.getById(scope.baseEntity, scriptableInstance.id);
              getPromise.then(function (data) {
                scope.editMode = true;
                scope.scriptEntity = data;
              }, function (failure) {
                console.log("get post aggregation validation definition : " + failure);
              });
            } else {
              scope.scriptEntity = {};
              scope.editMode = true;
            }
          };


          scope.extraColumnsToAdd.push(
            {
              command: [
                {
                  /**
                   * This is actioned with the data used to render the table, open your modals and
                   * other functionality here
                   * @param dataItem
                   */
                  doOnClick: function (dataItem) {
                    if(dataItem.id){
                      var searchObj = {
                        scriptableInstanceId: dataItem.id,
                        baseEntity: scope.baseEntity,
                        mode: scope.mode,
                        scriptableEntity: scope.scriptableEntity,
                        returnPath: $location.path()
                      };

                      if(scope.instanceForm){
                        searchObj.instanceForm = scope.instanceForm;
                      }

                      if(scope.definitionForm){
                        searchObj.definitionForm = scope.definitionForm;
                      }

                      scope.$apply(function() {
                        if(attrs.linkUrl){
                          $location.path(attrs.linkUrl).search(searchObj);
                        }else {
                          $location.path('/' + path + '/scriptable/scriptableHandler').
                            search(searchObj);
                        }
                      });
                    }
                  },
                  /**
                   * This is not important, but supplied
                   */
                  name: 'Edit',
                  /**
                   * This is the name of the label on the button
                   */
                  text: 'Edit',
                  /**
                   * Sets the icon for the button
                   */
                  imageClass: 'k-icon k-i-pencil',
                  /**
                   * Applies style to be 100%
                   */
                  className: 'full-width'
                }
              ]
            });

          scope.$watch('mode', function () {
            scope.baseEntity = scope.scriptableEntity + '';
            if (scope.isInstanceMode) {
              scope.baseEntity = scope.baseEntity + 'Instance';
            } else {
              scope.baseEntity = scope.baseEntity + 'Definition';
            }

            var promise = scriptableTypeService.findColumns(scope.baseEntity);
            promise.then(function (data) {
                scope.columns = data;
                scope.datasourceUrl = scriptableTypeService.getDataSourceSearchUrl(scope.baseEntity);
                scope.ready = true;
              },
              function (error) {
                console.log(error);
                scope.error = error;
                scope.ready = true;
              });
          });

          scope.doCancel = function () {
            scope.editMode = false;
            scope.refreshView = new Date();
          };

          scope.save = function () {
            scope.inProgress = true;
            var savePromise = scriptableTypeService.save(scope.baseEntity, scope.scriptEntity);
            savePromise.then(function (data) {
              scope.editMode = false;
              scope.refreshView = new Date();
              notificationService.sendInfo('Updated', 'Scriptable instance updated');
            }, function (failure) {
              if (failure && failure.errorMessages) {
                scope.serverValidationError = failure;
              }
            });
          };
        }
      };
    }]);
