/**
 * Created by Administrator on 2017/8/18.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'http', 'paramterUtil', 'dHttpUtil'],
    function (angular, $, ck, regexp, http, paramterUtil, dHttpUtil) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', function ($scope, $http) {
            var dHttp = dHttpUtil.init($http);
            $scope.dataList = [{"id": 1, "url": "http://img.dookoo.net/123.jpg"}];
            var mapJson = JSON.parse($('#mapJson').val());
            $scope.searchParamter = {
                page: 1,
                size: 15
            };
            $scope.createParamter = {
                tepmId: "",
                projectId: mapJson.projectId,
                name: ""
            };
            $scope.createBoxIsShow = false;
            /*
             * 返回前一页
             * */
            $scope.goBack = function () {
                window.location.href = mapJson.url;
            };
            /*
             * 展示创建box
             * */
            $scope.showCreateBox = function (id) {
                $scope.createParamter.tepmId = id;
                $scope.createBoxIsShow = true;
            };
            /*
             * 执行创建
             * */
            $scope.doCreate = function () {
                _doCreate();
            };
            /*
             * 取消创建
             * */
            $scope.doCancel = function () {
                $scope.createBoxIsShow = false;
            };
            /**
             * 查询数据
             * @private
             */
            var _getData = function () {
                dHttp.dHttp({
                    action: "getVisTemplate",
                    data: $scope.searchParamter,
                    callback: function (data) {
                        if (data.code == 0) {
                            $scope.dataList = data.data;
                        } else {
                            $scope.wornNum++;
                            $scope.wornNum < 5 ? _getData() : alert(data.message);
                        }
                    }
                })
            };
            _getData();
            /*
             * 执行保存
             * */
            var _doCreate = function () {
                dHttp.dHttp({
                    action: "saveVis",
                    data: $scope.createParamter,
                    callback: function (data) {
                        if (data.code == 0) {
                            window.location.href = data.data.url;
                        }
                    }
                })
            };
        }]);
        angular.bootstrap(document, ['myApp']);
    });