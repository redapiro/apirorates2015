'use strict';

angular.module('ratesUiApp').service('configService', ['$location', '$window', function ($location, $window) {
  var scheme = window.location.protocol;
  var wsScheme = 'ws';
  var host = window.location.host;
  var port = window.location.port;
  var path = '/rest';
  var wsPort = 20100;

  if (host.indexOf(':') > 0) {
    host = host.substring(0, host.indexOf(':'));
  }

  // Checks for host
  if (host.indexOf('localhost') > -1 || host.indexOf('127.0.0.1') > -1) {
    port = 20100;
  } else {
    port = port;
    wsPort = port;
  }

  if (scheme.indexOf('https') > -1 || scheme.indexOf('HTTPS') > -1) {
    wsScheme = 'wss';
  }

  console.log('Using REST base: ' + scheme + '//' + host + ':' + port);
  console.log('Using WS: ' + wsScheme + '//' + host + ':' + wsPort);


  return {
    getResourceUrl: function () {
      return scheme + '//' + host + '\\:' + port + path;
    },
    getResourceHost: function () {
      return scheme + '//' + host + '\\:' + port;
    },
    getHostUrl: function () {
      return scheme + '//' + host + ':' + port + path;
    },
    getHost: function () {
      return scheme + '//' + host + ':' + port + path;
    },
    getServer: function () {
      return host;
    },
    getWsHost: function () {
      return wsScheme + '://' + host + ':' + wsPort;
    }
  };
}]);
