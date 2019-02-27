'use strict';

angular.module('ratesUiApp').service('socketWatcherService',
  ['configService', '$rootScope', function (configService, $rootScope) {
    var callbacks = [];
    var _connection;
    var _initial = true;

    var _addCallbackToRegister = function (id, callback) {
      var matched = false;
      if (id) {
        for (var i = 0; i < callbacks.length; i++) {
          if (callbacks[i].id === id) {
            matched = true;
            callbacks[i].id = id;
            callbacks[i] = callback;
          }
        }
        if (!matched) {
          callback.id = id;
          callbacks.push(callback);
        }
      }
    };

    var _removeRegisteredCallback = function(id){
      for (var i = 0; i < callbacks.length; i++) {
        if (callbacks[i].id === id) {
          callbacks[i].id = id;
          callbacks.splice(i,1);
        }
      }

    };

    var _registerIdsToTrack = function (ids) {
      if (_connection) {
        var obj = {
          messageType: 'setEntityFilter',
          idList: ids
        };
        _connection.send(JSON.stringify(obj));
      }
    };

    var _initialiseSocket = function () {
      function performConnect() {
        _connection = new WebSocket(configService.getWsHost() + '/services/websocksvc');
        _connection.binaryType = "arraybuffer";

        _connection.onopen = function () {
          $rootScope.errorContactingServer = false;
          console.log('Entity Tracker websocket opened');
        };

        _connection.onclose = function () {
          $rootScope.errorContactingServer = true;
          console.error('Entity Tracker websocket closed - reconnecting');
          setTimeout(function () {
            performConnect();
          }, 5000);
        };

        _connection.onerror = function (error) {
          $rootScope.errorContactingServer = true;
        };

        var receivedObject;
        _connection.onmessage = function (e) {
          if (callbacks.length > 0) {
            receivedObject = JSON.parse(e.data);
            for (var i = 0; i < callbacks.length; i++) {
              // Only execute callback if the message type matches
              if (callbacks[i].messageType === receivedObject.messageType) {

                callbacks[i].doCallback(receivedObject);
              }
            }
          }
        };
   }

      if (_initial) {
        performConnect();
        _initial = false;
      }
    };

    return {
      init: function () {
        _initialiseSocket();
      },
      registerCallback: function (id, callback) {
        _addCallbackToRegister(id, callback);
      },
      removeRegisteredCallback: function(id){
        _removeRegisteredCallback(id);
      },
      registerIdsToTrack: function (id, idsToTrack, callback) {
        callback.id = id;
        callback.messageType = 'entityChange';
        _registerIdsToTrack(idsToTrack, callback);
        _addCallbackToRegister(id, callback);
      }
    };
  }]).run(['socketWatcherService', function (socketWatcherService) {
    socketWatcherService.init();
  }]);
