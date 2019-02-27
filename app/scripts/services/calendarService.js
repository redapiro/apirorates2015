'use strict';

angular.module('ratesUiApp').service('calendarService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/calendar/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (calendar) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/calendar/save', calendar, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/calendar/id/' + encodeURIComponent(id), {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return {
      findColumns: function () {
        return _findColumns();
      },
      save: function (calendar) {
        return _save(calendar);
      },
      getById: function (id) {
        return _getById(id);
      }

    };
  }]);
