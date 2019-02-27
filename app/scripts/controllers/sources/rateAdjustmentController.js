'use strict';

angular.module('ratesUiApp')
  .controller('rateAdjustmentController', ['$scope', 'aggregatedService', 'feedImportService',
    'notificationService', '$modalInstance', 'rateBundle',
    function ($scope, aggregatedService, feedImportService, notificationService, $modalInstance, rateBundle) {
      $scope.modal = {};
      // display loader
      $scope.modal.ready = false;
      $scope.modal.loadedRate = {};
      $scope.modal.properties = [];
      $scope.modal.fullInvalidRate = true;
      $scope.modal.checkedAllStatus = true;
      $scope.modal.derivedValues = [];
      $scope.modal.displayManualEntry = true;
      $scope.modal.displayEntryCheckboxes = true;
      $scope.modal.enableSave = false;
      var props = [];

      /**
       * Go through all the dictionary values
       */
      var populateProperties = function (fullInvalidRate) {
        for (var property in fullInvalidRate.dictionaryValues) {
          var prop = fullInvalidRate.dictionaryValues[property];
          if (prop.dictionaryId) {
            if (prop.dictionaryType === 'DIMENSION' || prop.dictionaryType === 'PROPERTY') {
              props.push($scope.modal.dictionaryValues[property]);
            }
          }
          $scope.modal.properties = props;
        }
      };

      $scope.modal.aggregateTypes = ['Average', 'Manual'];

      $scope.modal.rawHeaders = [];
      $scope.modal.rawRateTableContents = [];

      $scope.modal.lastMarketCloseGoldenRateHeaders = [];
      $scope.modal.lastMarketCloseGoldenRateTableContents = [];

      $scope.modal.lastIntraDayGoldenTableContents = [];

      $scope.modal.algorithmOptions = [];
      $scope.modal.chosenAlgorithm = 'Average';
      $scope.modal.footers = [];

      /**
       * Build the table headers, and the algorithm options for each attribute
       * @param results
       */
      var extractHeaders = function (result, targetArray) {
        for (var property in result.dictionaryValues) {
          var prop = result.dictionaryValues[property];
          if (prop.dictionaryId) {
            if (prop.dictionaryType === 'ATTRIBUTE') {
              targetArray.push(prop.name);
            }
          }
        }
      };

      /**
       * Add the checked flag to all intraday objects
       * @param results
       */
      var processResults = function (results, targetArray) {
        if (!results) {
          return;
        }

        // Iterate over the headers, remove any non existing
        for (var i = 0; i < results.length; i++) {
          if (results[i] === null) {
            return;
          }
          var obj = {
            id: results[i].id,
            checked: true,
            values: [],
            sourceFeedName: results[i].sourceFeedName,
            marketDate: results[i].marketDate,
            creationDate: results[i].creationDate,
            dayCount: results[i].dayCount,
            violations: []
          };
          console.log(obj);

          for (var property in results[i].dictionaryValues) {
            var prop = results[i].dictionaryValues[property];
            if (prop.dictionaryType === 'ATTRIBUTE') {
              obj.violations = prop.violations;
              if (prop.violations && prop.violations.length > 0) {
                prop.selected = false;
              } else {
                prop.selected = true;
              }
              obj.values.push(prop);
            }
          }
          targetArray.push(obj);
        }

        // cull headers of ones we should not display
        for (i = 0; i < $scope.modal.rawHeaders.length; i++) {
          for (var j = 0; j < targetArray.length; j++) {
            for (var k = 0; k < targetArray[j].values.length; k++) {
              if (targetArray[j].values[k].name === $scope.modal.rawHeaders[i]) {
                targetArray[j].values[k].keep = true;
              }
            }
          }
        }

        for (j = 0; j < targetArray.length; j++) {
          for (k = 0; k < targetArray[j].values.length; k++) {
            if (!targetArray[j].values[k].keep) {
              targetArray[j].values.splice(k, 1);
              k = k - 1;
            }
          }
        }

      };

      /**
       * Add the checked flag to all intraday objects
       * @param results
       */
      var createResultsPlaceholders = function (results, targetArray) {
        if (!results && results.length == 0) {
          return;
        }

        for (var i = 0; i < results[0].values.length; i++) {
          targetArray.push({
              dictionaryId: results[0].values[i].dictionaryId,
              dictionaryName: results[0].values[i].dictionaryName,
              dictionaryType: results[0].values[i].dictionaryType,
              derived: 0
            }
          );
        }
      };

      /**
       * Find all details to build adjustments page
       */
      var adjustmentsPromise = aggregatedService.getAdjustmentsPayload(rateBundle.rateDefinitionId, rateBundle.rateInstanceId);
      adjustmentsPromise.then(function (results) {
        // Extract the headers for the raw tables
        $scope.modal.loadedRate = results.invalidRate;
        $scope.modal.dictionaryValues = results.invalidRateFull.dictionaryValues;
        populateProperties(results.invalidRateFull);
        extractHeaders(results.invalidRate, $scope.modal.rawHeaders);
        $scope.modal.rateDef = results.rateDefinition;

        // Process the raw3123312
        processResults(results.rawInstances, $scope.modal.rawRateTableContents);

        // process last golden rates
        var theArray = [];
        theArray.push(results.lastMarketCloseGoldenRate);
        processResults(theArray, $scope.modal.lastMarketCloseGoldenRateTableContents);

        // process last intraday
        var anotherArray = [];
        anotherArray.push(results.lastIntraDayGolden);
        processResults(anotherArray, $scope.modal.lastIntraDayGoldenTableContents);

        createResultsPlaceholders($scope.modal.rawRateTableContents, $scope.modal.derivedValues);

        for (var i = 0; i < $scope.modal.derivedValues.length; i++) {
          $scope.updateTotals($scope.modal.derivedValues[i].dictionaryName);
        }

        $scope.modal.ready = true;
      });


      $scope.modal.closeDialog = function () {
        $modalInstance.close();
      };

      /**
       * Invoked when a text box is changed
       */
      $scope.updateTotals = function (dictionaryName) {
        var addedCount = 0;
        var total = 0;


        var calculateAverage = function (tableValues) {
          for (var i = 0; i < tableValues.length; i++) {
            for (var j = 0; j < tableValues[i].values.length; j++) {
              if (tableValues[i].values[j].selected &&
                tableValues[i].values[j].dictionaryName === dictionaryName) {
                addedCount++;
                total += tableValues[i].values[j].typedValue;
              }
            }
          }
        };

        calculateAverage($scope.modal.rawRateTableContents);
        calculateAverage($scope.modal.lastMarketCloseGoldenRateTableContents);
        calculateAverage($scope.modal.lastIntraDayGoldenTableContents);

        var avg = total / addedCount;
        // update stuff
        for (var i = 0; i < $scope.modal.derivedValues.length; i++) {
          if ($scope.modal.derivedValues[i].dictionaryName === dictionaryName) {
            if (avg) {
              $scope.modal.derivedValues[i].derived = avg;
            } else {
              $scope.modal.derivedValues[i].derived = 0;
            }
          }
        }

        var val;
        var enabled = true;
        for (i = 0; i < $scope.modal.derivedValues.length; i++) {
          val = $scope.modal.derivedValues[i].derived;
          if (!val || val <= 0) {
            enabled = enabled && false;
          }
        }

        if (enabled && $scope.modal.loadedRate.locked) {
          enabled = false;
        }
        $scope.modal.enableSave = enabled;
        $scope.modal.locked = $scope.modal.loadedRate.locked;
      };

      $scope.algorithmChanged = function () {
        if ($scope.modal.chosenAlgorithm === 'Manual') {
          $scope.modal.displayManualEntry = true;
          $scope.modal.displayEntryCheckboxes = false;
        } else {
          $scope.modal.displayManualEntry = false;
          $scope.modal.displayEntryCheckboxes = true;
        }
      };


      /**
       * Called by ng-click on each row
       * @param intradayInstance
       */
      $scope.check = function (intradayInstance) {
        intradayInstance.checked = !intradayInstance.checked;
      };

      $scope.modal.displayVioltaionsArea = false;
      $scope.modal.violations = [];
      $scope.displayViolations = function (value) {
        $scope.violations = [];
        if (value && value.violations && value.violations.length > 0) {
          for (i = 0; i < value.violations.length; i++) {
            $scope.modal.violations.push(value.violations[i].message);
          }
        }
      };

      $scope.modal.save = function () {
        $scope.modal.ready = false;
        var payload = {
          id: rateBundle.rateInstanceId,
          rateDefinitionId: rateBundle.rateDefinitionId,
          entries: $scope.modal.derivedValues
        };
        aggregatedService.manualUpdate(payload, function (success) {
          $scope.modal.ready = true;
          notificationService.sendInfo('Updated', 'Rate was adjusted');
          $modalInstance.close();
        }, function (failure) {

        });
      };
    }]);
