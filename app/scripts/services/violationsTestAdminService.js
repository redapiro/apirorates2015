'use strict';

angular.module('ratesUiApp').service('violationsTestAdminService', ['configService', '$http', function (configService, $http) {

  var _listFeedFileNames = function (successCallback, failureCallback) {
    $http.get(configService.getHostUrl() + '/violationTestDataCreator/listAll', {}, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };

  var _reset = function (successCallback, failureCallback) {
    $http.get(configService.getHostUrl() + '/violationTestDataCreator/reset', {}, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };

  var _removeAll = function (successCallback, failureCallback) {
    $http.get(configService.getHostUrl() + '/violationTestDataCreator/removeAll', {}, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };

  var _getTable = function (feedfilenameRequest, successCallback, failureCallback) {
    $http.get(configService.getHostUrl() + '/violationTestDataCreator/get/' + feedfilenameRequest, {}, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };

  var _getColumnNames = function (successCallback, failureCallback) {
    $http.get(configService.getHostUrl() + '/violationTestDataCreator/columnNames', {}, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };

  var _save = function (feedfilenameRequest, violationsTableRequest, successCallback, failureCallback) {
    $http.post(configService.getHostUrl() + '/violationTestDataCreator/save/' + feedfilenameRequest, violationsTableRequest, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };

  var _getFeedRateCount = function (successCallback, failureCallback) {
    $http.get(configService.getHostUrl() + "/violationTestDataCreator/feedRateCount", {}, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };

  var _createNewAggregatedViolationUpdateHistorical = function (successCallback, failureCallback) {
    $http.get(configService.getHostUrl() + "/violationTestDataCreator/createNewAggregatedViolationUpdateHistorical", {}, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };

  var _clearAggregatedViolationUpdateHistorical = function (successCallback, failureCallback) {
    $http.get(configService.getHostUrl() + "/violationTestDataCreator/clearAggregatedViolationUpdateHistorical", {}, {
      headers: {'Accept': 'application/json'}
    }).success(function (response) {
      successCallback(response);
    });
  };


  return {
    listFeedFileNames: function (successCallback, failureCallback) {
      _listFeedFileNames(successCallback, failureCallback);
    },
    getTable: function (feedfilenameRequest, successCallback, failureCallback) {
      _getTable(feedfilenameRequest, successCallback, failureCallback);
    },
    save: function (feedfilenameRequest, violationsRequest, successCallback, failureCallback) {
      _save(feedfilenameRequest, violationsRequest, successCallback, failureCallback);
    },
    reset: function (successCallback, failureCallback) {
      _reset(successCallback, failureCallback);
    },
    removeAll: function (successCallback, failureCallback) {
      _removeAll(successCallback, failureCallback);
    },
    getFeedRateCount: function (successCallback, failureCallback) {
      _getFeedRateCount(successCallback, failureCallback);
    },
    getColumnNames: function (successCallback, failureCallback) {
      _getColumnNames(successCallback, failureCallback);
    },
    createNewAggregatedViolationUpdateHistorical: function (successCallback, failureCallback) {
      _createNewAggregatedViolationUpdateHistorical(successCallback, failureCallback);
    },
    clearAggregatedViolationUpdateHistorical: function (successCallback, failureCallback) {
      _clearAggregatedViolationUpdateHistorical(successCallback, failureCallback);
    }
  };

}]);
