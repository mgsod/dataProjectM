/**
 * Created by Administrator on 2017/4/20.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'paramterUtil', 'router', 'comboSelect'],
    function (angular, $, ck, regexp, pagination, http, paramterUtil, router) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', function ($scope, $http) {
            var HEADER = router.HEADER;
            var routerUrl = router.routerUrl;
            $scope.wornNum = 0;//警告次数
            $scope.dataList = [
                 {
                 id: "1",
                 name: "汽车新闻",
                 describes: "关于汽车相关新闻",
                 startTime: "2017-1-1",
                 endTime: "2017-1-2",
                 manager: "张三",
                 customer: "东方传媒",
                 typeName: "周报",
                 type: "1",
                 statusName: "进行中",
                 status: "1"
                 },{
                    id: "2",
                    name: "汽车新闻",
                    describes: "关于汽车相关新闻",
                    startTime: "2017-1-1",
                    endTime: "2017-1-2",
                    manager: "张三",
                    customer: "东方传媒",
                    typeName: "周报",
                    type: "1",
                    statusName: "进行中",
                    status: "1"
                }
            ];//数据
            $scope.managerList = [
                 {id: '1', username: '张三'},
                 {id: '2', username: '李四'},
                 {id: '3', username: '王五'},
                 {id: '4', username: '朱2'}
            ];//manager数据
            $scope.customerList = [
                 {id: '1', name: '张三'},
                 {id: '2', name: '李四'},
                 {id: '3', name: '王五'},
                 {id: '4', name: '朱2'}
            ];//customer数据
            $scope.statusList = ["待配置", "配置中", "未启动", "运行中", "停止", "已完成", "", "", "", "出错"];
            $scope.searchParamter = {
                page: "1",
                size: "15",
                managerId: "",
                customerId: "",
                projectType:"page",
                type: "",
                status: "",
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
            $scope.chackStatus = function (param) {
                $scope.searchParamter.status = typeof param == 'undefined' ? "" : param;
                $scope.searchList('reset');
            };
            /**
             * 执行查询
             * @param param
             */
            $scope.searchList = function (param) {
                typeof param != 'undefined' ? pagination.goNextPage(param) : null;
                $scope.searchParamter.page = pagination.getPage();
                $scope.searchParamter.managerId = $('#projectManager').val();
                $scope.searchParamter.customerId = $('#customer').val();
                console.log($scope.searchParamter);
                getProjectList();
            };
            /**
             * 启动项目
             * @param id
             */
            $scope.startProject = function (id) {
                console.log(id);
                startProject(id);
            };
            /**
             * 停止项目
             * @param id
             */
            $scope.stopProject = function (id) {
                console.log(id);
                stopProject(id);
            };
            /**
             * 删除项目
             * @param id
             */
            $scope.deleteProject = function (id) {
                console.log(id);
                deleteProject(id);
            };
            /**
             * 查询pageList 数据
             */
            var getProjectList = function () {
                $http({
                    url: routerUrl.getProjectList.url,
                    method: routerUrl.getProjectList.method,
                    data: ck.param($scope.searchParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.dataList = data.data.projectList;
                        pagination.init(data.data.count, $scope.searchParamter.size);
                        $scope.totalPage = pagination.getTotalPage();
                    } else {
                        $scope.wornNum++;
                        $scope.wornNum < 5 ? getProjectList() : null;
                    }
                });
            };
            getProjectList();
            setInterval(function () {
                getProjectList()
            }, 30000);
            /**
             * 启动项目
             * @param id
             */
            var startProject = function (id) {
                $http({
                    url: routerUrl.startProject.url,
                    method: routerUrl.startProject.method,
                    data: ck.param({projectId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        alert("成功");
                        getProjectList();
                    } else {
                        alert(data.message)
                    }
                });
            };
            /**
             * 停止project
             * @param id
             */
            var stopProject = function (id) {
                $http({
                    url: routerUrl.stopProject.url,
                    method: routerUrl.stopProject.method,
                    data: ck.param({projectId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        alert("成功");
                        getProjectList();
                    } else {
                        alert(data.message)
                    }
                });
            };
            /**
             * 删除project
             * @param id
             */
            var deleteProject = function (id) {
                $http({
                    url: routerUrl.deleteProject.url,
                    method: routerUrl.deleteProject.method,
                    data: ck.param({projectId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        alert("成功");
                        getProjectList();
                    } else {
                        alert(data.message)
                    }
                });
            };
            /**
             * 获取paramter
             */
            var getParamter = function () {
                var util = paramterUtil.init($http);
                util.getParamter('managerList', function (data) {
                    $scope.managerList = data.data.list;
                    setTimeout(function () {
                        $('#projectManager').comboSelect();
                    }, 500);
                });
                util.getParamter('customerList', function (data) {
                    $scope.customerList = data.data.list;
                    setTimeout(function () {
                        $('#customer').comboSelect();
                    }, 500);
                });
            };
            getParamter();
           /* /!**
             * 控制altBox
             * @param e
             *!/
            window.showAlt = function (e) {
                var $myAlt = $('#myAlt');
                $myAlt.show();
                var offset = $(e).offset();
                var top = offset.top - $('.ck_topbar').height() + $(e).height();
                var left = offset.left - $('.ck_content').offset().left + $(e).width();
                if (offset.left > document.body.clientWidth / 2) {
                    left = offset.left - $('.ck_content').offset().left - $(e).width() / 2 - 150 / 4;
                }
                var message = $(e).attr('message');
                $myAlt.html(message);
                $myAlt.animate({left: left, top: top, opacity: 1}, 100)
            };
            /!**
             * 隐藏alt
             *!/
            window.hideAlt = function () {
                var $myAlt = $('#myAlt');
                $myAlt.animate({opacity: 0}, 50);
                $myAlt.hide();
            };*/
        }]);
        angular.bootstrap(document, ['myApp']);
    });