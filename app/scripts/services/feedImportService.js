'use strict';

angular.module('ratesUiApp').service('feedImportService',
  ['configService', '$http', 'storageService', 'notificationService', 'socketWatcherService',
    function (configService, $http, storageService, notificationService, socketWatcherService) {
      var _importFeed = function (feedId, payload, successCallback, failureCallback) {
        $http.post(configService.getHostUrl() + '/rates/raw/feed/import',
          {
            'feedId': feedId,
            'payload': payload
          },
          {
            headers: {
              'Accept': 'application/json'
            }
          }).success(function (response) {
            successCallback(response);
          });
      };

      var _importRateDef = function (feedId, payload, successCallback, failureCallback) {
        $http.post(configService.getHostUrl() + '/rates/raw/rateDef/import',
          {
            'importerId': feedId,
            'payload': payload
          },
          {
            headers: {
              'Accept': 'application/json'
            }
          }).success(function (response) {
            successCallback(response);
          });
      };

      var _importAll = function (successCallback, failureCallback) {
        $http.post(configService.getHostUrl() + '/rates/raw/feed/importAll',
          {},
          {
            headers: {
              'Accept': 'application/json'
            }
          }).success(function (response) {
            successCallback(response);
          });
      };

      var _findFeedInstances = function (successCallback, failureCallback) {
        $http.get(configService.getHostUrl() + '/rates/raw/feed/search', {}, {
          headers: {'Accept': 'application/json'}
        }).success(function (response) {
          successCallback(response);
        });
      };

      return {
        importFeed: function (feedId, payload, successCallback, failureCallback) {
          _importFeed(feedId, payload, successCallback, failureCallback);
        },
        importRateDef: function (feedId, payload, successCallback, failureCallback) {
          _importRateDef(feedId, payload, successCallback, failureCallback);
        },
        importAll: function (successCallback, failureCallback) {
          _importAll(successCallback, failureCallback);
        },
        findFeedInstances: function (successCallback, failureCallback) {
          _findFeedInstances(successCallback, failureCallback);
        }
      };
    }]).run(['socketWatcherService', 'notificationService', function (socketWatcherService, notificationService) {

//    socketWatcherService.registerForForFeedInstanceNotifier(function(data){
//      notificationService.sendInfo('Import completed', 'Feed with name "'+data.name+' was completed');
//    });
  }]);
