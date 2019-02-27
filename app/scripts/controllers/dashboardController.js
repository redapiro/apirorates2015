'use strict';

angular.module('ratesUiApp').controller('dashboardController', ['$scope', 'graphStatsService', '$timeout', '$interval',
  '$rootScope', 'storageService', 'constantsService', 'feedImportService', 'notificationService',
  function ($scope, graphStatsService, $timeout, $interval, $rootScope, storageService, constantsService, feedImportService, notificationService) {
    jQuery('body').addClass('fixed-header');
    jQuery('.main-view').removeAttr('id');
    var loggedIn = storageService.fetchValue(constantsService.isLoggedIn());
    $rootScope.loggedIn = loggedIn;

    $scope.statsDataFromSocket = {};

    $scope.importAll = function () {
      feedImportService.importAll(function (success) {
        notificationService.sendInfo('Import started',
          'The import of all feeds has started');
      });
    };


    graphStatsService.getRawStats(function (statsDta) {

      console.log(statsDta);
    }, function (failureData) {

    });

    graphStatsService.getAggregatedStats(function (statsDta) {
      console.log(statsDta);
    }, function (failureData) {

    });

    var convertData = function (data) {
      if (!data) {
        return;
      }

      for (var i = 0; i < data.length; i++) {
        data[i].y = data[i].value;
      }
      return data;
    };

    var performLoad = function () {
      graphStatsService.getCombined(function (statsDta) {

      }, function (failureData) {

      });
    };
  }]);