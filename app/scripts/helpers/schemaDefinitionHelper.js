'use strict';

angular.module('ratesUiApp').service('schemaDefinitionHelper',
  ['notificationService',
    'rateSchemaService', 'configService', '$routeParams', '$q', '$location', 'ngProgressLite', 'constantsService',
    'storageService', function (notificationService, rateSchemaService, configService, $routeParams, $q, $location, ngProgressLite,
                constantsService, storageService) {

    var _doSave = function (id) {
    };

    function prepareItemsForSave(scope, field, referenceField) {
      var dictionaryItem;
      for (var a = 0; a < scope.schemaDefinition.dictionaryItems.length; a++) {
        dictionaryItem = scope.schemaDefinition.dictionaryItems[a];
        dictionaryItem[field] = [];
        dictionaryItem[field] = JSON.parse(JSON.stringify(dictionaryItem.items));
        for (var i = 0; i < dictionaryItem.items.length; i++) {
          var obj = dictionaryItem.items[i];
          if (!obj.enabled) {
            for (var j = 0; j < dictionaryItem[field].length; j++)
              if (obj.id === dictionaryItem[field][j].id) {
                dictionaryItem[field].splice(j, 1);
              }
          }
        }
      }
    }
    

    var _init = function(scope, field, referenceField){
      var schemaDefinitionId = $routeParams.schmaDefinitionId;
      var schemaToEdit = storageService.fetchObject(constantsService.getSchemaDefinition());
      var referenceDataPromise = rateSchemaService.getReferenceData();

      ngProgressLite.start();
      if (schemaDefinitionId) {
        // Check that one is already in the local store, use that if it use it
        var schemaDefPromise;
        if (schemaToEdit) {
          schemaDefPromise = $q.when(schemaToEdit);
        } else {
          // Fetch from server if this is a fresh request
          schemaDefPromise = rateSchemaService.getById(schemaDefinitionId);
        }
        $q.all([schemaDefPromise, referenceDataPromise]).then(function (results) {
          scope.schemaDefinition = results[0];
          scope.referenceData = results[1];

          var array = [];

          // Prepare available data types
          var typesObject = {};
          angular.forEach(scope.referenceData[referenceField], function (instance) {
            typesObject[instance.supportedType] = true;
          });

          angular.forEach(scope.schemaDefinition.dictionaryItems, function (dictionaryItem) {
            dictionaryItem.items = [];
            dictionaryItem.dicDTOId = dictionaryItem.dicDTO.id;
            dictionaryItem.dicDTOName = dictionaryItem.dicDTO.name;
            dictionaryItem.items = JSON.parse(JSON.stringify(dictionaryItem[field]));
            angular.forEach(scope.referenceData[referenceField], function (instance) {
              angular.forEach(dictionaryItem.items, function (item, key) {
                if (item.id === instance.id)
                  dictionaryItem.items[key] = JSON.parse(JSON.stringify(instance));
                dictionaryItem.items[key].enabled = true;
              });
            });

            angular.forEach(scope.referenceData[referenceField], function (instance) {
              if (!instance.supportedType || (instance.supportedType === dictionaryItem.dicDTO.type)) {
                var cloned = JSON.parse(JSON.stringify(instance));
                // check if not already part of dictionaryItem
                var alreadyDone = false;
                for (var i = 0; i < dictionaryItem[field].length; i++) {
                  if (cloned.id === dictionaryItem[field][i].id) {
                    cloned.enabled = true;
                    dictionaryItem[field][i] = cloned;
                    alreadyDone = true;
                  }
                }
                if (!alreadyDone) {
                  cloned.enabled = false;
                  dictionaryItem.items.push(cloned);
                }
              }
            });

            //
            if (dictionaryItem.items.length > 0) {
              dictionaryItem.selectDisplayName = dictionaryItem.dicDTO.name + ' - ' + dictionaryItem.dicDTO.displayName + ' (' + dictionaryItem[field].length + ' active)';
              array.push(dictionaryItem);
            }
          });

          scope.supportedDictionaryItems = array;

          scope.ready = true;
          //scope.refreshView = new Date();
          ngProgressLite.done();
        });
      }
    }

    var _save = function(scope, field, referenceField){
      scope.inProgress = true;
      ngProgressLite.start();
      // Clean up unset algs
      prepareItemsForSave(scope, field);
      var savePromise = rateSchemaService.save(scope.schemaDefinition);
      savePromise.then(function (data) {
        storageService.remove(constantsService.getSchemaDefinition());
        //scope.schemaDefinition = data.object;
        //back();
        notificationService.sendInfo('Updated', 'Rate schema definition updated');
        //scope.refreshView = new Date();
        ngProgressLite.done();
        _init(scope, field, referenceField);
      }, function (failure) {
        scope.errorMessages = failure.errorMessages;
      });
    }



    return {
      init: function (scope, field, referenceField) {
        return _init(scope, field, referenceField);
      },
      save: function (scope, field, referenceField) {
        return _save(scope, field, referenceField);
      }
    };
  }]);
