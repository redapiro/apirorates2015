'use strict';

angular.module('ratesUiApp')
  .directive('capitalize', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        var capitalize = function (inputValue) {
          var capitalized;
          if (inputValue == null) {
            capitalized = inputValue;
          } else {
            capitalized = inputValue.toUpperCase();
          }
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        };
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]);  // capitalize initial value
      }
    };
  });