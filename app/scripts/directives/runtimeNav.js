'use strict';

angular.module('ratesUiApp').directive('runtimeNav', ['$location', 'constantsService', 'storageService',
  function ($location, constantsService, storageService) {
    return {
      templateUrl: 'views/directives/runtimeNav.html',
      restrict: 'A',
      replace: true,
      link: function postLink(scope, element, attrs) {
        var location = $location.$$path;
        scope.isDashboard = function () {
          return location === '/runtime/dashboard';
        };

        scope.isSources = function () {
          return location.indexOf('sources') > -1;
        };

        scope.isRaw = function () {
          return location.indexOf('sources/raw') > -1;
        };

        scope.isAggregated = function () {
          return location.indexOf('sources/aggregated') > -1;
        };

        scope.isHistorical = function () {
          return location.indexOf('sources/historical') > -1;
        };

        scope.isCrossRate = function () {
          return location.indexOf('sources/crossRate') > -1;
        };

        scope.isAudit = function () {
          return location.indexOf('audit') > 0;
        };

        scope.isApprovals = function () {
          return location.indexOf('approvals') > 0;
        };

        scope.isRateCollections = function () {
          return location.indexOf('/rateCollection/main') > -1;
        };

        scope.isRateDistributions = function () {
          return location.indexOf('/rateDistribution/main') > -1;
        };

        scope.isConfiguration = function (subpage) {
          return _.isUndefined(subpage) ? location.indexOf('configuration') > 0 :
          location.indexOf('configuration/' + subpage) > 0;
        };
//
//        scope.sourcesSelector = function () {
//          var selected = storageService.fetchObject(constantsService.getSelectedSourcesTab());
//          if(!selected) {
//            location.path('sources/raw');
//            location.replace();
//          }else{
//            location.path('sources/'+selected);
//            location.replace();
//          }
//        }
      }
    };
  }]);
