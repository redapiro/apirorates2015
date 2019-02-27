'use strict';

angular.module('ratesUiApp').service('assetClassService',
  ['configService', function (configService) {
    var assetClasses = ['FX', 'IR', 'EQ', 'BD'];

    return {
      findAssetClasses: function (successCallback, failureCallback) {
        return successCallback(assetClasses);
      }
    };
  }]);
