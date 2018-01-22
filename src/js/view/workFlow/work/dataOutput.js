/**
 * Created by Administrator on 2017/4/24.
 */
define('dataOutput', ['angular', 'jquery', 'regexp'], function (angular, $, regexp) {
    var dataOutput = {
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
            this.first = 1
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
                apiType: "json",
                type: "",
                name: "",
                typeName: "",
                mapRelationValue: "",
                mapRelationValueName: ""
            };
            if (that.action == 1) {
                that.$scope.updateItem = this.data;
            }
            that.$scope.updateItem.projectId = that.mapJson.projectId;
            that.$scope.updateItem.typeNo = that.mapJson.obj.typeNo;
            that.$scope.sourceTypeList = [
                /*  {
                 "reusltTypeId": 1,
                 "resultTypeName": "微信"
                 }, {
                 "reusltTypeId": 2,
                 "resultTypeName": "微博"
                 }*/
            ];
            that.$scope.sourceTypeDetailList = [
                /*{fieldName: 'id', fieldDesc: '编号'},
                 {fieldName: 'type', fieldDesc: '数据类型'},
                 {fieldName: 'size', fieldDesc: '每页显示多少条'},
                 {fieldName: 'page', fieldDesc: '页码'},
                 {fieldName: 'demo', fieldDesc: 'http://123'}*/
            ];
            that.$scope.fieldIdAndNameList = [
                /* {
                 fieldId: '1',
                 fieldName: '用户名'
                 }, {
                 fieldId: '2',
                 fieldName: '密码'
                 }, {
                 fieldId: '3',
                 fieldName: '介绍'
                 }, {
                 fieldId: '4',
                 fieldName: '介绍2'
                 }, {
                 fieldId: '5',
                 fieldName: '介绍3'
                 }*/
            ];
            that.getSourceTypeList();
        },
        /**
         * 获取typelist
         */
        getSourceTypeList: function () {
            var that = this;
            /* new paramterUtil(that.$http).getParamter("", function (data) {
             that.$scope.paramterList = data.data.list;
             });*/
            that.$http({
                url: that.routerUrl.getOutDataSource.url,
                method: that.routerUrl.getOutDataSource.method,
                data: $.param({projectId: that.mapJson.projectId}),
                headers: that.HEADER.formHeader
            }).success(function (data) {
                that.$scope.sourceTypeList = data.data.outDataSourceList;
                that.$scope.updateItem.type = that.$scope.updateItem.type || that.$scope.sourceTypeList[0].reusltTypeId + '';
                that.$scope.updateItem.typeName = that.$scope.updateItem.typeName || that.$scope.sourceTypeList[0].resultTypeName;
                that.sourceTypeDetailList();
            })
        },
        /**
         * 获取sourcetypeList
         */
        sourceTypeDetailList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getOutDataSourceDetail.url,
                method: that.routerUrl.getOutDataSourceDetail.method,
                data: $.param({resultTypeId: that.$scope.updateItem.type,projectId:that.mapJson.projectId}),
                headers: that.HEADER.formHeader
            }).success(function (data) {
                that.$scope.sourceTypeDetailList = data.data.outDataSourceDemoParamterList;
                that.$scope.fieldIdAndNameList = data.data.outDataSourceDetailBoList;
                if (that.action == 0) {
                    that.checkAll();
                } else if (that.action == 1 && that.first != 1) {
                    that.checkAll();
                }
                that.first++;
            })
        },
        checkAll: function () {
            var that = this;
            that.$scope.updateItem.mapRelationValue = "";
            that.$scope.updateItem.mapRelationValueName = "";
            that.$scope.fieldIdAndNameList.forEach(function (item) {
                that.$scope.updateItem.mapRelationValue += item.fieldId + ",";
                that.$scope.updateItem.mapRelationValueName += item.fieldName + ",";
            });
            that.$scope.updateItem.mapRelationValue = that.$scope.updateItem.mapRelationValue.substr(0, that.$scope.updateItem.mapRelationValue.length - 1);
            that.$scope.updateItem.mapRelationValueName = that.$scope.updateItem.mapRelationValueName.substr(0, that.$scope.updateItem.mapRelationValueName.length - 1);
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
            that.$scope.cancel = function () {
                that.cancelFn();
            };
            that.$scope.doUpload = function () {
                if (that.$scope.updateItem.mapRelationValue == "" || that.$scope.updateItem.name == "") {
                    alert('请设置完整信息');
                    return false
                }
                if (regexp.checkStr(that.$scope.updateItem.name)) {
                    alert('项目名不能使用特殊符号');
                    return false;
                }
                saveOutput();
            };
            var saveOutput = function () {
                that.$http({
                    url: that.routerUrl.saveOutput.url,
                    method: that.routerUrl.saveOutput.method,
                    data: $.param(that.$scope.updateItem),
                    headers: that.HEADER.formHeader
                }).success(function (data) {
                    that.fn(data);
                });
            };
            /**
             * 查询
             */
            that.$scope.doSelectType = function () {
                that.sourceTypeDetailList();
            };
            /**
             * 选择checkbox
             * @param $event
             * @param item
             */
            that.$scope.updateCheckbox = function ($event, item) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? '1' : '0');
                var updateItem = that.$scope.updateItem;
                updateItem.mapRelationValue = action == 1 ? updateItem.mapRelationValue + "," + item.fieldId : updateItem.mapRelationValue.replace(item.fieldId, "");
                updateItem.mapRelationValue = updateItem.mapRelationValue.replace(",,", ",");
                updateItem.mapRelationValue = updateItem.mapRelationValue.substr(0, 1) == "," ?
                    updateItem.mapRelationValue.substr(1, updateItem.mapRelationValue.length) : updateItem.mapRelationValue;
                updateItem.mapRelationValue = updateItem.mapRelationValue.substr(updateItem.mapRelationValue.length - 1, 1) == "," ?
                    updateItem.mapRelationValue.substr(0, updateItem.mapRelationValue.length - 1) : updateItem.mapRelationValue;
                updateItem.mapRelationValueName = action == 1 ? updateItem.mapRelationValueName + "," + item.fieldName : updateItem.mapRelationValueName.replace(item.fieldName, "");
                updateItem.mapRelationValueName = updateItem.mapRelationValueName.replace(",,", ",");
                updateItem.mapRelationValueName = updateItem.mapRelationValueName.substr(0, 1) == "," ?
                    updateItem.mapRelationValueName.substr(1, updateItem.mapRelationValueName.length) : updateItem.mapRelationValueName;
                updateItem.mapRelationValueName = updateItem.mapRelationValueName.substr(updateItem.mapRelationValueName.length - 1, 1) == "," ?
                    updateItem.mapRelationValueName.substr(0, updateItem.mapRelationValueName.length - 1) : updateItem.mapRelationValueName;
            };
        }
    };
    return dataOutput
});