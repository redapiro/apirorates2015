'use strict';

angular.module('ratesUiApp').service('storageService', [function () {
    var persistentStore = null;
    if (window.localStorage !== undefined) {
      persistentStore = window.localStorage;
    } else {
      throw ('session Storage not supported');
    }

    return {
      saveObject: function (label, value) {
        persistentStore.setItem(label, JSON.stringify(value));
      },
      saveValue: function (label, value) {
        persistentStore.setItem(label, value);
      },
      fetchObject: function (label) {
        var value = persistentStore[label];
        if (value === undefined || value.length === 0 || value === 'undefined') {
          return null;
        }
        return JSON.parse(value);
      },
      fetchValue: function (label) {
        var value = persistentStore[label];
        if (value === undefined) {
          return null;
        }
        return value;
      },
      remove: function (label) {
        persistentStore.removeItem(label);
      },
      clearAll: function () {
        persistentStore.clear();
      }
    };
  }]
);
