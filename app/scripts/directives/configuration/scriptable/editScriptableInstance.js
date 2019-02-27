'use strict';

/**
 * The 'instance' is inherited from the parent scope, and reflects the scriptable instance loaded
 */
angular.module('ratesUiApp')
  .directive('editScriptableInstance', ['$compile',
    function ($compile) {
      return {
        template: '',
        restrict: 'AE',
        replace: true,
        link: function postLink(scope, element, attrs) {
          if(scope[attrs.instanceFormName]) {
            var el = $compile('<div ' + scope[attrs.instanceFormName] + '=""></div>')( scope );
            element.parent().append( el );
          }
        }
      };
    }]);
