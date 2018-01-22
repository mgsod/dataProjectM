/**
 * Created by Administrator on 2017/5/12.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'router'],
    function (angular, $, ck, regexp, pagination, http, router) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
            var HEADER = router.HEADER;
            var routerUrl = router.routerUrl;
            var mapJson = JSON.parse($('#mapJson').val());
            $scope.totalPage = 2;
            $scope.tabList = mapJson.tabList || [];//tab
            $scope.titleList = ["项目名", "名字", "编码"];// table 头部
            $scope.dataList = [
                ["刺激", "段及", "文集"],
                ["送达方", "发大水个那个", "发上个网"]
            ];//数据

            $scope.searchParamter = {
                flag: "",
                size: "15",
                page: 1,
                type: typeof mapJson.tabList != 'undefined' ? mapJson.tabList[0].id : null,
                projectId: mapJson.projectId,
                paramId: mapJson.paramId,
                detailId: typeof mapJson.tabList != 'undefined' ? mapJson.tabList[0].detailId : null,
                lastIndexId: ''
            };


            /**
             * 查询 赋值 page
             * @param param
             */
            $scope.searchList = function (param) {
                typeof param != 'undefined' ? pagination.goNextPage(param) : null;
                $scope.searchParamter.flag = param;
                $scope.searchParamter.page = pagination.getPage();
                setLastIndexID($scope.searchParamter.flag);

                //   console.log($scope.searchParamter);

                searchList();
            };
            /**
             * 分配接口
             */
            var searchList = function () {
                $scope.isLoading = true;
                switch (mapJson.typeNo) {
                    case 'dataImport':
                        getDataImportList();
                        break;
                    case 'semanticAnalysisObject':
                        semanticAnalysisObjectList();
                        break;
                    case 'topicAnalysisDefinition':
                        getTopicAnalysisDefinitionList();
                        break;
                    case 'themeAnalysisSetting':
                        getThemeAnalysisSettingList();
                        break;
                    case 'wordSegmentation':
                        getWordSegmentationList();
                        break;
                    case 'dataCrawl':
                        getDataImportList();
                        break;
                    default:
                        getDataInquire();
                        break;

                }
            };
            var getDataInquire = function () {
                $http({
                    url: routerUrl.dataInquire.url,
                    method: routerUrl.dataInquire.method,
                    data: $.param($scope.searchParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    $scope.isLoading = false;
                    setData(data)
                });
            };


            //设置lastIndexId
            var setLastIndexID = function (flag) {
                if(!$scope.titleList){ $scope.searchParamter.flag = '' ; return false;}
                var indexId =  $scope.titleList.indexOf('indexId');
                if (indexId == -1) return false;
                var index, lastIndexId;
                switch (flag) {
                    case "pre":
                        index = 0;
                        lastIndexId = $scope.dataList[index][indexId]
                        break;
                    case "next":
                        index = $scope.dataList.length - 1;
                        lastIndexId = $scope.dataList[index][indexId]
                        break;
                    case "reset":
                        lastIndexId = '';
                        $scope.searchParamter.flag = '';
                        break;
                    default:
                        break;


                }

                $scope.searchParamter.lastIndexId = lastIndexId;
            }
            /**
             * 获取数据导入的数据
             */
            var getDataImportList = function () {
                $http({
                    url: routerUrl.getDataImportListFromShowData.url,
                    method: routerUrl.getDataImportListFromShowData.method,
                    data: $.param($scope.searchParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    $scope.isLoading = false;
                    setData(data);
                });
            };
            /**
             * 获取话题的数据
             */
            var getTopicAnalysisDefinitionList = function () {
                $http({
                    url: routerUrl.getHotpostSemanticResultList.url,
                    method: routerUrl.getHotpostSemanticResultList.method,
                    data: $.param($scope.searchParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    $scope.isLoading = false;
                    setData(data)
                });
            };
            /**
             * 获取主题的数据
             */
            var getThemeAnalysisSettingList = function () {
                $http({
                    url: routerUrl.getSubjectSemanticResultList.url,
                    method: routerUrl.getSubjectSemanticResultList.method,
                    data: $.param($scope.searchParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    $scope.isLoading = false;
                    setData(data)
                });
            };
            /**
             * 获取分词的数据
             */
            var getWordSegmentationList = function () {
                $http({
                    url: routerUrl.getSegSemanticResultList.url,
                    method: routerUrl.getSegSemanticResultList.method,
                    data: $.param($scope.searchParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    $scope.isLoading = false;
                    setData(data)
                });
            };
            /**
             * {list:[[],[],[],[]],count:2}
             * 语义分析list查询
             */
            var semanticAnalysisObjectList = function () {
                $http({
                    url: routerUrl.getSemanticAnalysisObjectListFromShowData.url,
                    method: routerUrl.getSemanticAnalysisObjectListFromShowData.method,
                    data: $.param($scope.searchParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    $scope.isLoading = false;
                    setData(data)
                });
            };
            /**
             * 设置数据
             * @param data
             */
            var setData = function (data) {
                // console.log(data);
                $scope.dataList = data.data.dataList;
                $scope.titleList = data.data.titleList;
                /*var hasIndex = [],noIndex = [],reg = /id/i;
                data.data.titleList.map(function(item){
                    if(reg.test(item)){
                        hasIndex.push(item)
                    }else{
                        noIndex.push(item)
                    }
                })
                $scope.titleList =   hasIndex.concat(noIndex)*/


                pagination.init(data.data.count, $scope.searchParamter.size);
                $scope.totalPage = pagination.getTotalPage();

            };
            /**
             * 控制altBox
             * @param e
             */
            window.showAlt = function (e) {
                var $myAlt = $('#myAlt');
                var message = $(e).attr('message');
                if (message.indexOf('http') != -1) {
                    $myAlt.css({"max-width": "100%"})
                } else {
                    $myAlt.css({"max-width": "30%"})
                }
                $myAlt.html(message);
                $myAlt.show();
                var offset = $(e).offset();
                var top = offset.top + $(e).height();
                var left = offset.left + $(e).width();
                if (offset.left > document.body.clientWidth / 2) {
                    left = offset.left - $myAlt.width();
                }
                $myAlt.animate({left: left, top: top, opacity: 1}, 100)
            };
            /**
             * 隐藏alt
             */
            window.hideAlt = function () {
                var $myAlt = $('#myAlt');
                $myAlt.animate({opacity: 0}, 50);
                $myAlt.hide();
            };
            $scope.searchList();
        }]);
        angular.bootstrap(document, ['myApp']);
    });