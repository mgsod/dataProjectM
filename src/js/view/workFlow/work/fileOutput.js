/**
 * Created by Administrator on 2017/5/9.
 */
define('fileOutput', ['angular', 'jquery', 'regexp'], function (angular, $, regexp) {
    var fileOutput = {
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
        makeData: function () {
            var that = this;
            that.$scope.updateItem = {
                exportType: "excel",
                exportName: "",
                exportDataType: "",
                dataSourceType: "",
                dataSourceTypeField: "",
                analysisLevel: "",
                analysisObjectName: ""
            };
            if (that.action == 1) {
                that.$scope.updateItem = this.data;
            }
            that.$scope.updateItem.projectId = that.mapJson.projectId;
            that.$scope.updateItem.typeNo = that.mapJson.obj.typeNo;
            that.$scope.exportTypeList = [{id: "1", name: "原始"}, {id: "2", name: "语义数据"}, {id: "3", name: "原始+语义数据"}];
            that.$scope.sourceTypeList = [
                /* {
                 "reusltTypeId": 1,
                 "resultTypeName": "微信"
                 }, {
                 "reusltTypeId": 2,
                 "resultTypeName": "微博"
                 }*/
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
            that.$scope.analysisObjectNameList = [
                /*     {
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
            that.$scope.analysisLevelList = [
                /*    {
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
            that.getExportTypeList();
        },
        getExportTypeList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getExportDataTypeList.url + "?projectId=" + that.mapJson.projectId,
                method: that.routerUrl.getExportDataTypeList.method,
                // data: $.param({projectId: that.mapJson.projectId}),
                headers: that.HEADER.formHeader
            }).success(function (data) {
                that.$scope.updateItem.exportDataType = that.$scope.updateItem.exportDataType || data.data[0].id + '';
                that.getSourceTypeList();
            });
        },
        getSourceTypeList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getDataSourceTypeList.url,
                method: that.routerUrl.getDataSourceTypeList.method,
                data: $.param({projectId: that.mapJson.projectId}),
                headers: that.HEADER.formHeader
            }).success(function (data) {
                that.$scope.sourceTypeList = data.data.outDataSourceList;
                that.$scope.updateItem.dataSourceType = that.$scope.updateItem.dataSourceType || that.$scope.sourceTypeList[0].reusltTypeId + '';
                that.sourceTypeDetailList();
            });
        },
        sourceTypeDetailList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getDataTypeRelationList.url + '?' + $.param({
                    dataSourceTypeId: that.$scope.updateItem.dataSourceType,
                    exportDataTypeId: that.$scope.updateItem.exportDataType,
                    projectId: that.mapJson.projectId
                }),
                method: that.routerUrl.getDataTypeRelationList.method,
                /* data: $.param({
                 resultTypeId: that.$scope.updateItem.dataSourceType,
                 exportDataTypeId: that.$scope.updateItem.exportDataType
                 }),*/
                headers: that.HEADER.formHeader
            }).success(function (data) {
                that.$scope.fieldIdAndNameList = data.data.sourceFieldData;
                that.$scope.analysisObjectNameList = data.data.semanticAnalysisData;
                that.$scope.analysisLevelList = data.data.analysisOjectData;
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
            that.$scope.updateItem.dataSourceTypeField = "";
            that.$scope.updateItem.analysisLevel = "";
            that.$scope.updateItem.analysisObjectName = "";
            for (var i = 0; i < that.$scope.fieldIdAndNameList.length; i++) {
                var item = that.$scope.fieldIdAndNameList[i];
                if (i != that.$scope.fieldIdAndNameList.length - 1) {
                    that.$scope.updateItem.dataSourceTypeField += item.fieldId + ',';
                } else {
                    that.$scope.updateItem.dataSourceTypeField += item.fieldId;
                }
            }
            for (var j = 0; j < that.$scope.analysisObjectNameList.length; j++) {
                var jtem = that.$scope.analysisObjectNameList[j];
                if (j != that.$scope.analysisObjectNameList.length - 1) {
                    that.$scope.updateItem.analysisObjectName += jtem.fieldId + ',';
                } else {
                    that.$scope.updateItem.analysisObjectName += jtem.fieldId;
                }
            }
            for (var z = 0; z < that.$scope.analysisLevelList.length; z++) {
                var ztem = that.$scope.analysisLevelList[z];
                if (z != that.$scope.analysisLevelList.length - 1) {
                    that.$scope.updateItem.analysisLevel += ztem.fieldId + ',';
                } else {
                    that.$scope.updateItem.analysisLevel += ztem.fieldId;
                }
            }
        },
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
        viewFunction: function () {
            var that = this;
            that.$scope.cancel = function () {
                that.cancelFn();
            };
            that.$scope.doUpload = function () {
                if (that.$scope.updateItem.dataSourceTypeField + that.$scope.updateItem.analysisLevel + that.$scope.updateItem.analysisObjectName == '') {
                    alert('文件导出设置有误，请检查');
                    return
                }
                if (regexp.checkStr(that.$scope.updateItem.exportName)) {
                    alert('文件名错误!')
                }
                saveOutput();
            };
            var saveOutput = function () {
                that.$http({
                    url: that.routerUrl.saveExportConfig.url,
                    method: that.routerUrl.saveExportConfig.method,
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
            that.$scope.checkIsCheck = function (item, type) {
                var updateItem = that.$scope.updateItem;
                return updateItem[type].split(',').indexOf(item.fieldId + '') != -1;
            };
            /**
             * 选择checkbox
             * @param $event
             * @param item
             */
            that.$scope.updateCheckbox = function ($event, item, target) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? '1' : '0');
                var updateItem = that.$scope.updateItem;
                updateItem[target] = action == 1 ? updateItem[target] + "," + item.fieldId : updateItem[target].replace(item.fieldId, "");
                updateItem[target] = updateItem[target].replace(",,", ",");
                updateItem[target] = updateItem[target].substr(0, 1) == "," ?
                    updateItem[target].substr(1, updateItem[target].length) : updateItem[target];
                updateItem[target] = updateItem[target].substr(updateItem[target].length - 1, 1) == "," ?
                    updateItem[target].substr(0, updateItem[target].length - 1) : updateItem[target];
            };
            /**
             * 下载文件
             * @param address
             */
            that.$scope.doDownLoadFile = function (address) {
                var addressList = address.split(',');
                addressList.forEach(function (item) {
                    window.open(item, '_blank');
                })
            }
        }
    };
    return fileOutput
});