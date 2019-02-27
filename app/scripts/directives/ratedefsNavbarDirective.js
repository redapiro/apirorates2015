'use strict';

angular.module('ratesUiApp')
  .directive('rateDefsNavbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/rateDefsNavbar.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.location = $location.$$path;
      }
    };
  }]);
