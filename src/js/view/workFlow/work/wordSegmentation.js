/**
 * Created by Administrator on 2017/4/24.
 */
define('wordSegmentation', ['angular', 'jquery', 'paramterUtil', 'treemenu'], function (angular, $, paramterUtil) {
    var wordSegmentation = {
        /**
         * targetId, action,data, $scope, $http, $compile, mapJson, HEADER, routerUrl,callback
         * @param json
         */
        init: function (json) {
            this.id = json.targetId;
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
            that.$scope.isShow = false;
            that.makeData();
            that.getHtml();
            that.viewAction();
            /* setTimeout(function () {
             that.createTree();
             }, 100)*/
        },
        /*
         * 获取数据
         * */
        makeData: function () {
            var that = this;
            that.$scope.updateItem = {
                "paramId": "",
                "wordLibraryList": [
                    /*  {
                     "type": "0",
                     "name": "通用词库"
                     },
                     {
                     "type": "1",
                     "name": "看看"
                     }*/
                ],
                "actionType": "1"
            };
            that.$scope.wordList = [
                /*   {
                 "type": 0,
                 "name": "通用词库"
                 },
                 {
                 "type": 1,
                 "name": "项目1"
                 }, {
                 "type": 1,
                 "name": "项目2"
                 }, {
                 "type": 1,
                 "name": "项目3"
                 }, {
                 "type": 1,
                 "name": "看看"
                 }*/
            ];
            that.getParameter();
            that.getItem();
        },
        copyWordList: [],
        /**
         * 获取参数
         */
        getParameter: function () {
            var that = this;
            paramterUtil.init(that.$http).getParamter("wordLibraryList", function (data) {
                that.$scope.wordList = data.data;
            });
        },
        getItem: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getWordSegmentationObject.url + "?projectId=" + that.mapJson.projectId + "&typeNo=" + that.mapJson.obj.typeNo,
                method: that.routerUrl.getWordSegmentationObject.method,
                //    data: $.param({projectId: that.mapJson.projectId, typeNo: that.mapJson.obj.typeNo}),
                headers: that.HEADER.formHeader
            }).success(function (data) {
                that.$scope.updateItem = data.data;
                data.data.wordLibraryList.forEach(function (item) {
                    that.copyWordList.push(item.name);
                });
            });
        },
        /**
         * 创建树
         */
        createTree: function () {
            $(".tree").treemenu({delay: 300}).openActive();
        },
        /**
         * 获取页面
         */
        getHtml: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.wordSegmentation.url,
                method: that.routerUrl.wordSegmentation.method
            }).success(function (data) {
                /**
                 * 把普通dom转换为ng 的 dom
                 */
                var template = angular.element(data);
                var mobileDialogElement = that.$compile(template)(that.$scope);
                $(that.id).html(mobileDialogElement);
            })
        },
        isOk: function () {
            var that = this;
            if (that.$scope.updateItem.wordLibraryList.length < 1) {
                return true
            }
            return that.$scope.isShow;
        },
        times: 0,
        /**
         * 页面action
         */
        viewAction: function () {
            var that = this;
            that.$scope.cancel = function () {
                that.cancelFn();
            };
            that.$scope.getCk = function () {
                $('#treeBox').show();
                that.$scope.isShow = true;
                if (that.times == 0) {
                    that.createTree();
                    that.times++;
                }
            };
            /**
             * 执行上传
             */
            that.$scope.doUpload = function () {
                if (that.$scope.updateItem.wordLibraryList.length < 1) {
                    alert('请选择词库');
                    return
                }
                that.$http({
                    url: that.routerUrl.uploadWordSegmentationObject.url,
                    method: that.routerUrl.uploadWordSegmentationObject.method,
                    data: $.param({
                        projectId: that.mapJson.projectId,
                        jsonParam: JSON.stringify(that.$scope.updateItem),
                        typeNo: that.mapJson.obj.typeNo
                    }),
                    headers: that.HEADER.formHeader
                }).success(function (data) {
                    $('#treeBox').hide();
                    that.$scope.isShow = false;
                    that.fn(data);
                });
            };
            /**
             * 选择
             */
            that.$scope.chooseItem = function (item) {
                that.$scope.updateItem.wordLibraryList = that.$scope.updateItem.wordLibraryList == null ? [] : that.$scope.updateItem.wordLibraryList;
                var index = that.copyWordList.indexOf(item.name);
                if (index != -1) {
                    that.copyWordList.splice(index, 1);
                    var i = 0;
                    while (1) {
                        if (that.$scope.updateItem.wordLibraryList[i].name == item.name) {
                            that.$scope.updateItem.wordLibraryList.splice(i, 1);
                            break
                        }
                        i++;
                    }
                } else {
                    that.$scope.updateItem.wordLibraryList.push(item);
                    that.copyWordList.push(item.name);
                }
            };
            that.$scope.checkSelect = function (item) {
                var index = that.copyWordList.indexOf(item.name);
                if (index != -1) {
                    return true
                } else {
                    return false
                }
            }
        }
    };
    return wordSegmentation;
});