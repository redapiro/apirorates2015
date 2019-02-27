'use strict';

angular.module('ratesUiApp')
  .directive('auditNavbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/auditNavbar.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.location = $location.$$path;
      }
    };
  }]);
