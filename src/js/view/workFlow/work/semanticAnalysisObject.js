/**
 * Created by Administrator on 2017/4/24.
 */
define('semanticAnalysisObject', ['angular', 'jquery'], function (angular, $) {
    var semanticAnalysisObject = {
        /**
         * targetId, action,data, $scope, $http, $compile, mapJson, HEADER, routerUrl,callback
         * @param json
         */
        init: function (json) {
            this.id = json.targetId;
            this.action = json.action;
            this.data = json.data;
            this.$scope = json.$scope;
            this.$http = json.$http;
            this.$compile = json.$compile;
            this.mapJson = json.mapJson;
            this.HEADER = json.HEADER;
            this.routerUrl = json.routerUrl;
            this.fn = json.callback;
            this.cancelFn = json.cancelFn;
            this.importFunction();

        },
        /**
         * 加载功能模块
         */
        importFunction: function () {
            var that = this;
            that.makeData();
            that.getHtml();
            that.viewAction();
        },
        /*
         * {
         paramId: 347,
         dataSourceTypeName: "微博",
         analysisObjectName: "123",
         sentence: "分词+主题",
         section: "无",
         article: "分词+主题+话题",
         jsonParam: {
         dataSourceTypeId: "1",
         dataSourceTypeName: "微博",
         analysisObject: [
         {
         conentType: 1,
         conentTypeName: '标题',
         subtype: 2,
         subtypeName: "全文",
         value: 100
         }
         ],
         analysisHierarchy: [
         {
         segHierarchy: "1,2",
         segHierarchyName: "句子,段落",
         segCalculation: 2,
         segCalculationName: "简单相加"
         },
         {
         subjectHierarchy: "1,2",
         subjectHierarchyName: "句子,段落",
         subjectCalculation: 2,
         subjectCalculationName: "段落"
         },
         {
         hotspotHierarchy: "3",
         hotspotHierarchyName: "文章",
         hotspotCalculation: 3,
         hotspotCalculationName: "次数加权"
         }
         ]
         }
         },
         * */
        makeData: function () {
            var that = this;
            that.$scope.updateItem = that.data;
            if (that.action == 0) {
                that.$scope.updateItem.jsonParam.analysisObject = [];
                that.$scope.updateItem.jsonParam.analysisHierarchy = [
                    {
                        "type": 1,
                        "hierarchy": ""
                    },
                    {
                        "type": 2,
                        "hierarchy": "",
                        "calculation": "1"
                    },
                    {
                        "type": 3,
                        "hierarchy": "",
                        "calculation": "1"
                    }

                ];
            }
            that.$scope.textList = [{contentType: '1', contentTypeName: '标题'}, {
                contentType: '1',
                contentTypeName: '摘要'
            }];
            that.$scope.createItem = {subType: '1'};
            that.getTextList();
        },
        /**
         * 获取文本数据
         */
        getTextList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getContentTypeList.url + "?dataSourceTypeId=" + that.data.jsonParam.dataSourceTypeId,
                method: that.routerUrl.getContentTypeList.method,
                headers: that.HEADER.formHeader
            }).success(function (data) {
                that.$scope.textList = data.data;
            })
        },
        /**
         * 获取页面
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
        checkType: function () {
            var that = this;
            var list = [];
            var flag = false;
            /* if (that.$scope.updateItem.jsonParam.analysisObject.length == 0) {
             return true
             }*/
            that.$scope.updateItem.jsonParam.analysisObject.forEach(function (item) {
                if (item.value != "") {
                    if (/\./.test(item.value)) {
                        flag = true
                    }
                }
                if (list.indexOf(item.contentType) != -1) {
                    flag = true
                } else {
                    list.push(item.contentType)
                }
            });
            return flag
        },
        /**
         * 页面action
         */
        viewAction: function () {
            var that = this;
            that.$scope.cancel = function () {
                that.cancelFn();
            };
            /**
             * 选择checkbox
             * @param $event
             * @param item
             * @param type
             */
            that.$scope.updateCheckbox = function ($event, item, type) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? '1' : '0');
                if (action == 1) {
                    that.$scope.updateItem.jsonParam.analysisHierarchy.forEach(function (jtem) {
                        if (jtem.type < item.type && jtem.hierarchy.indexOf(type) == -1) {
                            jtem.hierarchy = jtem.hierarchy + "," + type;
                            jtem.hierarchy = jtem.hierarchy.substr(0, 1) == "," ? jtem.hierarchy.substr(1, jtem.hierarchy.length) : jtem.hierarchy;
                            jtem.hierarchy = jtem.hierarchy.substr(jtem.hierarchy.length - 1, 1) == "," ? jtem.hierarchy.substr(0, jtem.hierarchy.length - 1) : jtem.hierarchy;
                        }
                    })
                }
                item.hierarchy = action == 1 ? item.hierarchy + "," + type : item.hierarchy.replace(type, "");
                item.hierarchy = item.hierarchy.replace(",,", ",");
                item.hierarchy = item.hierarchy.substr(0, 1) == "," ? item.hierarchy.substr(1, item.hierarchy.length) : item.hierarchy;
                item.hierarchy = item.hierarchy.substr(item.hierarchy.length - 1, 1) == "," ? item.hierarchy.substr(0, item.hierarchy.length - 1) : item.hierarchy;
            };
            /**
             * 添加分析对象
             */
            that.$scope.addAnalysisObject = function () {
                var obj = {
                    contentType: that.$scope.createItem.contentType,
                    subType: that.$scope.createItem.subType,
                    value: that.$scope.createItem.value || null
                };
                if (typeof obj.contentType == 'undefined' || typeof  obj.subType == 'undefined' || obj.contentType == "" || obj.subType == "") {
                    return
                }
                that.$scope.updateItem.jsonParam.analysisObject.push(obj);
                that.$scope.createItem = {subType: 1};
            };
            /**
             * 执行上传
             */
            that.$scope.doUpload = function () {
                that.$scope.addAnalysisObject();
                var flag = that.checkType();
                if (flag) {
                    alert('数据设置有误，请检查');
                    return
                }
                that.$http({
                    url: that.routerUrl.saveSemanticAnalysisObject.url,
                    method: that.routerUrl.saveSemanticAnalysisObject.method,
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
            /**
             * 执行上传
             */
            that.$scope.deleteAnalysisObject = function (item) {
                var index = that.$scope.updateItem.jsonParam.analysisObject.indexOf(item);
                that.$scope.updateItem.jsonParam.analysisObject.splice(index, 1);
            }
        }
    };
    return semanticAnalysisObject;
});