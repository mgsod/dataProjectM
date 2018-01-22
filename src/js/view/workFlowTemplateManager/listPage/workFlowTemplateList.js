/**
 * Created by Administrator on 2017/4/20.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'paramterUtil', 'router', 'dHttpUtil'],
    function (angular, $, ck, regexp, pagination, http, paramterUtil, router,dHttp) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', function ($scope, $http) {
            var HEADER = router.HEADER;

            console.log(dHttp)
            dHttp.init($http)

            var routerUrl = router.routerUrl;
            $scope.wornNum = 0;//警告次数
            $scope.dataList = [
                {
                    "id": 1,
                    "name": "test",
                    "status": 0,
                    "statusName": "失效",
                    "process": null,
                    "flowType": "crawl",
                    "createTime": 1505466328000,
                    "lastmodifyTime": 1505466331000
                },{
                    "id": 2,
                    "name": "test1",
                    "status": 1,
                    "statusName": "有效",
                    "process": null,
                    "flowType": "crawl",
                    "createTime": 1505466328000,
                    "lastmodifyTime": 1505466331000
                }
            ];
            $scope.searchParamter = {
                page: "1",
                size: "15",
                name:"",
                sortStatus: localStorage.getItem("order")
            };//查询paramter
            $scope.totalPage = "2";//总页数
            /**
             * 选择排序
             * @param param
             */
            $scope.selectOrder = function (param) {
                localStorage.setItem("order", param);
                $scope.searchParamter.sortStatus = param;
                $scope.searchList('reset');
            };
            /**
             * 改变status
             * @param param
             */
            $scope.chackName = function () {
                $scope.searchParamter.name = $scope.nameValue;
                $scope.searchList('reset');
            };
            /**
             * 执行查询
             * @param param
             */
            $scope.searchList = function (param) {
                typeof param != 'undefined' ? pagination.goNextPage(param) : null;
                $scope.searchParamter.page = pagination.getPage();
                console.log($scope.searchParamter);
                getWorkFlowTemplateList();
            };
            /**
             * 启用流程抓取
             * @param id
             */
            $scope.enableWorkFlowTemplate = function (id) {
                console.log(id);
                enableWorkFlowTemplate(id);
            };
            /**
             * 停用流程抓取
             * @param id
             */
            $scope.disabledWorkFlowTemplate = function (id) {
                console.log(id);
                disabledWorkFlowTemplate(id);
            };
            /**
             * 删除流程抓取
             * @param id
             */
            $scope.delWorkFlowTemplate = function (id) {
                console.log(id);
                delWorkFlowTemplate(id);
            };
            /**
             * 查询pageList 数据
             */
            var getWorkFlowTemplateList = function () {
                dHttp.dHttp({
                    action: 'getWorkFlowTemplateList',
                    method: routerUrl.getWorkFlowTemplateList.method,
                    data: $scope.searchParamter,
                    callback: function (data) {
                        if (data.code == 0) {
                            $scope.dataList = data.data.workFlowTemplateList;
                            pagination.init(data.data.count, $scope.searchParamter.size);
                            $scope.totalPage = pagination.getTotalPage();
                        } else {
                            $scope.wornNum++;
                            $scope.wornNum < 5 ? getWorkFlowTemplateList() : null;
                        }
                    }
                })
            };
            getWorkFlowTemplateList();
            setInterval(function () {
                getWorkFlowTemplateList()
            }, 30000);

            /**
             * 启用流程抓取
             * @param id
             */
            var enableWorkFlowTemplate = function (id) {
                $http({
                    url: routerUrl.enableWorkFlowTemplate.url,
                    method: routerUrl.enableWorkFlowTemplate.method,
                    data: ck.param({workFlowTemplateId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        alert("成功");
                        getWorkFlowTemplateList();
                    } else {
                        alert(data.message)
                    }
                });
            };
            /**
             * 停用流程抓取
             * @param id
             */
            var disabledWorkFlowTemplate = function (id) {
                $http({
                    url: routerUrl.disabledWorkFlowTemplate.url,
                    method: routerUrl.disabledWorkFlowTemplate.method,
                    data: ck.param({workFlowTemplateId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        alert("成功");
                        getWorkFlowTemplateList();
                    } else {
                        alert(data.message)
                    }
                });
            };
            /**
             * 删除流程抓取
             * @param id
             */
            var delWorkFlowTemplate = function (id) {
                $http({
                    url: routerUrl.delWorkFlowTemplate.url,
                    method: routerUrl.delWorkFlowTemplate.method,
                    data: ck.param({workFlowTemplateId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        alert("成功");
                        getWorkFlowTemplateList();
                    } else {
                        alert(data.message)
                    }
                });
            };

        }]);
        angular.bootstrap(document, ['myApp']);
    });