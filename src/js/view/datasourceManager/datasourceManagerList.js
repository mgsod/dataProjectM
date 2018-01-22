/**
 * Created by Administrator on 2017/8/3.
 */
require(['angular', 'jquery', 'ck', 'regexp', 'pagination', 'http', 'router', 'paramterUtil', 'comboSelect'],
    function (angular, $, ck, regexp, pagination, http, router, paramterUtil) {
        var app = angular.module('myApp', []);
        /**
         * 这儿是创建拦截器
         */
        http(app);
        app.controller('controller', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
            var HEADER = router.HEADER;
            var routerUrl = router.routerUrl;
            var util = paramterUtil.init($http);
            $scope.totalPage = 2;
            $scope.searchParamter = {
                datasourceId: "",
                datasourceTypeId: "",
                status: "",
                page: "1",
                size: "15",
                sortStatus: localStorage.getItem("order") || "id desc"
            };
            /**
             * 选择排序
             * @param param
             */
            $scope.selectOrder = function (param) {
                localStorage.setItem("order", param);
                $scope.searchParamter.sortStatus = param;
                $scope.searchList('reset');
            };
            $scope.datasourceList = [
                {
                    datasourceId: 1,
                    datasourceName: "新闻",
                    datasourceTypes: [
                        {
                            typeId: 1,
                            typeName: "百度新闻",
                            storageTypeTable: "news"
                        }
                    ]
                },
                {
                    datasourceId: 8,
                    datasourceName: "凤凰",
                    datasourceTypes: [
                        {
                            typeId: 6,
                            typeName: "凤凰咨询",
                            storageTypeTable: "ifeng_news"
                        }
                    ]
                }
            ];
            $scope.datasourceTypeList = [];
            $scope.statusList = [{name: "失效", value: 1}];
            $scope.dataSourceTypeRelationList = [
                {
                    "id": 7,
                    "fieldCnName": "标题",
                    "fieldEnName": "title",
                    "fieldDesc": "标题",
                    "fieldType": "2",
                    "fieldLength": 100,
                    "decimalLength": 0
                },
                {
                    "id": 8,
                    "fieldCnName": "摘要",
                    "fieldEnName": "summary",
                    "fieldDesc": "摘要",
                    "fieldType": "2",
                    "fieldLength": 500,
                    "decimalLength": 0
                }
            ];
            $scope.updateItem = {};
            $scope.newDataSourceList = [{
                datasourceId: 1,
                datasourceName: "新闻",
                datasourceTypes: [
                    {
                        typeId: 1,
                        typeName: "百度新闻",
                        storageTypeTable: "news"
                    }
                ]
            },
                {
                    datasourceId: 8,
                    datasourceName: "凤凰",
                    datasourceTypes: [
                        {
                            typeId: 6,
                            typeName: "凤凰咨询",
                            storageTypeTable: "ifeng_news"
                        }
                    ]
                }];
            $scope.dataList = [
                {
                    id: 1,
                    datasourceId: 1,
                    datasourceName: "今日头条",
                    datasourceTypeId: 1,
                    datasourceTypeName: "今日头条新闻列表",
                    confObject: "语义分析对象",
                    confField: "(标题+内容)+摘要",
                    statusName: "失效",
                    status: 1,
                    updatedTime: "2017-05-0317: 02: 52",
                    updatedBy: "admin",
                    jsonParam: {
                        id: 1,
                        datasourceId: 1,
                        datasourceTypeId: 1,
                        datasourceName: "今日头条",
                        datasourceTypeName: "今日头条新闻列表",
                        confObject: "语义分析对象",
                        contentTypes: [
                            {
                                fieldId: "7",
                                isDefault: 1
                            }
                        ]
                    }
                },
                {
                    id: 2,
                    datasourceId: 1,
                    datasourceName: "今日头条",
                    datasourceTypeId: 1,
                    datasourceTypeName: "今日头条新闻列表",
                    confObject: "语义分析对象",
                    confField: "(标题+内容)+摘要",
                    statusName: "失效",
                    status: 0,
                    updatedTime: "2017-05-0317: 02: 52",
                    updatedBy: "admin",
                    jsonParam: {
                        id: 1,
                        datasourceId: 1,
                        datasourceTypeId: 1,
                        datasourceName: "今日头条",
                        datasourceTypeName: "今日头条新闻列表",
                        confObject: "语义分析对象",
                        contentTypes: [
                            {
                                fieldId: "7",
                                isDefault: 0
                            }
                        ]
                    }
                }
            ];
            /**
             * 编辑
             * @param action
             * @param item
             */
            $scope.editItem = function (action, item) {
                $scope.isCreate = action == 1 ? true : false;
                $scope.updateItem = !$scope.isCreate ? item.jsonParam : {
                        datasourceId: "",
                        datasourceTypeId: "",
                        confObject: "语义分析对象",
                        contentTypes: [{
                            fieldId: $scope.dataSourceTypeRelationList[0].id + "",
                            isDefault: 0
                        }]
                    };
                if (!$scope.isCreate) {
                    _getDataSourceTypeRelation();
                } else {
                    _getNewDatasouce();
                }
                $scope.isShowAlt = true;
            };
            /**
             * 隐藏
             */
            $scope.hiddenAlt = function () {
                $scope.isShowAlt = false;
            };
            /**
             * 查询list
             */
            $scope.searchList = function (param) {
                typeof param != 'undefined' ? pagination.goNextPage(param) : null;
                $scope.searchParamter.page = pagination.getPage();
                _getData();
            };
            /**
             * 获取datalist数据
             * @private
             */
            var _getData = function () {
                $http({
                    url: routerUrl.getDatasourceTypeListAndContentType.url,
                    method: routerUrl.getDatasourceTypeListAndContentType.method,
                    data: $.param($scope.searchParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    $scope.dataList = data.data.dataList;
                    pagination.init(data.data.count, $scope.searchParamter.size);
                    $scope.totalPage = pagination.getTotalPage();
                });
            };
            /**
             * 获取paramter
             */
            var getParamter = function () {
                util.getParamter('getAllDateSourceTypeList', function (data) {
                    $scope.datasourceList = data.data;
                    _creataCom();
                });
                util.getParamter('getStatusList', function (data) {
                    $scope.statusList = data.data;
                });
                /*  util.getParamter('getDataSourceTypeRelation', function (data) {
                 $scope.dataSourceTypeRelationList = data.data;
                 });*/
            };
            /**
             * 获取datasourcetyperealation
             *
             * @private
             */
            var _getDataSourceTypeRelation = function () {
                $http({
                    url: routerUrl.getDataSourceTypeRelation.url + "?" + $.param({datasourceTypeId: $scope.updateItem.datasourceTypeId}),
                    method: routerUrl.getDataSourceTypeRelation.method
                }).success(function (data) {
                    $scope.dataSourceTypeRelationList = data.data;
                });
            };
            /**
             * 获取新的datasource
             * @private
             */
            var _getNewDatasouce = function () {
                util.getParamter('getNotAddDatasourceTypeList', function (data) {
                    if (data.data.length == 0) {
                        alert("数据源已经用完了！");
                        $scope.isShowAlt = false;
                        return
                    }
                    $scope.newDataSourceList = data.data;
                    if ($scope.isCreate) {
                        $scope.updateItem.datasourceId = $scope.newDataSourceList[0].datasourceId;
                        $scope.updateItem.datasourceName = $scope.newDataSourceList[0].datasourceName;
                        $scope.datasourceTypeList2 = $scope.newDataSourceList[0].datasourceTypes;
                        $scope.updateItem.datasourceTypeId = $scope.newDataSourceList[0].datasourceTypes[0].typeId;
                        $scope.updateItem.datasourceTypeName = $scope.newDataSourceList[0].datasourceTypes[0].typeName;
                    }
                });
            };
            /**
             * 执行启动
             * @param id
             */
            $scope.doStart = function (id) {
                _doStart(id);
            };
            /**
             * 启动
             * @param id
             * @private
             */
            var _doStart = function (id) {
                $http({
                    url: routerUrl.enabledDatasourceAndContent.url,
                    method: routerUrl.enabledDatasourceAndContent.method,
                    data: $.param({id: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code != 0) {
                        alert(data.message);
                    }
                    _getData();
                });
            };
            /**
             * 执行失效
             * @param id
             */
            $scope.doStop = function (id) {
                _doStop(id)
            };
            /**
             * 失效
             * @param id
             * @private
             */
            var _doStop = function (id) {
                $http({
                    url: routerUrl.failDatasourceAndContent.url,
                    method: routerUrl.failDatasourceAndContent.method,
                    data: $.param({id: id}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code != 0) {
                        alert(data.message);
                    }
                    _getData();
                });
            };
            /**
             * 创建com select
             * @private
             */
            var _creataCom = function () {
                setTimeout(function () {
                    $('#datasource').comboSelect();
                }, 500);
            };
            /**
             * 设置types
             */
            $scope.setDatasourceTypeList = function () {
                $scope.searchParamter.datasourceTypeId = "";
                $scope.datasourceTypeList = [];
                var i = 0;
                if ($scope.searchParamter.datasourceId != "") {
                    while (true) {
                        if ($scope.datasourceList[i].datasourceId == $scope.searchParamter.datasourceId) {
                            $scope.datasourceTypeList = $scope.datasourceList[i].datasourceTypes;
                            break;
                        }
                        i++;
                    }
                }
            };
            /**
             * 设置datasourcelist
             */
            $scope.setDatasourceTypeList2 = function () {
                $scope.updateItem.datasourceTypeId = "";
                $scope.datasourceTypeList2 = [];
                var i = 0;
                while (true) {
                    if ($scope.newDataSourceList[i].datasourceId == $scope.updateItem.datasourceId) {
                        $scope.updateItem.datasourceName = $scope.newDataSourceList[i].datasourceName;
                        $scope.datasourceTypeList2 = $scope.newDataSourceList[i].datasourceTypes;
                        $scope.updateItem.datasourceTypeId = $scope.datasourceTypeList2[0].typeId + "";
                        $scope.updateItem.datasourceTypeName = $scope.datasourceTypeList2[0].typeName;
                        break;
                    }
                    i++;
                }
                _getDataSourceTypeRelation();
            };
            /**
             * 设置datasourcetypeName
             */
            $scope.setDatasourceTypeName = function () {
                var i = 0;
                while (true) {
                    if ($scope.updateItem.datasourceTypeId == $scope.datasourceTypeList2[i].typeId) {
                        $scope.updateItem.datasourceTypeName = $scope.datasourceTypeList2[i].typeName;
                        break;
                    }
                    i++;
                }
                _getDataSourceTypeRelation();
            };
            /**
             * 增加
             */
            $scope.addContentType = function () {
                $scope.updateItem.contentTypes.push({
                    fieldId: $scope.dataSourceTypeRelationList[0].id + "",
                    isDefault: 0
                });
            };
            /**
             * 删除
             * @param index
             */
            $scope.removeContentType = function (index) {
                $scope.updateItem.contentTypes.splice(index, 1);
            };
            /**
             * 改变default
             * @param item
             */
            $scope.changeDefault = function (item) {
                item.isDefault = item.isDefault == 1 ? 0 : 1;
            };
            /**
             * save数据
             */
            $scope.saveUpdateItem = function () {
                _saveData();
            };
            /**
             * 执行保存
             * @private
             */
            var _saveData = function () {
                $http({
                    url: routerUrl.saveDatasourceTypeConf.url,
                    method: routerUrl.saveDatasourceTypeConf.method,
                    data: $.param({jsonParam: JSON.stringify($scope.updateItem)}),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data.code != 0) {
                        alert(data.message);
                    }
                    _getData();
                    $scope.isShowAlt = false;
                });
            };
            getParamter();
            _creataCom();
            _getData();
        }]);
        angular.bootstrap(document, ['myApp']);
    });