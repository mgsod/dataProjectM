##angular配合require 使用方法
    require(['angular', 'jquery', 'ck'], 
    function (angular, $, ck) {
        var app = angular.module('api', []);
        app.controller('controller', ['$scope', '$http', function ($scope, $http) {
        
         }]);
         angular.bootstrap(document, ['api']);
    });