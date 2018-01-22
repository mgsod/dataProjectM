/**
 * Created by Administrator on 2017/4/27.
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
            $scope.themeList = [];
            $scope.nextPage = mapJson.next;
            $scope.finishPage = mapJson.finish;
            $scope.isCreate = mapJson.status;
            $scope.sortStatus = 'resultName';
            $scope.isOpenWork = false;
            $scope.selectOrder = function (param) {
                $scope.sortStatus = param;
            };
            $scope.dataList = [
           /*     {
                    "paramId": 1,
                    "resultName": "1111",
                    "hotspotsLevel": 1,
                    "scoringWay": 1,
                    resultsStrategyType: 1,
                    "scoringWayName": "标准",
                    "startFreqType": 2,//（1为不循环，2为每日，3为每周，4为每月）,
                    "startFreqTypeName": "不循环",
                    "definitionName": "防守打法是否",
                    "handleHour": 24,
                    "startFreqValue": "1",
                    subjectAresList: [{aresId: "12", subjectIds: "54,53"}],
                    "relationship": 1
                }*/
            ];
            $scope.goPre = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请设置话题分析');
                    return
                }
                location.href = $scope.prePage
            };
            $scope.goNext = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请设置话题分析');
                    return
                }
                location.href = $scope.nextPage;
            };
            $scope.goIndex = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请设置话题分析');
                    return
                }
                location.href = $scope.finishPage;
            };
            var checkDataImportIsShow = function () {
                if($scope.dataList.length==0){
                    return true
                }
                return $scope.isOpenWork
            };
            $scope.doDeleteItem = function (id) {
                deleteObj(id);
            };
            var deleteObj = function (id) {
                $http({
                    url: routerUrl.deleteTopicAnalysisDefinition.url,
                    method: routerUrl.deleteTopicAnalysisDefinition.method,
                    data: ck.param({paramId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    alert(data.message || "删除成功");
                    searchList()
                })
            };
            /**
             * 查询
             */
            var searchList = function () {
                $http({
                    url: routerUrl.topicAnalysisDefinitionList.url + "?projectId=" + mapJson.projectId + "&typeNo=" + mapJson.obj.typeNo,
                    method: routerUrl.topicAnalysisDefinitionList.method,
                    //      data: ck.param({projectId: mapJson.projectId, typeNo: mapJson.obj.typeNo}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.dataList = data.data;
                    }
                });
            };
            searchList();
            var getThemeList = function () {
                $http({
                    url: routerUrl.getSubjectAresList.url + "?projectId=" + mapJson.projectId + "&typeNo=" + mapJson.obj.typeNo,
                    method: routerUrl.getSubjectAresList.method,
                    headers: HEADER.formHeader
                }).success(function (data) {
                    $scope.themeList = data.data;
                });
            };
            getThemeList();
            /**
             * 进入流程
             */
            $scope.settingData = function (action, item) {
                if ($scope.isOpenWork) {
                    return
                }
                $scope.isOpenWork = true;
                for (var o in item) {
                    item[o] = typeof item[o] != 'number' ? item[o] : item[o] + ''
                }
                var work = workFlowUtil.getWork(mapJson.obj.typeNo);
                /**
                 * targetId  容器id
                 * action 动作
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
                        }else {
                            alert(data.message);
                        }
                    },
                    cancelFn:function(){
                        $scope.isOpenWork = false;
                        $('#workFlowPart').html('');
                    }
                });
            }
        }
        ])
        ;
        angular.bootstrap(document, ['myApp']);
    });