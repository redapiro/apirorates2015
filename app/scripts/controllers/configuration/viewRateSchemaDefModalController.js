'use strict';

angular.module('ratesUiApp').controller('viewRateSchemaDefModalController',
  ['$scope', 'rateSchemaService', 'dataDictionaryService', 'dataFeedsService', 'violationService', '$modalInstance', 'schemaDefId',
    function ($scope, rateSchemaService, dataDictionaryService, dataFeedsService, violationService, $modalInstance, schemaDefId) {
      $scope.modal = {};
      $scope.modal.currentRateSchemaDef = {};
      $scope.modal.dataDictionaryItems = [];
      $scope.modal.validationDefs = [];
      $scope.modal.validationChecksHeader = [];
      $scope.modal.validationChecksMap = [];
      $scope.modal.validationChecks = [];

      dataDictionaryService.listAll(function (data) {
          $scope.modal.dataDictionaryDefs = data;
        },
        function (error) {
          $scope.error = error;
        });

      dataFeedsService.listFeedsDefinition(function (data) {
          $scope.modal.feedsDefinitions = data;
        },
        function (error) {
          $scope.error = error;
        });

      violationService.listAllPostAggRateFieldValidationDefinition(function (data) {
          $scope.modal.validationDefs = $scope.modal.validationDefs.concat(data);
          $scope.modal.postAggRateFieldValidatorDefs = data;
          setUpValidationChecks(data, 'agg');
        },
        function (error) {
          $scope.error = error;
        });

      violationService.listAllRawRateFieldValidationDefinition(function (data) {
          $scope.modal.validationDefs = $scope.modal.validationDefs.concat(data);
          $scope.modal.rawValidationDefinitionDefs = data;
          setUpValidationChecks(data, 'raw');
        },
        function (error) {
          $scope.error = error;
        });

      if (schemaDefId != null) {
        rateSchemaService.getRateSchemaDef(schemaDefId, function (data) {
          $scope.modal.currentRateSchemaDef = data;
        }, function (failure) {
          //TODO : failure
        });

        $scope.currentTab = 'dataDictionary',
          dataFeedsService.getFeedInstances(schemaDefId, function (data) {
              $scope.modal.dataFeedsInstances = data;
              $scope.modal.minimumDataFeedsRequired = $scope.modal.dataFeedsInstances.length;
            },
            function (error) {
              //TODO : failure
            });
      }

      $scope.$watch(function () {
        return $scope.modal.currentRateSchemaDef;
      }, function (newItems, oldItems) {

        //enable validationChecksHeader
        $scope.modal.validationChecksHeader = [];
        $scope.modal.validationChecksMap = [];
        $scope.modal.dataDictionaryItems = [];

        if ($scope.modal.dataDictionaryDefs != undefined) {
          for (var i = 0; i < $scope.modal.dataDictionaryDefs.length; i++) {
            var def = $scope.modal.dataDictionaryDefs[i];

            if (def.id in $scope.modal.currentRateSchemaDef.dictionaryitems) {

              var dicItem = $scope.modal.currentRateSchemaDef.dictionaryitems[def.id];

              /* build dataDictionaryItems*/
              var item = {
                id: def.id,
                type: def.dicType,
                name: def.name, //dicDefName
                dataType: def.type,
                visible: dicItem.visible,
                visibilitySeq: dicItem.visibilitySeq,
                showUIFilter: dicItem.showUIFilter
              }
              $scope.modal.dataDictionaryItems.push(item);
              $scope.modal.dataDictionaryItems.sort(compareDataDictionary);

              /* build validation col header and map */
              if (def.dicType == 'ATTRIBUTE') {

                var header = {name: item.name, visible: item.visible};
                $scope.modal.validationChecksHeader.push(header);
                $scope.modal.validationChecksMap[item.name] = [];
                for (var y = 0; y < $scope.modal.validationChecks.length; y++) {

                  $scope.modal.validationChecksMap[item.name][$scope.modal.validationChecks[y].name] = -1;

                  //set validationCheckInstanceId here if exists in dicItem
                  if (dicItem.postAggregationFieldValidatorIds.length > 0) {
                    for (var z = 0; z < $scope.modal.validationChecks[y].instances.length; z++) {
                      if (dicItem.postAggregationFieldValidatorIds.indexOf($scope.modal.validationChecks[y].instances[z].id) > -1) {
                        $scope.modal.validationChecksMap[item.name][$scope.modal.validationChecks[y].name] = $scope.modal.validationChecks[y].instances[z].id;
                      }
                    }
                  }
                  if (dicItem.rawRateFieldValidatorIds.length > 0) {
                    for (var z = 0; z < $scope.modal.validationChecks[y].instances.length; z++) {
                      if (dicItem.rawRateFieldValidatorIds.indexOf($scope.modal.validationChecks[y].instances[z].id) > -1) {
                        $scope.modal.validationChecksMap[item.name][$scope.modal.validationChecks[y].name] = $scope.modal.validationChecks[y].instances[z].id;
                      }
                    }
                  }
                }

              }
            }
          }

        }

      });

      function compareDataDictionary(a, b) {
        if (a.visibilitySeq < b.visibilitySeq)
          return -1;
        if (a.visibilitySeq > b.visibilitySeq)
          return 1;
        return 0;
      }

      function setUpValidationChecks(validationDefs, type) {
        if (validationDefs != undefined) {
          for (var i = 0; i < validationDefs.length; i++) {
            var validationCheck = {
              id: validationDefs[i].id,
              name: validationDefs[i].name,
              type: type,
              instances: {}
            };
            $scope.modal.validationChecks.push(validationCheck);
            getInstances(validationCheck.id, type);
          }
        }
      }

      function getInstances(id, type) {
        var noneInstance = {
          id: -1,
          name: "-"
        };

        if (type == 'agg') {
          violationService.getPostAggValInsByDefId(id, function (data) {
              for (var i = 0; i < $scope.modal.validationChecks.length; i++) {
                if ($scope.modal.validationChecks[i].id == id) {
                  $scope.modal.validationChecks[i].instances = data;
                  $scope.modal.validationChecks[i].instances.push(noneInstance);
                }
              }
            },
            function (error) {
              $scope.error = error;
            });
        } else if (type == 'raw') {
          violationService.getRawValInsByDefId(id, function (data) {
              for (var i = 0; i < $scope.modal.validationChecks.length; i++) {
                if ($scope.modal.validationChecks[i].id == id) {
                  $scope.modal.validationChecks[i].instances = data;
                  $scope.modal.validationChecks[i].instances.push(noneInstance);
                }
              }
            },
            function (error) {
              $scope.error = error;
            });
        }
      }

      $scope.displayNonVisibleDictionaryItem = function () {
        var message = null;
        var attrs = "";
        var msg1 = "The attributes ";
        for (var x = 0; x < $scope.modal.validationChecksHeader.length; x++) {
          if ($scope.modal.validationChecksHeader[x].visible == false) {
            if (attrs.length == 0) {
              attrs = $scope.modal.validationChecksHeader[x].name;
            } else {
              attrs = $scope.modal.validationChecksHeader[x].name + ", " + attrs;
            }
          }
        }
        var msg2 = " are non visible.";

        if (attrs.length > 0) {
          message = msg1 + attrs + msg2;
        }

        return message;
      }

      $scope.toggleDataFeedSection = function (instance, $event) {
        instance.showSection = !instance.showSection;
      };

      $scope.switchTab = function (tab) {
        $scope.currentTab = tab;
      };

      $scope.modal.cancel = function () {
        $modalInstance.dismiss('cancel');
      }

    }]);