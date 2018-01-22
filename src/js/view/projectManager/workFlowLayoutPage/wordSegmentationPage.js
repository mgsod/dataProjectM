/**
 * Created by Administrator on 2017/4/28.
 * 分词页
 * 我的心已经在过五一了。此处留下一丝丝悬链。待下回分解
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'paramterUtil', 'router', 'workFlowUtil'],
    function (angular, $, ck, regexp, pagination, http, paramterUtil, router, workFlowUtil) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
            var HEADER = router.HEADER;
            var routerUrl = router.routerUrl;
            var mapJson = JSON.parse($('#mapJson').val());
            routerUrl[mapJson.obj.typeNo] = {url: mapJson.obj.url, method: 'get'};
            $scope.prePage = mapJson.pre;
            $scope.nextPage = mapJson.next;
            $scope.finishPage = mapJson.finish;
            $scope.isOpenWork = false;
            $scope.isCreate = mapJson.status;
            $scope.sortStatus = 'analysisObjectName';
            $scope.selectOrder = function (param) {
                $scope.sortStatus = param;
            };
            $scope.dataList = [];
            $scope.goPre = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请设置分词');
                    return
                }
                location.href = $scope.prePage
            };
            $scope.goNext = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请设置分词');
                    return
                }
                location.href = $scope.nextPage;
            };
            $scope.goIndex = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请设置分词');
                    return
                }
                location.href = $scope.finishPage;
            };
            var checkDataImportIsShow = function () {
                return work.isOk();
            };
            /**
             * 进入流程
             */
            var work = workFlowUtil.getWork(mapJson.obj.typeNo);
            /**
             * targetId  容器id
             * action 动作
             * mapJson 页面静态数据
             * callBack 为点击确定后触发的回调
             */
            work.init({
                targetId: '#workFlowPart',
                $scope: $scope,
                $http: $http,
                $compile: $compile,
                mapJson: mapJson,
                HEADER: HEADER,
                routerUrl: routerUrl,
                callback: function (data) {

                },
                cancelFn: function () {
                    $scope.isOpenWork = false;
                    $('#workFlowPart').html('');
                }
            });
        }
        ]);
        angular.bootstrap(document, ['myApp']);
    });