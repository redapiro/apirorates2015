'use strict';

angular.module('ratesUiApp')
  .directive('notallow', function () {
    return {
      require: 'ngModel',
      link: function ($scope, $element, $attrs, modelCtrl) {
        var pattern = $attrs.notallow;
        var patternObj = new RegExp(pattern.substr(1, pattern.length - 2));
        modelCtrl.$parsers.push(function (inputValue) {
          // this next if is necessary for when using ng-required on your input.
          // In such cases, when a letter is typed first, this parser will be called
          // again, and the 2nd time, the value will be undefined
          if (inputValue == undefined) return ''
          var transformedInput = inputValue.replace(patternObj, '');
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    }

  });