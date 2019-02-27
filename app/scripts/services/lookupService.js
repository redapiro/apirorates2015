'use strict';

angular.module('ratesUiApp').service('lookupService',
  ['$q', 'configService', '$http', function ($q, configService, $http) {

    var _searchSymbol = function (symbolPrefix, marketId, schemaId) {
      var deferred = $q.defer();
      var searchObj = {
        prefix: symbolPrefix,
        maxreturn: 15
      };

      if (!symbolPrefix || symbolPrefix.length === 0) {
        symbolPrefix = 'A';
      }

      var searchQuery = '?prefix=' + symbolPrefix + '&maxreturn=50';
      if (marketId) {
        searchQuery = searchQuery + '&marketId=' + marketId;
      }

      if (schemaId) {
        searchQuery = searchQuery + '&schemaId=' + schemaId;
      }

      $http.get(configService.getHostUrl() + '/config/rateDef/prefixsearch/' + searchQuery
        , {}, {
          headers: {'Accept': 'application/json'}
        }).success(function (response) {
          deferred.resolve(response);
        }).error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    };

    var _searchSymbolLabel = function (symbolPrefix, marketId, schemaId) {
      var deferred = $q.defer();
      var searchObj = {
        prefix: symbolPrefix,
        maxreturn: 15
      };

      if (!symbolPrefix || symbolPrefix.length === 0) {
        symbolPrefix = 'A';
      }

      var searchQuery = '?prefix=' + symbolPrefix + '&maxreturn=50';
      if (marketId) {
        searchQuery = searchQuery + '&marketId=' + marketId;
      }

      if (schemaId) {
        searchQuery = searchQuery + '&schemaId=' + schemaId;
      }

      $http.get(configService.getHostUrl() + '/config/rateDef/prefixsearchNamed/' + searchQuery
        , {}, {
          headers: {'Accept': 'application/json'}
        }).success(function (response) {
          deferred.resolve(response);
        }).error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    };


    var _getProviders = function (symbolPrefix) {
      var deferred = $q.defer();
      return $http.get(configService.getHostUrl() + '/lookup/dataProviders'
        , {}, {
          headers: {'Accept': 'application/json'}
        }).success(function (response) {
          deferred.resolve(response);
        }).error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    };

    var _searchMarkets = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/lookup/markets', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _searchInstrumentTypes = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/lookup/securities', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _searchCurrencies = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/lookup/currencies', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getSystemDate = function () {
      return $http.get(configService.getHostUrl() + '/rates/historical/systemdate/');
    };

    var _getScriptableLanguages = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/lookup/scriptableLanguages', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getFieldAggregationAlgs = function (dataType) {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/lookup/fieldAggregationAlgs?dataType=' + dataType, {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getDataTypes = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/lookup/dataTypes', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getEventTypes = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/lookup/eventTypes', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var _getCalendars = function () {
      var deferred = $q.defer();
      $http.get(configService.getHostUrl() + '/lookup/calendars', {}, {
        headers: {'Accept': 'application/json'}
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };


    return {
      searchSymbol: function (symbolPrefix, marketId, schemaId) {
        return _searchSymbol(symbolPrefix, marketId, schemaId);
      },
      searchSymbolLabel: function (symbolPrefix, marketId, schemaId) {
        return _searchSymbolLabel(symbolPrefix, marketId, schemaId);
      },
      searchMarkets: function () {
        return _searchMarkets();
      },
      searchInstrumentTypes: function () {
        return _searchInstrumentTypes();
      },
      searchCurrencies: function () {
        return _searchCurrencies();
      },
      getSystemDate: function (successCallback, failureCallback) {
        return _getSystemDate();
      },
      getScriptableLanguages: function () {
        return _getScriptableLanguages();
      },
      getProviders: function () {
        return _getProviders();
      },
      getEventTypes: function () {
        return _getEventTypes();
      },
      getFieldAggregationAlgs: function (dataType) {
        return _getFieldAggregationAlgs(dataType);
      },
      getDataTypes: function () {
        return _getDataTypes();
      },
      getCalendars: function () {
        return _getCalendars();
      }
    };
  }]);
