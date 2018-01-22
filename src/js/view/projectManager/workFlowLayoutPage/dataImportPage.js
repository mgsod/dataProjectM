/**
 * Created by Administrator on 2017/4/24.
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
            $scope.sortStatus = 'name';
            $scope.isOpenWork = false;
            $scope.selectOrder = function (param) {
                $scope.sortStatus = param;
            };
            $scope.dataList = [
                /* {
                 "paramId": "2",
                 "name": "不好",
                 "type": "微信",
                 "count": "1000",
                 "url": "",
                 "createTime": "dsaffasgds",
                 "origainField": "",
                 "dataSourceTypeRelation": "",
                 "isStart": "1"
                 }*/
            ];
            var mapJson = JSON.parse($('#mapJson').val());
            routerUrl[mapJson.obj.typeNo] = {url: mapJson.obj.url, method: 'get'};
            $scope.prePage = mapJson.pre;
            $scope.nextPage = mapJson.next;
            $scope.finishPage = mapJson.finish;
            $scope.isCreate = mapJson.status;
            $scope.goPre = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请先导入数据');
                    return
                }
                location.href = $scope.prePage
            };
            $scope.goNext = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请先导入数据');
                    return
                }
                location.href = $scope.nextPage;
            };
            $scope.goIndex = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请先导入数据');
                    return
                }
                location.href = $scope.finishPage;
            };
            $scope.doDelete = function (id) {
                doDeleteData(id)
            };
            var doDeleteData = function (id) {
                $http({
                    url: routerUrl.doDeleteData.url,
                    method: routerUrl.doDeleteData.method,
                    data: ck.param({paramId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    alert(data.message || "删除成功");
                    searchList();
                });
            };
            var checkDataImportIsShow = function () {
                if ($scope.dataList.length < 1) {
                    return true
                } else if ($scope.isOpenWork) {
                    return true
                } else {
                    return false;
                }
            };
            /**
             * 查询列表
             */
            var searchList = function () {
                $http({
                    url: routerUrl.dataImportList.url,
                    method: routerUrl.dataImportList.method,
                    data: ck.param({projectId: mapJson.projectId, typeNo: mapJson.obj.typeNo}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.dataList = data.data.importDataDetailList;
                        setTimeout(function () {
                            ck.progress.init()
                        }, 500);
                    }
                });
            };
            searchList();
            /**
             *以下是流程控制相关的
             */
            $scope.settingData = function () {
                $scope.isOpenWork = true;
                var work = workFlowUtil.getWork(mapJson.obj.typeNo);
                /**
                 * targetId  容器id
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
                        if (data.code == 0) {
                            $scope.isOpenWork = false;
                            $('#workFlowPart').html('');
                            searchList();
                        } else {
                            alert(data.message);
                        }
                    },
                    cancelFn: function () {
                        $scope.isOpenWork = false;
                        $('#workFlowPart').html('');
                    }
                });
            }
        }]);
        angular.bootstrap(document, ['myApp']);
    });