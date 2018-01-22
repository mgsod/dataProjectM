/**
 * Created by Administrator on 2017/5/9.
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
            $scope.sortStatus = 'name';
            $scope.selectOrder = function (param) {
                $scope.sortStatus = param;
            };
            $scope.isOpenWork = false;
            $scope.dataList = [
                /*    {
                 "paramId": 1,
                 "dataSourceTypeName": "微博",
                 "filename": "文件名称",
                 "queryFieldName": "用户名+省份+粉丝数",
                 "analysisObjectName": "分词+主题+话题",
                 "analysisLevel": "句级+段级+文级",
                 "jobStatus": "0",
                 "jobProgress": "10",
                 "fileUrl": "http://host:8080"
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
                    alert('请设置导出文件信息');
                    return
                }
                location.href = $scope.prePage
            };
            $scope.goNext = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请设置导出文件信息');
                    return
                }
                location.href = $scope.nextPage;
            };
            $scope.goIndex = function () {
                var flag = checkDataImportIsShow();
                if (flag) {
                    alert('请设置导出文件信息');
                    return
                }
                location.href = $scope.finishPage;
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
                    url: routerUrl.getExportConfigList.url + "?projectId=" + mapJson.projectId + "&typeNo=" + mapJson.obj.typeNo,
                    method: routerUrl.getExportConfigList.method,
                    //data: ck.param({projectId: mapJson.projectId, typeNo: mapJson.obj.typeNo}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.dataList = data.data;
                        setTimeout(function () {
                            ck.progress.init()
                        }, 500);
                    }
                });
            };
            $scope.doDeleteFile = function (id) {
                $http({
                    url: routerUrl.deleteFileOutputItem.url,
                    method: routerUrl.deleteFileOutputItem.method,
                    data: ck.param({paramId: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    alert(data.message || "删除成功");
                    searchList()
                });
            };
            searchList();
            /**
             * 下载文件
             * @param address
             */
            $scope.doDownLoadFile = function (address) {
                var addressList = address.split(',');
                addressList.forEach(function (item) {
                    window.open(item, '_blank');
                })
            };
            /**
             *以下是流程控制相关的
             */
            $scope.dataOutputModule = function (action, item) {
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
          /*  /!**
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
                $myAlt.html(message.replace(/\,/g,', '));
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