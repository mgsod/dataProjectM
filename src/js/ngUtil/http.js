/**
 * Created by Administrator on 2017/3/27.
 */
define('http', ["httpException"], function (exception) {
    var createHttpFactory = function (app) {
        app.factory("httpInterceptor", ["$q", "$rootScope", function ($q, $rootScope) {
            return {
                request: function (config) {
// do something on request success
                    return config || $q.when(config);
                },
                requestError: function (rejection) {
                    // do something on request error
                    return $q.reject(rejection)
                },
                response: function (response) {
// do something on response success
                    return response || $q.when(response);
                },
                responseError: function (rejection) {
// do something on response error
                    exception.normalException(rejection);
                    return $q.reject(rejection);
                }
            };
        }]);
        app.config(["$httpProvider", function ($httpProvider) {
            $httpProvider.interceptors.push("httpInterceptor");
        }]);
    };
    return createHttpFactory;
});