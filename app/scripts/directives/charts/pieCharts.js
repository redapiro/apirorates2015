'use strict';

angular.module('ratesUiApp').directive('pieChart', [function () {
  return {
    restrict: 'A',
    scope: {
      data: '=data'
    },
    compile: function compile() {
      return {
        pre: function preLink(scope) {

        },
        post: function postLink(scope, iElement) {
          if (jQuery(iElement).length) {

            var data_pie = [
              {label: "Series1", data: 10},
              {label: "Series2", data: 90}
            ];

            var plot = jQuery.plot($(iElement), data_pie, {
              series: {
                pie: {
                  show: true,
                  innerRadius: 0.6,
                  radius: 1,
                  label: {
                    show: false,
                    radius: 2 / 3,
                    formatter: function (label, series) {
                      return '<div style="font-size:11px;text-align:center;padding:4px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
                    },
                    threshold: 0.1
                  }
                }
              },
              legend: {
                show: false,
                noColumns: 1, // number of colums in legend table
                labelFormatter: null, // fn: string -> string
                labelBoxBorderColor: "#000", // border color for the little label boxes
                container: null, // container (as jQuery object) to put legend in, null means default on top of graph
                position: "ne", // position of default legend container within plot
                margin: [5, 10], // distance from grid edge to default legend container within plot
                backgroundColor: "#efefef", // null means auto-detect
                backgroundOpacity: 1 // set to 0 to avoid background
              },
              grid: {
                hoverable: true,
                clickable: true
              }
            });

          }

        }
      };
    }
  };
}
]);