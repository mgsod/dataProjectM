/**
 * Created by Administrator on 2017/8/22.
 */
define('statisticalAnalysis', ['angular', 'jquery', 'regexp', 'foundation-datepicker'], function (angular, $, regexp) {
    var statisticalAnalysis = {
        init: function (json) {
            this.id = json.targetId;
            this.action = json.action;
            this.data = json.data || {};
            this.$scope = json.$scope;
            this.$http = json.$http;
            this.$compile = json.$compile;
            this.mapJson = json.mapJson;
            this.HEADER = json.HEADER;
            this.routerUrl = json.routerUrl;
            this.fn = json.callback;
            this.cancelFn = json.cancelFn;
            this.first = 1;
            this.importFunction();
        },
        /**
         * 加载功能模块
         */
        importFunction: function () {
            var that = this;
            that.makeData();
            that.getHtml();
            that.viewFunction();
        },
        /**
         * 设置数据
         */
        makeData: function () {
            var that = this;
            that.$scope.updateItem = {
                "name": "",
                "dataType": [{datasourceType: []}],
                "analysisHierarchy": "article",
                "fieldAndFilter": [{}],
                "statisticsObject": [{}]
            };
            that.$scope.dataTypeList = [
                {
                    "storageTypeTableId": "1",
                    "storageTypeTableName": "论坛",
                    "datasourceType": [
                        {
                            "datasourceTypeId": 1,
                            "datasourceTypeName": "今日头条"
                        },
                        {
                            "datasourceTypeId": 2,
                            "datasourceTypeName": "test"
                        }
                    ]
                }
            ];
            that.$scope.analysisHierarchyList = [{"name": "文级", "value": "article"}, {
                "name": "段级",
                "value": "sentence"
            }, {"name": "句级", "value": "section"}];
            that.$scope.wdList = {
                "fieldCategoryList": [
                    {
                        "fieldCategory": "corpus",
                        "fieldCategoryName": "名字",
                        "fieldList": [
                            {
                                "field": "url",
                                "fieldName": "url",
                                "fieldTypeOf": "text"
                            }
                        ]
                    }
                ],
                "conditionList": [
                    {
                        "typeOf": "text",
                        "condition": "classification",
                        "conditionName": "分类",
                        "conditionExpList": [
                            {
                                "conditionExp": "be",
                                "conditionExpName": "是"
                            },
                            {
                                "conditionExp": "notBe",
                                "conditionExpName": "不是"
                            },
                            {
                                "conditionExp": "include",
                                "conditionExpName": "包括"
                            },
                            {
                                "conditionExp": "notInclude",
                                "conditionExpName": "不包括"
                            }
                        ]
                    },
                    {
                        "typeOf": "text",
                        "condition": "number",
                        "conditionName": "数值",
                        "conditionExpList": [
                            {
                                "conditionExp": "equal",
                                "conditionExpName": "等于"
                            },
                            {
                                "conditionExp": "gt",
                                "conditionExpName": "大于"
                            },
                            {
                                "conditionExp": "lt",
                                "conditionExpName": "小于"
                            },
                            {
                                "conditionExp": "gte",
                                "conditionExpName": "大于等于"
                            },
                            {
                                "conditionExp": "lte",
                                "conditionExpName": "小于等于"
                            },
                            {
                                "conditionExp": "between",
                                "conditionExpName": "介于"
                            }
                        ]
                    },
                    {
                        "typeOf": "dateTime",
                        "condition": "dateTime",
                        "conditionName": "时间",
                        "conditionExpList": [
                            {
                                "conditionExp": "specific",
                                "conditionExpName": "指定"
                            },
                            {
                                "conditionExp": "fromTo",
                                "conditionExpName": "起止"
                            }
                        ]
                    }
                ],
                "fieldTypeList": [{"name": "维度", "value": "dimension"}, {"name": "条件", "value": "condition"}],
                "fieldList": [{
                    "field": "url", "fieldName": "网址",
                    "fieldTypeOf": "text"
                }],
                "statisticsType": [
                    {
                        "typeOf": "text",
                        "type": "count",
                        "typeName": "计数"
                    },
                    {
                        "typeOf": "text",
                        "type": "average",
                        "typeName": "平均值"
                    },
                    {
                        "typeOf": "text",
                        "type": "sum",
                        "typeName": "求和"
                    },
                    {
                        "typeOf": "text",
                        "type": "max",
                        "typeName": "最大值"
                    },
                    {
                        "typeOf": "text",
                        "type": "min",
                        "typeName": "最小值"
                    },
                    {
                        "typeOf": "text",
                        "type": "middle",
                        "typeName": "中位值"
                    }
                ]
            };
            if (that.action == 1) {
                that.$scope.updateItem = this.data;
                that._getWdList();
            }
            that._getDataTypeList();
            that._getAnalysisHierarchyList();
        },
        _deleteData: function () {
            var that = this;
            that.$scope.updateItem.fieldAndFilter.splice(0, that.$scope.updateItem.fieldAndFilter.length);
            that.$scope.updateItem.statisticsObject.splice(0, that.$scope.updateItem.statisticsObject.length);
            that.$scope.updateItem.fieldAndFilter.push({});
            that.$scope.updateItem.statisticsObject.push({});
        },
        _getDataTypeList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getDataTypeList.url + "?" + $.param({projectId: that.mapJson.projectId}),
                method: that.routerUrl.getDataTypeList.method
            }).success(function (data) {
                that.$scope.dataTypeList = data.data;
            });
        },
        _getAnalysisHierarchyList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getAnalysisHierarchyList.url + "?" + $.param({projectId: that.mapJson.projectId}),
                method: that.routerUrl.getAnalysisHierarchyList.method
            }).success(function (data) {
                that.$scope.analysisHierarchyList = data.data;
            });
        },
        _getWdList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getFieldFilterList.url + "?" + $.param({
                    projectId: that.mapJson.projectId,
                    dataType: JSON.stringify(that.$scope.updateItem.dataType)
                }),
                method: that.routerUrl.getFieldFilterList.method
            }).success(function (data) {
                that.$scope.wdList = data.data;
                that.$scope.changeAction();
            });
        },
        _createDatePicker: function () {
            setTimeout(function () {
                $('.ck_datetime').fdatepicker({
                    format: "yyyy/mm/dd"
                });
            }, 500);
        },
        /**
         * 加载页面
         */
        getHtml: function () {
            var that = this;
            that.$http({
                url: that.routerUrl[that.mapJson.obj.typeNo].url,
                method: that.routerUrl[that.mapJson.obj.typeNo].method
            }).success(function (data) {
                /**
                 * 把普通dom转换为ng 的 dom
                 */
                var template = angular.element(data);
                var mobileDialogElement = that.$compile(template)(that.$scope);
                $(that.id).html(mobileDialogElement);
            })
        },
        /**
         * 页面操作函数
         */
        viewFunction: function () {
            var that = this;
            //2017/12/08 维护 当选择字段条件为 "维度"时 统计结果中字段列表该字段不可选中
            that.$scope.disabled = function (field) {
                var list = that.$scope.updateItem.fieldAndFilter
                for (var i = 0; i < list.length; i++) {
                    if (list[i].fieldType === 'dimension') {
                        if (list[i].field === field) {
                            return true;
                        }
                    }
                }
            }

            //维护 展开数据源类型选择 默认全选 (新增时)
            that.$scope.initCheckAll = function (array, item) {
                if (!item.first) item.first = false;

                if (that.action != 1 && !item.first) {
                    var list = [];
                    array.forEach(function (item) {
                        list.push(item.datasourceTypeId)
                    });
                    item.datasourceType = list;

                    that._getWdList();
                    that._deleteData();
                    item.first = true;

                }
            }

            //2017/12/11 维护 选择(拆分/格式化) 弹出下拉框
            that.$scope.changeAction = function () {
                var actionList = that.$scope.wdList.dimensionActionList;
                for (var i = 0; i < actionList.length; i++) {
                    if (actionList[i].action == 'format') {
                        that.$scope.actionPropList = actionList[i].actionProp;
                        break;
                    }
                }
            }
            that.$scope.showAction = function (item, action) {
                if (item.fieldZh.indexOf(action) != -1) {
                    return true
                } else {
                    return false;
                }

            }


            that.$scope.cancel = function () {
                that.cancelFn();
                location.reload(); //取消编辑时 重载一次页面
            };
            that.$scope.doUpload = function () {
                saveOutput();
            };

            that.$scope.doGetWdList = function (item) {
                item.datasourceType = [];

                that._getWdList();
                that._deleteData();
            };


            that.$scope.createTimePicker = function (fieldTypeOf) {
                if (fieldTypeOf == 'datetime') {
                    that._createDatePicker();
                }
            };
            that.$scope.setFieldTypeOf = function (item) {
                var list = item.fieldZh.split(',');
                item.field = list[0];
                item.fieldTypeOf = list[1];
                item.fieldName = list[2];
                item.action = null;
                item.fieldType = null;
                item.actionValue = null;
            };
            that.$scope.doCreate = function (param) {
                if (param == 'dataType') {
                    that.$scope.updateItem[param].push({storageTypeTableId: "", datasourceType: []})
                } else {
                    that.$scope.updateItem[param].push({})
                }
            };
            that.$scope.doChoose = function ($event, param, item) {
                var checkbox = $event.target;
                var flag = checkbox.checked ? true : false;
                item.datasourceType = typeof item.datasourceType == 'undefined' ? [] : item.datasourceType;
                if (flag) {
                    item.datasourceType.push(param);
                } else {
                    var index = item.datasourceType.indexOf(param);
                    item.datasourceType.splice(index, 1);
                }
                that._getWdList();
                that._deleteData();
            };
            that.$scope.doChooseAll = function ($event, array, item) {
                var checkbox = $event.target;
                var flag = checkbox.checked ? true : false;
                if (flag) {
                    var list = [];
                    array.forEach(function (item) {
                        list.push(item.datasourceTypeId)
                    });
                    item.datasourceType = list;
                } else {
                    item.datasourceType = [];
                }
                that._getWdList();
                that._deleteData();
            };
            that.$scope.doDeleteItem = function (param, index) {
                if (param == 'dataType') {
                    that.$scope.updateItem[param].splice(index, 1);
                    that._getWdList();
                    that._deleteData();
                } else {
                    that.$scope.updateItem[param].splice(index, 1);
                }
                if (that.$scope.updateItem[param].length == 0) {
                    that.$scope.doCreate(param);
                }
            };
            var saveOutput = function () {
                if (that.$scope.updateItem.name.trim() == "") {
                    alert("该统计名称不能为空!");
                    return
                }
                if (/[\（\~\!\@\#\￥\%\…\&\*\:\”\;\’\\\/\?\{\}\>\,\<\|\+\-\=\）]/.test(that.$scope.updateItem.name)) {
                    alert("该统计名称字符不合法!");
                    return
                }

                that.$http({
                    url: that.routerUrl.saveStatisticsAnalysis.url,
                    method: that.routerUrl.saveStatisticsAnalysis.method,
                    data: $.param({
                        projectId: that.mapJson.projectId,
                        typeNo: that.mapJson.obj.typeNo,
                        jsonParam: JSON.stringify(that.$scope.updateItem)
                    }),
                    headers: that.HEADER.formHeader
                }).success(function (data) {
                    that.fn(data);
                });
            };
        }
    };
    return statisticalAnalysis
});