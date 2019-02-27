'use strict';

angular.module('ratesUiApp')
  .directive('feedsNavbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/feedsNavbar.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.location = $location.$$path;
      }
    };
  }]);
