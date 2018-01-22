/**
 * Created by Administrator on 2017/4/28.
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
            var mapJson = JSON.parse($('#mapJson').val());
            var flowWork = mapJson.workFlowList;
            var projectId = mapJson.projectId;
            $scope.projectId = mapJson.projectId;
            $scope.status = [0, 1, 2, 4, 5, 9];
            $scope.isEdit = true;
            $scope.project = {
                /*
                 projectName: "汽车新闻",
                 managerName: "张三",
                 customerName: "东方传媒",
                 typeName: "日报",
                 projectDescribe: "日发的萨芬挖去发大水发大水发大水发刚报"
                 */
            };
            $scope.importList = [
                /*     {
                 paramId: '1',
                 name: '你好',
                 createTime: '2017-12-1 10:00:00',
                 type: '微信',
                 count: '1000',
                 isStart: '1'
                 }, {
                 paramId: '2',
                 name: '不好',
                 createTime: '2017-12-3 10:00:00',
                 type: '微信',
                 count: '1000',
                 isStart: '0'
                 }, {
                 paramId: '3',
                 name: '什么哦',
                 createTime: '2017-12-2 10:00:00',
                 type: '微信',
                 count: '1000',
                 isStart: '1'
                 }*/
            ];
            $scope.semanticAnalysisObjectList = [/*
             {
             paramId: 345,
             dataSourceTypeName: "微博",
             analysisObjectName: "正文全文",
             sentence: "分词+主题",
             section: "无",
             article: "分词+主题+话题",
             jsonParam: {
             dataSourceTypeId: "1",
             dataSourceTypeName: "微博",
             analysisObject: [
             {
             contentType: "1",
             contentTypeName: '标题',
             subType: 2,
             subTypeName: "全文",
             value: 100
             }
             ],
             analysisHierarchy: [
             {
             type: '1',
             hierarchy: "1,2",
             hierarchyName: "句子,段落",
             calculation: "2",
             calculationName: "简单相加"
             },
             {
             type: '2',
             hierarchy: "1",
             hierarchyName: "句子,段落",
             calculation: "2",
             calculationName: "简单相加"
             },
             {
             type: '3',
             hierarchy: "3",
             hierarchyName: "句子,段落",
             calculation: "2",
             calculationName: "简单相加"
             }
             ]
             }
             }
             */];
            $scope.dataCrawlList = [
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
                                paramValue: {input: "", file: ""},
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
            $scope.outputList = [
                /*   {
                 "id": 1,
                 "name": "xxxx",
                 "typeName": "微博",
                 "apiType": "json",
                 "type": "1",
                 "url": "http://host:8080",
                 "mapRelationValue": "1,2",
                 "mapRelationValueName": "值，值值，值"
                 }*/
            ];
            $scope.fileOutputList = [{
                "paramId": 1,
                "dataSourceTypeName": "微博",
                "filename": "文件名称",
                "queryFieldName": "用户名+省份+粉丝数",
                "analysisObjectName": "分词+主题+话题",
                "analysisLevel": "句级+段级+文级",
                "jobStatus": "1",
                "jobProgress": "20",
                "fileUrl": "http://host:8080"
            }];
            $scope.themeAnalysisSettingList = [/*{
             paramId: "参数id",
             dataSourceTypeName: " 数据源 类型名称",
             analysisObjectName: " 分析对象名称",
             sentence: " 句级",
             section: " 段级",
             article: " 文级"
             }*/];
            $scope.topicAnalysisDefinitionList = [/*{
             paramId: "参数id",
             dataSourceTypeName: " 数据源 类型名称",
             analysisObjectName: " 分析对象名称",
             sentence: " 句级",
             section: " 段级",
             article: " 文级"
             }*/];
            $scope.wordSegmentationStatus = 0;
            $scope.themeAnalysisSettingStatus = 0;
            $scope.topicAnalysisDefinitionStatus = 0;
            $scope.wordSegmentationList = [/*{
             paramId: "参数id",
             dataSourceTypeName: "数据源 类型名称",
             analysisObjectName: "分析对象名称",
             sentence: "句级",
             section: " 段级",
             article: "文级",
             status: "1",
             wordLibrarys: "所选词库"
             }*/];
            $scope.dataImportShowOrder = "";
            $scope.workList = [];
            var getWork = function (flowWork) {
                flowWork.forEach(function (item) {
                    $scope.workList.push(item.typeNo);
                });
            };
            getWork(flowWork);
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
             * 页面跳转
             * @param param
             */
            $scope.goUpdatePage = function (param) {
                if (param == 'createProject') {
                    location.href = "/project/projectCreatePage.html?from=1&projectId=" + projectId;
                    return
                }
                var i = 0;
                while (1) {
                    if (flowWork[i].typeNo == param) {
                        location.href = flowWork[i].url;
                        break;
                    }
                    i++
                }
            };
            /**
             * 获取话题，分词，主题
             */
            var getAnalysisObjectHomeList = function () {
                $http({
                    url: routerUrl.getAnalysisObjectHomeList.url + "?projectId=" + mapJson.projectId + "&typeNo=wordSegmentation,themeAnalysisSetting,topicAnalysisDefinition",
                    method: routerUrl.getAnalysisObjectHomeList.method
                    //         headers: HEADER.formHeader
                    /*     data: ck.param({
                     projectId: mapJson.projectId,
                     typeNo: "wordSegmentation,themeAnalysisSetting,topicAnalysisDefinition"
                     })*/
                }).success(function (data) {
                    $scope.wordSegmentationList = data.data.segHomeShowPOList;
                    $scope.themeAnalysisSettingList = data.data.subjectHomeShowPOList;
                    $scope.topicAnalysisDefinitionList = data.data.hotspotsHomeShowPOList;
                    setTimeout(function () {
                        ck.progress.init()
                    }, 1000);
                })
            };
            /**
             * 获取dataImport
             */
            var getDataImportList = function () {
                $http({
                    url: routerUrl.dataImportList.url,
                    method: routerUrl.dataImportList.method,
                    headers: HEADER.formHeader,
                    data: ck.param({projectId: mapJson.projectId, typeNo: 'dataImport'})
                }).success(function (data) {
                    $scope.importList = data.data.importDataDetailList;
                    setTimeout(function () {
                        ck.progress.init()
                    }, 1000);
                });
            };
            var getDataCrawlList = function () {
                $http({
                    url: routerUrl.getDataCrawlList.url,
                    method: routerUrl.getDataCrawlList.method,
                    data: ck.param({projectId: mapJson.projectId, typeNo: 'dataCrawl'}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.dataCrawlList = data.data;
                    }
                });
            };
            /**
             * 获取dataOutput
             */
            var getDataOutputList = function () {
                $http({
                    url: routerUrl.getDataOutputList.url,
                    method: routerUrl.getDataOutputList.method,
                    headers: HEADER.formHeader,
                    data: ck.param({projectId: mapJson.projectId, typeNo: 'dataOutput'})
                }).success(function (data) {
                    $scope.outputList = data.data.outPutDataDetailList;
                });
            };
            /**
             * semanticAnalysisObject
             */
            var getSemanticAnalysisObjectList = function () {
                $http({
                    url: routerUrl.getSemanticAnalysisObjectList.url + "?projectId=" + mapJson.projectId + "&typeNo=semanticAnalysisObject",
                    method: routerUrl.getSemanticAnalysisObjectList.method
                    /* headers: HEADER.formHeader,
                     data: ck.param({projectId: mapJson.projectId, typeNo: 'semanticAnalysisObject'})*/
                }).success(function (data) {
                    $scope.semanticAnalysisObjectList = data.data.list;
                    setTimeout(function () {
                        ck.progress.init()
                    }, 1000);
                });
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
                        $scope.project = data.data.projectOne;
                    }
                });
            };
            /**
             * 获取fileOutput
             */
            var getFileOutput = function () {
                $http({
                    url: routerUrl.getExportConfigList.url + "?projectId=" + mapJson.projectId + "&typeNo=fileOutput",
                    method: routerUrl.getExportConfigList.method,
                    //data: ck.param({projectId: mapJson.projectId, typeNo: mapJson.obj.typeNo}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.fileOutputList = data.data;
                    }
                });
            };
            /**
             * 查询列表
             */
            var getStatisticalAnalysis = function () {
                $http({
                    url: routerUrl.getStatisticsAnalysisList.url + "?projectId=" + mapJson.projectId + "&typeNo=statisticalAnalysis",
                    method: routerUrl.getStatisticsAnalysisList.method
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.statisticalAnalysisList = data.data;
                    }
                });
            };
            getStatisticalAnalysis();
            getFileOutput();
            getProject(projectId);
            getSemanticAnalysisObjectList();
            getDataOutputList();
            getDataImportList();
            getAnalysisObjectHomeList();
            getDataCrawlList();
            setInterval(function () {
                getFileOutput();
                getProject(projectId);
                getSemanticAnalysisObjectList();
                getDataOutputList();
                getDataImportList();
                getAnalysisObjectHomeList();
                getDataCrawlList();
            }, 15000);

            /*     /!**
             * 控制altBox
             * @param e
             *!/
             window.showAlt = function (e) {
             var $myAlt = $('#myAlt');
             $myAlt.show();
             var offset = $(e).offset();
             var top = offset.top - $('.ck_topbar').height() + $(e).height();
             if (offset.top > document.body.clientHeight / 2) {
             top = top - $myAlt.height()-$(e).height();
             }
             var left = offset.left - $('.ck_content').offset().left + $(e).width();
             if (offset.left > document.body.clientWidth / 2) {
             left = offset.left - $('.ck_content').offset().left - $(e).width() / 2 - 150 / 4;
             }
             var message = $(e).attr('message');
             $myAlt.html(message.replace(/\,/g, ', '));
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