'use strict';

var module = angular.module('ratesUiApp', ['ngResource',
  'ngSanitize', 'ui.bootstrap', 'toaster', 'ngRoute', 'ui.ace', 'ngProgressLite',
  'ngAnimate',
  'ui.select',
  'ui.bootstrap',
  'plunker',
  'app.controllers',
  'app.demoControllers',
  'app.main',
  'app.navigation',
  'app.localize',
  'app.activity',
  'app.smartui',
  'xtForm',
  'kendo.directives'
]).
  config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide',
    function ($routeProvider, $locationProvider, $httpProvider, $provide) {
      $httpProvider.defaults.cache = false;
      var defaultContentType = 'application/json;charset=UTF-8';
      $httpProvider.defaults.headers.common['Content-Type'] = defaultContentType;
      $httpProvider.defaults.headers.common['Content-Type'] = defaultContentType;
      $httpProvider.defaults.headers.post['Content-Type'] = defaultContentType;
      $httpProvider.defaults.headers.put['Content-Type'] = defaultContentType;
      $httpProvider.defaults.headers['delete'] = {};
      $httpProvider.defaults.headers['delete']['Content-Type'] = defaultContentType;
      function prepareRequestInterceptors() {
        $httpProvider.interceptors.push(['$q', '$rootScope', 'storageService', 'constantsService', 'notificationService',
            '$location', '$injector', '$timeout', '$window',
            function ($q, $rootScope, storageService, constantsService, notificationService, $location, $injector, $timeout, $window) {

              function handleLoggedOutCase() {
                var loginService = $injector.get('loginService');
                loginService.logout();
                delete $rootScope.loggedInUser;
                $rootScope.showView = false;
                $timeout(function () {
                  $window.location = '#/login'
                }, 1000);
              }

              $rootScope.$on('event:notLoggedIn', function () {
                handleLoggedOutCase();
                notificationService.sendError('Session expiry', 'Please log in');
              });

              $rootScope.$on('event:loggedOut', function () {
                handleLoggedOutCase();
              });

              return {
                request: function (config) {
                  if (!config.cache) {
                    // get stuff from storage
                    var auth = storageService.fetchObject(constantsService.getUserAuth());
                    if (!auth) {
                      return config || $q.when(config);
                    }
                    if (auth) {
                      config.headers['token'] = auth.token;
                    }
                  }
                  return config || $q.when(config);
                },
                requestError: function (rejection) {
                  return $q.reject(rejection);
                },
                response: function (response) {
                  return response || $q.when(response);
                },
                responseError: function (rejection) {
                  if (!rejection.config.cache) {
                    if (rejection.status === 401) {
                      if (rejection.config.url.indexOf('/rest/authenticator/authenticate') === -1) {
                        $rootScope.$broadcast('event:loggedOut', {});
                      }
                      return $q.reject(rejection);
                    }

                    if (rejection.status === 404) {
                      notificationService.sendError('Server Error', 'There has been an issue contacting server. Please try again later');
                    }

                    if (rejection.status === 500) {
                      notificationService.sendError('Server Error', 'The server has responded with an error for this request');
                    }
                  }

                  return $q.reject(rejection);
                }
              }
            }]
        )
        ;
      }

      prepareRequestInterceptors();

      $routeProvider
        .when('/', {
          redirectTo: '/runtime/dashboard'
        })
        .when('/setup/rates/definitions/schemaDefinitions/:schmaDefinitionId', {
          reloadOnSearch: true,
          templateUrl: '../views/setup/rates/definitions/editSchemaDefinitionDataDictionary.html'
        })
        .when('/setup/rates/definitions/schemaDefinitions/:schmaDefinitionId/preSourceFieldCleanser', {
          reloadOnSearch: true,
          templateUrl: '../views/setup/rates/definitions/editSchemaDefinitionPreSourceFieldCleanser.html'
        })
        .when('/setup/rates/definitions/schemaDefinitions/:schmaDefinitionId/postSourceProcessor', {
          reloadOnSearch: true,
          templateUrl: '../views/setup/rates/definitions/editSchemaDefinitionPostSourceProcessor.html'
        })
        .when('/setup/rates/definitions/schemaDefinitions/:schmaDefinitionId/rawFieldValidation', {
          reloadOnSearch: true,
          templateUrl: '../views/setup/rates/definitions/editSchemaDefinitionRawFieldValidation.html'
        })
        .when('/setup/rates/definitions/schemaDefinitions/:schmaDefinitionId/postAggregationFieldValidation', {
          reloadOnSearch: true,
          templateUrl: '../views/setup/rates/definitions/editSchemaDefinitionPostAggregationFieldValidation.html'
        })
        // This is the stuff for scriptables mapped to setup
        .when('/setup/rates/riskFactors/distributionProcService/edit', {
          reloadOnSearch: true,
          templateUrl: '../views/configuration/scriptable/scriptableHandler.html'
        })
        .when('/setup/rates/riskFactors/distributionFormatter/edit', {
          reloadOnSearch: true,
          templateUrl: '../views/configuration/scriptable/scriptableHandler.html'
        })
        .when('/setup/rates/linear/collections/edit', {
          reloadOnSearch: true,
          templateUrl: '../views/configuration/scriptable/scriptableHandler.html'
        })
        .when('/setup/rates/linear/distributionFormatter/edit', {
          reloadOnSearch: true,
          templateUrl: '../views/configuration/scriptable/scriptableHandler.html'
        })

        // Risk Factors Edit Collections
        .when('/setup/rates/riskFactors/collections/edit', {
          reloadOnSearch: true,
          templateUrl: '../views/setup/rates/riskFactors/editCollections.html'
        })


        // Handle the scriptables to have a friendly name
        .when('/setup/scriptable/scriptableHandler', {
          reloadOnSearch: true,
          templateUrl: '../views/configuration/scriptable/scriptableHandler.html'
        })


        // Handle the scriptables to have a friendly name, for dataSinks
        .when('/setup/dataSink/edit', {
          reloadOnSearch: true,
          templateUrl: '../views/configuration/scriptable/scriptableHandler.html'
        })


        .when('/setup/users/user/:userId', {
          reloadOnSearch: true,
          templateUrl: '../views/setup/users/editUser.html'
        })


        .when('/:page', { // we can enable ngAnimate and implement the fix here, but it's a bit laggy
          reloadOnSearch: true,
          templateUrl: function ($routeParams) {
            return 'views/' + $routeParams.page + '.html';
          }
        })
        .when('/:page/:child*', {
          reloadOnSearch: true,
          templateUrl: function ($routeParams) {
            return 'views/' + $routeParams.page + '/' + $routeParams.child + '.html';
          }
        })
        .otherwise({
          redirectTo: '/runtime/dashboard'
        });


//      // This line enables html5 url rewriting if available. The consequence
//      //  is that you won't have links with #/ at the beginning. Fancy thing.
//      //  Before we can use it we have to change all href and similar attributes
//      //  so they don't start with #/ anymore and make change in the .htaccess
//      //  file on the server so that it forwards all the requests to index.html
//      //$locationProvider.html5Mode(true).hashPrefix('!');
//
//      // This is a helper function for the next function
//      function getRedirectRoute(routesConfig, route, startingRoute) {
//        var redirectToRoute = routesConfig[route];
//        if (routesConfig[route] == '$root$') {
//          redirectToRoute = startingRoute + '/';
//        } else if (routesConfig[route].indexOf('/') != 0) {
//          redirectToRoute = startingRoute + '/' + routesConfig[route];
//        }
//        return redirectToRoute;
//      }
//
//      // This function automatically configures routes based on a config object.
//      function configureRoutes($routeProvider, routesConfig, startingRoute) {
//        for (var route in routesConfig) {
//          if (route == '$root$') {
//            $routeProvider.when(startingRoute + '/', {
//              templateUrl: routesConfig[route]
//            });
//          } else if (route == '$otherwise$') {
//            $routeProvider.otherwise({
//              redirectTo: getRedirectRoute(routesConfig, route, startingRoute)
//            });
//          } else if (route == '$defaultRoute$') {
//            $routeProvider.when(startingRoute, {
//              redirectTo: getRedirectRoute(routesConfig, route, startingRoute)
//            });
//          } else {
//            if (_.isObject(routesConfig[route])) {
//              configureRoutes($routeProvider, routesConfig[route], startingRoute + '/' + route);
//            } else {
//              $routeProvider.when(startingRoute + '/' + route, {
//                templateUrl: routesConfig[route]
//              });
//            }
//          }
//        }
//      }
//
//      // We could make a apiroRouteProvider from this function
//      configureRoutes($routeProvider, routesConfig, '');

      // enable nice tooltips
      $('.show-title').powerTip({
        placement: 'ne' // north-east tooltip position
      });
//      jQuery('.show-title').style_my_tooltips(
//        {
//          tip_follows_cursor: true,
//          tip_delay_time: 0,
//          tip_fade_speed: 300,
//          attribute: 'data-title'
//        }
//      );
      // with this, you can use $log('Message') same as $log.info('Message');
      $provide.decorator('$log', ['$delegate',
        function ($delegate) {
          // create a new function to be returned below as the $log service (instead of the $delegate)
          function logger() {
            // if $log fn is called directly, default to "info" message
            logger.info.apply(logger, arguments);
          }

          // add all the $log props into our new logger fn
          angular.extend(logger, $delegate);
          return logger;
        }]);
    }]);

