'use strict';

angular.module('ratesUiApp')
  .directive('combobox', [
    function () {
      return {
        restrict: 'A',
        replace: false,
//        scope: true,
        require: 'ngModel',
        compile: function compile() {
          return {
            pre: function preLink() {
            },
            post: function postLink(scope, element, attributes, ngModel) {
              var values;
              var chosen;
              var selectedOption;
              var alreadyInitialised = false;
              scope.$watch(attributes.source, function (val) {
                values = val;
                if (!alreadyInitialised) {
                  chosen = jQuery(element).chosen();

                  chosen.change(function (event, value) {
                    if (value && attributes.valueField) {
                      var position = value.selected;
                      var selectedObject = values[position];
                      var selectedId = selectedObject[attributes.valueField];
                      selectedObject = selectedObject[attributes.valueField];
//                      console.log(selectedObject);

                      ngModel.$setViewValue(selectedObject);
                      ngModel.$viewValue = selectedObject;
                      ngModel.$modelValue = selectedObject;
                      scope.$apply();
                    }
                  });
                  alreadyInitialised = true;
                }
                chosen.trigger('chosen:updated');
              });

              scope.$watch(attributes.ngModel, function (val) {
                if (val === selectedOption) {
                } else {
                  if (chosen) {
                    chosen.trigger('chosen:updated');
                  }
                }
              });
            }
          };
        }
      };
    }
  ]);