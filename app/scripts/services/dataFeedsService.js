'use strict';

angular.module('ratesUiApp').service('dataFeedsService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

//New
    var _findDefColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/feed/definition/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getDefById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/feed/definition/id/' + encodeURIComponent(id), {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _saveDataFeedDef = function (dataFeedDef) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/feed/definition/save', dataFeedDef, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _findInsColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/feed/instance/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getInsById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/feed/instance/id/' + encodeURIComponent(id), {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _saveDataFeedIns = function (dataFeedIns) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/feed/instance/save', dataFeedIns, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

//Old

    // list data feed definitions
    var _listFeedsDefinition = function (successCallback, failureCallback) {

      $http.get(configService.getHostUrl() + '/config/feed/definition/listAll', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _getFeedDef = function (id, successCallback, failureCallback) {
      $http.get(configService.getHostUrl() + '/config/feed/definition/id/' + id, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _saveFeedDef = function (feedDefRequest, successCallback, failureCallback) {

      $http.post(configService.getHostUrl() + '/config/feed/definition/save', feedDefRequest, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _deleteFeedDef = function (id, name, successCallback, failureCallback) {
      $http.delete(configService.getHostUrl() + '/config/feed/definition/delete/' + id + '/' + name, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    // list data feed instances
    var _listFeedsInstance = function (successCallback, failureCallback) {

      $http.get(configService.getHostUrl() + '/config/feed/instance/listAll', {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _getFeedInstances = function (rateSchemaDefId, successCallback, failureCallback) {

      $http.get(configService.getHostUrl() + '/config/feed/instance/rateSchemaDefId/' + rateSchemaDefId, {}, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    var _saveFeedInstances = function (feedInstanceRequest, successCallback, failureCallback) {

      $http.post(configService.getHostUrl() + '/config/feed/instance/save', feedInstanceRequest, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        successCallback(response);
      });
    };

    return {
      findDefColumns: function () {
        return _findDefColumns();
      },
      findInsColumns: function () {
        return _findInsColumns();
      },
      getDefById: function (id) {
        return _getDefById(id);
      },
      getInsById: function (id) {
        return _getInsById(id);
      },
      saveDataFeedDef: function (dataFeedDef) {
        return _saveDataFeedDef(dataFeedDef);
      },
      saveDataFeedIns: function (dataFeedIns) {
        return _saveDataFeedIns(dataFeedIns);
      },

      listFeedsDefinition: function (successCallback, failureCallback) {
        _listFeedsDefinition(successCallback, failureCallback);
      },
      getFeedDef: function (id, successCallback, failureCallback) {
        _getFeedDef(id, successCallback, failureCallback);
      },
      saveFeedDef: function (feedDefRequest, successCallback, failureCallback) {
        _saveFeedDef(feedDefRequest, successCallback, failureCallback);
      },
      deleteFeedDef: function (id, name, successCallback, failureCallback) {
        _deleteFeedDef(id, name, successCallback, failureCallback);
      },
      listFeedsInstance: function (successCallback, failureCallback) {
        _listFeedsInstance(successCallback, failureCallback);
      },
      getFeedInstances: function (rateSchemaDefId, successCallback, failureCallback) {
        _getFeedInstances(rateSchemaDefId, successCallback, failureCallback);
      },
      saveFeedInstances: function (feedInstanceRequest, successCallback, failureCallback) {
        _saveFeedInstances(feedInstanceRequest, successCallback, failureCallback);
      }
    };
  }]);
