/**
 * Created by Administrator on 2017/4/24.
 */
define('themeAnalysisSetting', ['angular', 'jquery', 'paramterUtil'], function (angular, $, paramterUtil) {
    var themeAnalysisSetting = {
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
            //   this.viewAction();
        },
        /**
         * 加载功能模块
         */
        importFunction: function () {
            var that = this;
            that.makeData(function () {
                that.getHtml()
            });
            that.viewAction();
        },
        /**
         * 创建树
         */
        createTree: function () {
            $(".tree").treemenu({delay: 300}).openActive();

        },
        /*
         *
         * */
        makeData: function (fn) {
            var that = this;
            that.$scope.updateItem = {
                subjectAresId: "",
                subjectAresName: "",
                subjectIds: "",
                subjectNames: "",
                resultsStrategyType: "1",
                resultsStrategyTypeName: "",
                resultsStrategyTypeValue: ""
            };
            if (that.action == 1) {
                that.$scope.updateItem = that.data;
            }
            that.$scope.themeList = [
                /* {
                 "id": 1,
                 "name": "第一",
                 "pid": 0,
                 "isLastChildren": 0
                 },
                 {
                 "id": 2,
                 "name": "第一  1",
                 "pid": 1,
                 "isLastChildren": 1
                 },
                 {
                 "id": 3,
                 "name": "第一  2",
                 "pid": 1,
                 "isLastChildren": 1
                 },
                 {
                 "id": 4,
                 "name": "第一  3",
                 "pid": 1,
                 "isLastChildren": 1
                 }, {
                 "id": 5,
                 "name": "第二",
                 "pid": 0,
                 "isLastChildren": 0
                 },
                 {
                 "id": 6,
                 "name": "第二  1",
                 "pid": 5,
                 "isLastChildren": 0
                 },
                 {
                 "id": 7,
                 "name": "第二  2",
                 "pid": 5,
                 "isLastChildren": 1
                 },
                 {
                 "id": 8,
                 "name": "第二  1-1",
                 "pid": 6,
                 "isLastChildren": 1
                 }*/
            ];


            that.getParameter(fn);


        },
        /**
         * 获取参数
         */
        getParameter: function (fn, callback) {
            var that = this;
            paramterUtil.init(that.$http).getParamter("subjectAresList", function (data) {
                that.$scope.themeList = data.data;
                fn();

            });
        },
        /**
         *
         */
        createDom: function () {
            var that = this;
            var list = [];
            that.$scope.themeList.forEach(function (item) {
                list.push(that.createLi(item));
            });
            var dom = that.reloadDom(list);
            var template = angular.element(dom);
            var module = that.$compile(template)(that.$scope);
            $('#treeBox').html(module);
        },
        createLi: function (data) {
            var dom = document.createElement('li');
            $(dom).attr('class', 'son' + data.id);
            if (data.isLastChildren == 0) {
                var span = document.createElement('span');
                $(span).attr('ng-click', 'chooseThis(' + JSON.stringify(data) + ')');
                $(span).html(data.name);
                $(dom).append(span);
                var ul = document.createElement('ul');
                $(ul).attr('id', 'tree' + data.id);
                $(dom).append(ul);
                //   dom += "<span  ng-click='chooseThis(" + JSON.stringify(data) + ")'>" + data.name + "</span>";
                //   dom += "<ul id='tree" + data.id + "'></ul>"
            } else {
                var a = document.createElement('a');
                a.innerHTML = data.name;
                $(dom).append(a);
                // dom += "<a>" + data.name + "</a>"
            }
            //  dom += "</li>";
            return {id: data.id, pid: data.pid, dom: dom};
        },
        reloadDom: function (list) {
            var dom = document.createElement('ul');
            $(dom).addClass('tree');
            list.forEach(function (item) {
                $(dom).append(item.dom);
            });
            console.log(dom);
            list.forEach(function (item) {
                if (item.pid != 0) {
                    $(dom).find('#tree' + item.pid).append($(dom).find('.son' + item.id));
                }
            });
            return dom;
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
                that.createDom();
                that.createTree();

                //2017/12/19 维护. 修改树结构 参数配置详见 jq.zTree
                var treeSetting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pid",
                            rootPId: null
                        }
                    },
                    callback: {
                        onClick: function (e, id, node) {
                            if (node.projectPO) {
                                that.$scope.updateItem.subjectAresId = node.id;
                                that.$scope.updateItem.subjectAresName = node.name;
                                //更新ng-model
                                that.$scope.$apply();
                                $.get('/subjectSet/getSubjectByTypeId.json?typeSpId=' + node.id, function (data) {
                                    if (data.code == 0) {
                                        var list = data.data;
                                        var ids = [], names = [];
                                        list.forEach(function (item) {
                                            ids.push(item.id);
                                            names.push(item.name);
                                        })
                                        that.$scope.updateItem.subjectIds = ids.join(',');
                                        that.$scope.updateItem.subjectNames = names.join(',')
                                        that.$scope.$apply();
                                    }
                                }, 'json')
                            }

                        }
                    },
                    view: {
                        fontCss: function (treeId, treeNode) {
                            return treeNode.projectPO !== null ? {color: "red"} : {}
                        }
                    }
                };
                $.fn.zTree.init($("#tree"), treeSetting, that.$scope.themeList);
                //2017/12/19 维护. 修改树结构 参数配置详见 jq.zTree
            })
        },
        getTheme: function (id) {
            var that = this;
            var ids = "";
            var names = "";
            that.$scope.themeList.forEach(function (item) {
                if (item.pid == id) {
                    ids += item.id + ",";
                    names += item.name + ",";
                }
            });
            ids = ids.substr(0, ids.length - 1);
            names = names.substr(0, names.length - 1);
            return {ids: ids, names: names}
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
             * 选择主题域
             * @param data
             */
            that.$scope.chooseThis = function (data) {
                that.$scope.updateItem.subjectAresId = data.id;
                that.$scope.updateItem.subjectAresName = data.name;
                var obj = that.getTheme(data.id);
                that.$scope.updateItem.subjectIds = obj.ids;
                that.$scope.updateItem.subjectNames = obj.names;
            };
            /**
             * 执行上传
             */
            that.$scope.doUpload = function () {
                if (that.$scope.updateItem.subjectAresId == "") {
                    alert("请选择主题域");
                    return
                }
                if (that.$scope.updateItem.resultsStrategyType == 2) {
                    if (that.$scope.updateItem.resultsStrategyTypeValue < 1) {
                        alert("值需要大于0");
                        return
                    }
                } else if (that.$scope.updateItem.resultsStrategyType == 3 || that.$scope.updateItem.resultsStrategyType == 4) {
                    if (that.$scope.updateItem.resultsStrategyTypeValue > 100 || that.$scope.updateItem.resultsStrategyTypeValue < 1) {
                        alert("值只能为(0,100]");
                        return
                    }
                }
                doUploadData();
            };
            var doUploadData = function () {
                that.$http({
                    url: that.routerUrl.saveThemeAnalysisSetting.url,
                    method: that.routerUrl.saveThemeAnalysisSetting.method,
                    data: $.param({
                        projectId: that.mapJson.projectId,
                        typeNo: that.mapJson.obj.typeNo,
                        jsonParam: JSON.stringify(that.$scope.updateItem)
                    }),
                    headers: that.HEADER.formHeader
                }).success(function (data) {
                    that.fn(data);
                });
            }
        }
    };
    return themeAnalysisSetting;
});