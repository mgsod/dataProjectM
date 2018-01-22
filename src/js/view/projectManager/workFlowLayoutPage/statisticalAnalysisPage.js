/**
 * Created by Administrator on 2017/8/22.
 */
/**
 * Created by Administrator on 2017/6/29.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'router', 'workFlowUtil'],
    function (angular, $, ck, regexp, pagination, http, router, workFlowUtil) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
            var HEADER = router.HEADER;
            var routerUrl = router.routerUrl;




            $scope.isOpenWork = false;
            $scope.dataList = [
                {
                    "paramId": 123,
                    "name": "微博词频统计",
                    "dataType": "所有",
                    "dimension": "分词",
                    "condition": "data{2017}",
                    "jsonParam": {
                        "paramId": 123,
                        "name": "微博词频统计",
                        "dataType": [
                            {
                                "storageTypeTableId": "1",
                                "datasourceType": [1]
                            }
                        ],
                        "analysisHierarchy": "sentence",
                        "fieldAndFilter": [
                            {
                                "fieldCategory": "corpus",
                                "field": "url",
                                "fieldName": "主题域:出行",
                                "fieldType": "condition",
                                "conditionType": "classification",
                                "conditionExp": "be",
                                "conditionValue": "奥迪;宝马"
                            }
                        ],
                        "statisticsObject": [
                            {
                                "field": "url",
                                "type": "count"
                            }
                        ]
                    }
                }
            ];
            var mapJson = JSON.parse($('#mapJson').val());
            routerUrl[mapJson.obj.typeNo] = {url: mapJson.obj.url, method: 'get'};
            $scope.projectId = mapJson.projectId;
            $scope.typeNo = mapJson.obj.typeNo;
            $scope.prePage = mapJson.pre;
            $scope.nextPage = mapJson.next;
            $scope.finishPage = mapJson.finish;
            $scope.isCreate = mapJson.status;
            $scope.goPre = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请保存设置');
                    return
                }
                location.href = $scope.prePage
            };
            $scope.goNext = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请保存设置');
                    return
                }
                location.href = $scope.nextPage;
            };
            $scope.goIndex = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请保存设置');
                    return
                }
                location.href = $scope.finishPage;
            };
            $scope.doDelete = function (id) {
                doDeleteData(id)
            };
            var doDeleteData = function (id) {
                $http({
                    url: routerUrl.delStatisticsAnalysis.url,
                    method: routerUrl.delStatisticsAnalysis.method,
                    data: ck.param({projectId: mapJson.projectId, paramId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    alert(data.message || "删除成功");
                    searchList();
                });
            };
            var checkDataImportIsShow = function () {
                if ($scope.dataList.length == 0) {
                    return true
                }
                return $scope.isOpenWork;
            };
            /**
             * 查询列表
             */
            var searchList = function () {
                $http({
                    url: routerUrl.getStatisticsAnalysisList.url + "?" + ck.param({
                        projectId: mapJson.projectId,
                        typeNo: mapJson.obj.typeNo
                    }),
                    method: routerUrl.getStatisticsAnalysisList.method
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.dataList = data.data;
                    }
                });
            };
            searchList();
            /**
             *以下是流程控制相关的
             */
            $scope.settingData = function (action, item) {
                if ($scope.isOpenWork) {
                    return
                }
                $scope.isOpenWork = true;
                var work = workFlowUtil.getWork(mapJson.obj.typeNo);
                /**
                 * targetId  容器id
                 * mapJson 页面静态数据
                 * callBack 为点击确定后触发的回调
                 */
                work.init({
                    targetId: '#workFlowPart',
                    action: action,
                    data: item,
                    $scope: $scope,
                    $http: $http,
                    $compile: $compile,
                    mapJson: mapJson,
                    HEADER: HEADER,
                    routerUrl: routerUrl,
                    callback: function (data) {
                        if (data.code == 0) {
                            $('#workFlowPart').html('');
                            $scope.isOpenWork = false;
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
            };
        }]);
        angular.bootstrap(document, ['myApp']);
    });