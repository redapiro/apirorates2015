'use strict';

angular.module('ratesUiApp')
  .directive('rawValidationNavbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/rawValidationNavbar.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.location = $location.$$path;
      }
    };
  }]);
