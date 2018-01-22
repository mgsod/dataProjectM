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
                    paramId: "1",
                    taskName: "汽车新闻_微博用户抓取",
                    datasourceName: "微博",
                    datasourceTypeName: "微博用户",
                    inputParams: "关键字：宝马….",
                    crawlFreq: "0 30 1/1 * ?",
                    statusName: "抓取中",
                    status: "1",
                    jsonParam: {
                        paramId: "1",
                        taskName: " 汽车新闻_微博用户抓取",
                        datasourceId: "1",
                        datasourceTypeId: "1",
                        inputParamArray: [
                            {
                                paramCnName: "关键词",
                                styleName: "input",
                                paramValue: "宝马"
                            }, {
                                paramCnName: "关键词",
                                styleName: "input-file",
                                paramValue: {input: "", file: ""}
                            }
                        ],
                        crawlFreqType: 1,
                        quartzTime: " 0 30 1/1 * ?"
                    }
                }, {
                    paramId: "2",
                    taskName: "汽车新闻_微博用户抓取",
                    datasourceName: "微博",
                    datasourceTypeName: "微博用户",
                    inputParams: "关键字：宝马….",
                    crawlFreq: "0 30 1/1 * ?",
                    statusName: "抓取中",
                    status: "0",
                    jsonParam: {
                        paramId: "1",
                        taskName: " 汽车新闻_微博用户抓取",
                        datasourceId: "1",
                        datasourceTypeId: "1",
                        inputParamArray: [
                            {
                                paramCnName: "关键词",
                                styleName: "input",
                                paramValue: "",
                                isRequired: "1",
                                prompt: "请输入关键字",
                                restrictions: "function(str){ console.log(str);if(str==''){return true;}}"
                            }, {
                                paramCnName: "关键词",
                                styleName: "input-file",
                                paramValue: {value: "", file: ""},
                                isRequired: "1",
                                prompt: "请输入关键字",
                                restrictions: "function(str){ console.log(str);if(str==''){return true;}}"
                            }, {
                                paramCnName: "checkbox",
                                styleName: "checkbox",
                                paramValue: true,
                                isRequired: "1",
                                prompt: "请输入关键字",
                                restrictions: ""
                            }, {
                                paramCnName: "时间",
                                styleName: "datetime",
                                paramValue: "2017/6/10",
                                isRequired: "1",
                                prompt: "请输入关键字",
                                restrictions: ""
                            }, {
                                paramCnName: "file",
                                styleName: "file",
                                paramValue: "fdsfasgdasg",
                                isRequired: "1",
                                prompt: "请输入关键字",
                                restrictions: ""
                            }
                        ],
                        crawlFreqType: "2",
                        quartzTime: "0 30 * * * *",
                        storageTypeTable: "weibo"
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
            $scope.doStartData = function (id) {
                doStartData(id)
            };
            $scope.doStopData = function (id) {
                doStopData(id)
            };
            var doDeleteData = function (id) {
                $http({
                    url: routerUrl.delCrawlObject.url,
                    method: routerUrl.delCrawlObject.method,
                    data: ck.param({projectId: mapJson.projectId, paramId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    alert(data.message || "删除成功");
                    searchList();
                });
            };
            var doStartData = function (id) {
                $http({
                    url: routerUrl.startCrawlObject.url,
                    method: routerUrl.startCrawlObject.method,
                    data: ck.param({projectId: mapJson.projectId, paramId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    alert(data.message || "启动成功");
                    searchList();
                });
            };
            var doStopData = function (id) {
                $http({
                    url: routerUrl.stopCrawlObject.url,
                    method: routerUrl.stopCrawlObject.method,
                    data: ck.param({projectId: mapJson.projectId, paramId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    alert(data.message || "停止成功");
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
                    url: routerUrl.getDataCrawlList.url,
                    method: routerUrl.getDataCrawlList.method,
                    data: ck.param({projectId: mapJson.projectId, typeNo: mapJson.obj.typeNo}),
                    headers: HEADER.formHeader
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
                console.log('1111',item)
                item.workFlowTemplateId = item.workFlowTemplateId+'';
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