module.config(['$httpProvider', function ($httpProvider) {
  var defaultContentType = 'application/json;charset=UTF-8';
  $httpProvider.defaults.cache = false;
  $httpProvider.defaults.headers.common['Content-Type'] = defaultContentType;
  $httpProvider.defaults.headers['post']['Content-Type'] = defaultContentType;
  $httpProvider.defaults.headers['put']['Content-Type'] = defaultContentType;
  $httpProvider.defaults.headers['delete'] = {};
  $httpProvider.defaults.headers['delete']['content-type'] = defaultContentType;
}]);

module.filter('propsFilter', function () {
  return function (items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function (item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

$.fn.reverse = [].reverse;

//module.animation('.reveal-animation', function() {
//  return {
//    leave: function(element, done) {
//      element.fadeOut(3000, done)
//      return function() {
//        element.stop();
//      }
//    }
//  }
//});

module.run(['$rootScope', 'settings', 'storageService', 'constantsService', function ($rootScope, settings, storageService, constantsService) {
  settings.currentLang = settings.languages[0]; // en
  storageService.remove(constantsService.getSchemaDefinition());
}]);

//// This is a constant routes configuration object. You can add a new route just by
////  adding a new entry in this object. There are some special values:
////   - $root$ means '/'
////   - $defaultRoute$ means redirect to a root
////   - $otherwise$ means $routeProvider.otherwise({ redirectTo: ... });
//module.constant('routesConfig', {
//  '$root$': 'views/login.html',
//  'dashboard': 'views/dashboard.html',
//   'runtime': {
//     'sources': {
//       '$defaultRoute$': 'redirector',
//       'redirector': 'views/sources/redirector.html',
//       'raw': 'views/sources/raw.html',
//       'aggregated': 'views/sources/aggregated.html',
//       'historical': 'views/sources/historical.html',
//       'crossRate': 'views/sources/crossRateHistorical.html',
//       'dropSource': 'views/sources/dropSource.html'
//     },
//     'audit': {
//       '$defaultRoute$': 'taskAudit',
//       'taskAudit': 'views/audit/taskAudit.html',
//       'entityAudit': 'views/audit/entityAudit.html',
//       'detailedAudit': 'views/audit/detailedAudit.html'
//     },
//     'approvals': {
//       '$defaultRoute$': 'pending',
//       'pending': 'views/approvals/pendingApprovals.html',
//       'rejected': 'views/approvals/rejectedApprovals.html',
//       'accepted': 'views/approvals/acceptedApprovals.html'
//     },
//     'rateCollection': {
//       '$defaultRoute$': 'main',
//       'main': 'views/sources/rateCollection.html'
//     },
//     'rateDistribution': {
//       '$defaultRoute$': 'main',
//       'main': 'views/sources/rateDistribution.html'
//     }
//   },
//  'configuration': {
//    '$defaultRoute$': 'rates/definitions/dimensions',
//    'rates': {
//      'raw': {
//        'preSourceCleanse': 'views/configuration/rates/raw/preSourceCleanse.html',
//        'rawValidation': 'views/configuration/rates/raw/rawValidation.html',
//        'postSourceProcess': 'views/configuration/rates/raw/postSourceProcess.html'
//      },
//      'aggregated': {
//        'fieldAggregationAlgorithm': 'views/configuration/rates/aggregated/fieldAggregationAlgorithm.html',
//        'postAggValidation': 'views/configuration/rates/aggregated/postAggValidation.html'
//      },
//      'crossrate': {
//        'distProcServiceImpl': 'views/configuration/rates/crossrate/distributionProcServiceImpl.html',
//        'collections': 'views/configuration/rates/crossrate/collections.html',
//        'distributionFormatter': 'views/configuration/rates/crossrate/distributionFormatter.html',
//        'distributions': 'views/configuration/rates/crossrate/distributions.html'
//      },
//      'linear': {
//        'collections': 'views/configuration/rates/linear/collections.html',
//        'distributions': 'views/configuration/rates/linear/distributions.html'
//      },
//      'definitions':{
//        'schemaDefinitions': 'views/configuration/rates/definitions/rateSchemaDefs.html',
//        'dimensions': 'views/configuration/rates/definitions/dimensions.html',
//        'attributes': 'views/configuration/rates/definitions/attributes.html',
//        'properties': 'views/configuration/rates/definitions/properties.html'
//      }
//    },
//    'services': {
//      'serviceImpls': 'views/configuration/services/serviceImpls.html',
//      'aggregationServiceImpl': 'views/configuration/services/aggregationServiceImpl.html',
//      'rawImportImpl': 'views/configuration/services/rawImportImpl.html',
//      'rateDefImportServiceImpl': 'views/configuration/services/rateDefImportServiceImpl.html',
//      'authenticationServiceImpl': 'views/configuration/services/authenticationServiceImpl.html',
//      'authorizationServiceImpl': 'views/configuration/services/authorizationServiceImpl.html',
//      'eventProcessorServiceImpl': 'views/configuration/services/eventProcessorServiceImpl.html',
//      'distributionProcessServiceImpl': 'views/configuration/services/distributionProcessServiceImpl.html',
//      'lifeCycleServiceImpl': 'views/configuration/services/lifeCycleServiceImpl.html',
//      'corpActionProcServiceImpl': 'views/configuration/services/corpActionProcServiceImpl.html'
//    },
//    'feeds': {
//      'dataFeeds': 'views/configuration/feeds/dataFeeds.html',
//      'rateDefImport': 'views/configuration/feeds/rateDefImport.html'
//    },
//    'system': {
//      'logs': 'views/configuration/system/logMessages.html',
//      'calendar': 'views/configuration/system/calendar.html',
//      'user': 'views/configuration/system/user.html',
//      'dataSink': 'views/configuration/system/dataSink.html'
//    },
//    'eventListener': 'views/configuration/eventListener.html',
//    'schemaDefs': 'views/configuration/schemaDefs.html',
//    'testViolationsAdmin': 'views/configuration/testViolationsAdmin.html',
//    'corporateActions': 'views/configuration/corporateActions.html',
//    'logs': 'views/configuration/logMessages.html',
//
//    'dataProvider': 'views/configuration/dataProvider.html'
//  },
//  '$otherwise$': '$root$'
//});