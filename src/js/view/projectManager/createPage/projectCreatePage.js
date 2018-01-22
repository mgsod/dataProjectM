/**
 * Created by Administrator on 2017/4/21.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'paramterUtil', 'router', 'comboSelect', 'foundation-datepicker'],
    function (angular, $, ck, regexp, pagination, http, paramterUtil, router) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', function ($scope, $http) {
            var HEADER = router.HEADER;
            var routerUrl = router.routerUrl;
            var mapJson = JSON.parse($('#mapJson').val());
            $scope.pageTitle = mapJson.status == 1 ? "编辑项目" : "新建项目";
            $scope.isCreate = mapJson.status;
            $scope.managerList = [/*
             {id: '1', username: '张三'},
             {id: '2', username: '李四'},
             {id: '3', username: '王五'},
             {id: '4', username: '朱2'}
             */];//manager数据
            $scope.customerList = [/*
             {id: '1', name: '张三'},
             {id: '2', name: '李四'},
             {id: '3', name: '王五'},
             {id: '4', name: '朱2'}
             */];//customer数据
            $scope.createParamter = {
                projectName: "",
                projectDescribe: "",
                typeId: "1",
                managerId: "",
                customerId: "",
                startTime: "",
                endTime: "",
                typeNos: ""
            };
            $scope.projectNameMessage = "";
            $scope.projectTypeMessage = "";
            $scope.projectManagerMessage = "";
            $scope.customerMessage = "";
            $scope.timeMessage = "";
            $scope.doSave = true;


            /*2017/12/11 维护 创建项目后返回到创建页面. 工作流不可以重新选择  */
            //获取地址栏参数
            function getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
            $scope.isCreate  = getQueryString('projectId') ? true : false;

            /**
             * 执行保存
             */
            $scope.saveData = function () {
                var flag = checkParamter();
                $scope.createParamter.from = mapJson.status;
                //判断是否有projectId
                if ($scope.isCreate == 1) {
                    $scope.createParamter.projectId = mapJson.projectId;
                }
                if ($scope.doSave && flag) {
                    $scope.doSave = false;
                    saveData();
                }
            };
            /**
             * 保存数据
             */
            var saveData = function () {
                $http({
                    url: routerUrl.createOrSaveProject.url,
                    method: routerUrl.createOrSaveProject.method,
                    headers: HEADER.formHeader,
                    data: ck.param($scope.createParamter)
                }).success(function (data) {
                    $scope.doSave = true;
                    if (data.code == 0) {
                        location.href = data.data.url;
                    } else {
                        alert(data.message);
                    }
                });
            };
            /**
             * 检查paramter
             * @returns {boolean}
             */
            var checkParamter = function () {
                var f1 = false;
                console.log($scope.createParamter)
                $scope.projectNameMessage = "";
                $scope.projectTypeMessage = "";
                $scope.projectManagerMessage = "";
                $scope.customerMessage = "";
                $scope.timeMessage = "";
                $scope.typeNosMessage = "";
                if ($scope.createParamter.projectName == "") {
                    $scope.projectNameMessage = "必须填项目名";
                    f1 = true;
                } else {
                    f1 = regexp.checkStr($scope.createParamter.projectName);
                    if (f1) {
                        $scope.projectNameMessage = "项目名不合法";
                    }
                }
                $scope.createParamter.endTime = $('#endTime').val();
                $scope.createParamter.startTime = $('#startTime').val();
                if ($scope.createParamter.endTime == "" || $scope.createParamter.startTime == "") {
                    $scope.timeMessage = "必须填时间";
                    f1 = true;
                }
                if ($scope.createParamter.typeId == "") {
                    $scope.projectTypeMessage = "必须选择类型";
                    f1 = true;
                }
                $scope.createParamter.managerId = $('#managerId').val();
                if ($scope.createParamter.managerId == "") {
                    $scope.projectManagerMessage = "必须选择项目经理";
                    f1 = true;
                }
                $scope.createParamter.customerId = $('#customerId').val();
                if ($scope.createParamter.customerId == "") {
                    $scope.customerMessage = "必须选择客户";
                    f1 = true;
                }
                if ($scope.createParamter.typeNos.indexOf("dataImport") == -1 && $scope.createParamter.typeNos.indexOf("dataCrawl") == -1) {
                    $scope.typeNosMessage = "数据导入，数据抓取必须选择其中一个";
                    f1 = true;
                }
                return !f1;
            };
            /**
             * 加载select插件
             */
            setTimeout(function () {
                $('#managerId').comboSelect();
                $('#customerId').comboSelect();
                createTimepickerOBJ('startTime', 'endTime')
            }, 1000);
            /**
             * 创建时间picker
             */
            var createTimepickerOBJ = function (startId, endId) {
                var startPicker = $('#' + startId).fdatepicker({
                        format: 'yyyy-mm-dd'
                    }
                ).on('changeDate', function (ev) {
                    if (ev.date.valueOf() > endPicker.date.valueOf()) {
                        var newDate = new Date(ev.date);
                        newDate.setDate(newDate.getDate());
                        startPicker.update(newDate);
                    }
                    startPicker.hide();
                    $('#' + endId)[0].focus();
                }).data('datepicker');
                var endPicker = $('#' + endId).fdatepicker({
                    format: 'yyyy-mm-dd',
                    onRender: function (date) {
                        return date.valueOf() < startPicker.date.valueOf() - 86300 ? 'disabled' : '';
                    }
                }).on('changeDate', function (ev) {
                    endPicker.hide();
                }).data('datepicker');
            };
            /**
             * 获取project
             * @param projectId
             */
            var getProject = function (projectId) {
                $http({
                    url: routerUrl.getProjectObj.url,
                    method: routerUrl.getProjectObj.method,
                    data: ck.param({projectId: projectId}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.createParamter = data.data.projectOne;
                    }
                });
            };
            if (mapJson.projectId != '') {
                getProject(mapJson.projectId);
            }
            $scope.check = function ($event, param) {
                var checkBox = $event.target;
                var flag = (checkBox.checked ? true : false);
                var typeNos = $scope.createParamter.typeNos;
                if (flag) {
                    typeNos = typeNos + "," + param;
                } else {
                    typeNos = typeNos.replace(param, "");
                }
                typeNos = typeNos.replace(",,", ",");
                typeNos = typeNos.substr(0, 1) == "," ? typeNos.substr(1, typeNos.length - 1) : typeNos;
                typeNos = typeNos.substr(typeNos.length - 1, 1) == "," ? typeNos.substr(0, typeNos.length - 1) : typeNos;
                $scope.createParamter.typeNos = typeNos;
            };
            /**
             * 判断是否check
             * @param param
             * @returns {boolean}
             */
            $scope.isCheck = function (param) {
                var typeNos = $scope.createParamter.typeNos.split(',');
                return typeNos.indexOf(param) != -1 ? true : false
            };
            /**
             * 获取参数
             */
            var getParamter = function () {
                var util = paramterUtil.init($http);
                util.getParamter('managerList', function (data) {
                    $scope.managerList = data.data.list;
                    setTimeout(function () {
                        $('#managerId').comboSelect();
                    }, 100);
                });
                util.getParamter('customerList', function (data) {
                    $scope.customerList = data.data.list;
                    setTimeout(function () {
                        $('#customerId').comboSelect();
                    }, 100);
                });
            };
            getParamter();
        }]);
        angular.bootstrap(document, ['myApp']);
    });