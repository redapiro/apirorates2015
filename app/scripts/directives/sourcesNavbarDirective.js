'use strict';

angular.module('ratesUiApp')
  .directive('sourcesNavbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/sourcesNavbar.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.location = $location.$$path;
      }
    };
  }]);
