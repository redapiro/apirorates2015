'use strict';

angular.module('ratesUiApp').directive('leftPanel', ['$location', 'constantsService', 'storageService',
  function ($location, constantsService, storageService) {
    return {
      templateUrl: 'views/includes/left-panel.html',
      restrict: 'EA',
      replace: true,
      link: function postLink(scope, element, attrs) {

      }
    };
  }]);
