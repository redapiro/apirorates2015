'use strict';

angular.module('ratesUiApp').directive('amcharts', function () {

  return {
    scope: {
      chart: '='
    },
    link: function ($scope, $elem, $attrs) {
      AmCharts.makeChart($elem.attr('id'), $scope.chart);
    }
  }

});