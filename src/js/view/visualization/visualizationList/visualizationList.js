/**
 * Created by Administrator on 2017/8/18.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'paramterUtil', 'dHttpUtil'],
    function (angular, $, ck, regexp, pagination, http, paramterUtil, dHttpUtil) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', function ($scope, $http) {
            var dHttp = dHttpUtil.init($http);
            $scope.isShowImg = false;
            $scope.dataList = [
                {
                    "id": 1,
                    "name": "汽车报告1",
                    "lastmodifyTime": "2017-8-14 13:15:00",
                    "image": "http://image.dookoo.net/12323.jpg"
                }
            ];
            var mapJson = JSON.parse($('#mapJson').val());
            $scope.projectId = mapJson.projectId;
            $scope.totalPage = 2;
            $scope.searchParamter = {
                projectId: mapJson.projectId,
                page: 1,
                size: 15,
                sortStatus: "name desc"
            };
            $scope.showImg = function (image) {
                $scope.showImgSrc = image;
                $scope.isShowImg = true;
            };
            $scope.cancelShowImg = function () {
                $scope.isShowImg = false;
            };
            $scope.deleteItem = function (id) {
                _deleteItem(id);
            };
            /**
             * 查询触发
             * @param param
             */
            $scope.searchList = function (param) {
                typeof param != 'undefined' ? pagination.goNextPage(param) : null;
                $scope.searchParamter.page = pagination.getPage();
                _getData();
            };
            /**
             * 查询数据
             * @private
             */
            var _getData = function () {
                dHttp.dHttp({
                    action: "getVisList",
                    data: $scope.searchParamter,
                    callback: function (data) {
                        if (data.code == 0) {
                            $scope.dataList = data.data;
                            pagination.init(data.data.count, $scope.searchParamter.size);
                            $scope.totalPage = pagination.getTotalPage();
                        } else {
                            $scope.wornNum++;
                            $scope.wornNum < 5 ? _getData() : alert(data.message);
                        }
                    }
                })
            };
            _getData();
            var _deleteItem = function (id) {
                dHttp.dHttp({
                    action: "deleteVisualization",
                    data: {id: id},
                    callback: function (data) {
                        if (data.code != 0) {
                            alert(data.message);
                        } else {
                            _getData();
                        }
                    }
                })
            }
        }]);
        angular.bootstrap(document, ['myApp']);
    });