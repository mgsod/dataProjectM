/**
 * Created by intel on 2017/2/22.
 */
require(['angular','jquery', 'ck', 'regexp'], function (angular,$, ck, regexp) {
    var app = angular.module('myApp', []);
    app.controller('logincontroller', ['$scope', '$http', function ($scope, $http) {
        $scope.flagUsername = false;
        $scope.flagPassword = false;
        /**
         * 检查用户名
         */
        $scope.checkUserName = function () {
            $scope.flagUsername = regexp.checkStrMinMaxCaptital($scope.username, 3, 20, true,true);
            setMessage();
        };
        /**
         * 检查密码
         */
        $scope.checkPassword = function () {
            $scope.flagPassword = regexp.checkStrMinMaxCaptital($scope.password, 5, 30, false,false);
            setMessage();
        };
        /**
         * 执行登录操作
         * @returns {boolean}
         */
        $scope.doLogin = function () {
            var flag = setMessage(1);
            if (!flag) {
                return false
            }
            var data = {
                userName: $scope.username,
                passwd: $scope.password,
                remember: $scope.remember ? 1 : 0
            };
            $http({
                url: "/login.json",
                method: "post",
                data: ck.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if (data.code == 0) {
                    location.href = data.data.url;
                } else {
                    $scope.message = data.message;
                }
            });
        };
        /**
         * 设置message
         * @returns {boolean}
         */
        var setMessage = function (type) {
            if (type) {
                if($scope.username == ""|| typeof $scope.username == "undefined"){
                    $scope.message = '账号不能为空';
                    return false
                }else if($scope.password == "" || typeof $scope.password == "undefined"){
                    $scope.message = '密码不能为空';
                    return false
                }else{
                    $scope.message = '';
                }
            }
            if (!$scope.flagUsername) {
                if ($scope.username == "" || typeof $scope.username == "undefined") {
                    $scope.message = '';
                    return false
                } else {
                    $scope.message = '用户名只能小写英文';
                    return false
                }
            } else if (!$scope.flagPassword) {
                if ($scope.password == "" || typeof $scope.password == "undefined") {
                    $scope.message = '';
                    return false
                } else {
                    $scope.message = '密码只能是英文和数字';
                    return false
                }
            } else {
                $scope.message = '';
                return true
            }
        };
        /**
         * 监听回车键
         * @param event
         */
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) { // enter 键
                //要做的事情
                $scope.doLogin();
            }
        };
    }]);
    angular.bootstrap(document, ['myApp']);
});