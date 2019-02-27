'use strict';

angular.module('ratesUiApp')
  .directive('postAggValidationNavbar', ['$location', function ($location) {
    return {
      templateUrl: '/views/directives/postAggValidationNavbar.html',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.location = $location.$$path;
      }
    };
  }]);
