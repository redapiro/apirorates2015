'use strict';

angular.module('ratesUiApp')
  .directive('dictionaryNavbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/dictionaryNavbar.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.location = $location.$$path;
      }
    };
  }]);
