'use strict';

angular.module('ratesUiApp').directive('rightClick', ['$parse',
  function ($parse) {
    return {
      restrict: 'A',
      scope: '@&',
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          post: function postLink(scope, iElement, iAttrs) {
            $(iElement).bind('contextmenu', function (event) {
              event.preventDefault();
              var fn = $parse(iAttrs['rightClick']);
              scope.$apply(fn);
            });

            $(document).click(function (event) {

            });
          }
        }
      }
    };
  }
]);