'use strict';

angular.module('ratesUiApp').service('taskTypeService',
  ['configService', '$http', '$q', function (configService, $http, $q) {

    var _findColumns = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/taskType/columns', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _save = function (taskType) {
      var deferred = $q.defer();
      $http.post(configService.getHostUrl() + '/config/taskType/save', taskType, {
        headers: {'Content-Type': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    /*
     var _getReferences = function(){
     var deferred = $q.defer();
     $http.get(configService.getHostUrl()+'/config/taskType/references', {}, {
     headers: { 'Content-Type': 'application/json'}
     }).success(function(response) {
     deferred.resolve(response);
     }).error(function(error) {
     deferred.reject(error);
     });
     return deferred.promise;
     };*/


    var _getById = function (id) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/config/taskType/id/' + encodeURIComponent(id), {}, {
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
      save: function (taskType) {
        return _save(taskType);
      },
      /*
       getReferences: function(){
       return _getReferences();
       },*/

      getById: function (id) {
        return _getById(id);
      }

    };
  }]);
