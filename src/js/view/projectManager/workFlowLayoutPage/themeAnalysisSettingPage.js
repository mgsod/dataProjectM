/**
 * Created by Administrator on 2017/4/27.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'paramterUtil', 'router', 'workFlowUtil','zTree'],
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
            $scope.isCreate = mapJson.status;
            $scope.sortStatus = 'subjectAresName';
            $scope.isOpenWork = false;
            $scope.selectOrder = function (param) {
                $scope.sortStatus = param;
            };
            $scope.dataList = [
              /*  {
                    "paramId": "1",
                    "subjectAresId": "1",
                    "subjectAresName": "123",
                    "subjectIds": "1",
                    "subjectNames": "123",
                    "resultsStrategyType": 0,
                    "resultsStrategyTypeName": "精英团"
                }, {
                    "paramId": "2",
                    "subjectAresId": "1",
                    "subjectAresName": "fdfsfa",
                    "subjectIds": "1",
                    "subjectNames": "fsdafas",
                    "resultsStrategyType": 0,
                    "resultsStrategyTypeName": "精英团"
                }, {
                    "paramId": "3",
                    "subjectAresId": "1",
                    "subjectAresName": "21423",
                    "subjectIds": "1",
                    "subjectNames": "fadsf",
                    "resultsStrategyType": 0,
                    "resultsStrategyTypeName": "精英团"
                }*/
            ];
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
            var checkDataImportIsShow = function () {
                if($scope.dataList.length==0){
                    return true
                }
                return $scope.isOpenWork
            };
            $scope.doDelete = function (id) {
                deleteThemeObj(id);
            };
            var deleteThemeObj = function (id) {
                $http({
                    url: routerUrl.deleteThemeAnalysisSetting.url,
                    method: routerUrl.deleteThemeAnalysisSetting.method,
                    data: ck.param({paramId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    alert(data.message || "删除成功");
                    searchList()
                })
            };
            var searchList = function () {
                $http({
                    url: routerUrl.themeAnalysisSettingList.url + "?projectId=" + mapJson.projectId + "&typeNo=" + mapJson.obj.typeNo,
                    method: routerUrl.themeAnalysisSettingList.method,
                    //  data: ck.param({projectId: mapJson.projectId, typeNo: mapJson.obj.typeNo}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.dataList = data.data;
                    }
                });
            };
            searchList();
            /**
             * 进入流程
             */
            $scope.settingData = function (action, item) {
                if ($scope.isOpenWork) {
                    return
                }
                $scope.isOpenWork = true;
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
                        } else {
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