/**
 * Created by Administrator on 2017/4/24.
 */
define('topicAnalysisDefinition', ['angular', 'jquery', 'paramterUtil', 'regexp', 'bootstrap'], function (angular, $, paramterUtil, regexp) {
    var topicAnalysisDefinition = {
        /**
         * targetId, action,data, $scope, $http, $compile, mapJson, HEADER, routerUrl,callback
         * @param json
         */
        init: function (json) {
            this.id = json.targetId;
            this.action = json.action;
            this.data = json.data;
            this.themeList = json.themeList;
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
            that.makeData();
            that.getHtml();
            that.viewAction();
        },
        /*
         *
         * */
        makeData: function () {
            var that = this;
            that.$scope.updateItem = {
                "resultName": "",
                "hotspotsLevel": "1",
                "resultsStrategyType": "1",
                "scoringWay": "1",
                "scoringWayName": "",
                "startFreqType": 1,//（1为不循环，2为每日，3为每周，4为每月）,
                "startFreqTypeName": "",
                "definitionName": "",
                "handleHour": "24",
                "startFreqValue": "1",
                subjectAresList: [],
                "relationship": "1"
            };
            if (that.action == 1) {
                that.$scope.updateItem = that.data;
            }
            that.$scope.hourList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
            that.$scope.wakeList = ["1", "2", "3", "4", "5", "6", "7"];
            that.$scope.themeList = that.$scope.themeList || {
                /*   "ares": [
                 {
                 "id": 12,
                 "name": "动力",
                 "pid": 0,
                 "isLastChildren": 0
                 },
                 {
                 "id": 10,
                 "name": "用车",
                 "pid": 0,
                 "isLastChildren": 0
                 }
                 ],
                 "subject": [
                 {
                 "id": 53,
                 "name": "发动机",
                 "pid": 12,
                 "isLastChildren": 0
                 },
                 {
                 "id": 54,
                 "name": "马力",
                 "pid": 12,
                 "isLastChildren": 0
                 },
                 {
                 "id": 55,
                 "name": "启动",
                 "pid": 12,
                 "isLastChildren": 0
                 },
                 {
                 "id": 56,
                 "name": "传动",
                 "pid": 12,
                 "isLastChildren": 0
                 },
                 {
                 "id": 44,
                 "name": "登记",
                 "pid": 10,
                 "isLastChildren": 0
                 },
                 {
                 "id": 45,
                 "name": "违章",
                 "pid": 10,
                 "isLastChildren": 0
                 },
                 {
                 "id": 46,
                 "name": "学车",
                 "pid": 10,
                 "isLastChildren": 0
                 },
                 {
                 "id": 47,
                 "name": "开车",
                 "pid": 10,
                 "isLastChildren": 0
                 },
                 {
                 "id": 48,
                 "name": "租车",
                 "pid": 10,
                 "isLastChildren": 0
                 }
                 ]*/
            };
            that.$scope.topicList = [
                {
                    "projectName": "话题项目一",
                    "topicList": [
                        {
                            "name": "话题一"
                        },
                        {
                            "name": "话题2"
                        },
                        {
                            "name": "话题3"
                        }
                    ]
                },
                {
                    "projectName": "话题项目gg",
                    "topicList": [
                        {
                            "name": "ggg"
                        },
                        {
                            "name": "g"
                        },
                        {
                            "name": "gg"
                        }
                    ]
                }
            ]
            //   console.log(that.$scope.updateItem, that.$scope.themeList.subject);
            //    that.getParameter();
            that.getTopic()
        },
        getThemeList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getSubjectAresList.url + "?projectId=" + that.mapJson.projectId + "&typeNo=" + that.mapJson.obj.typeNo,
                method: that.routerUrl.getSubjectAresList.method,
                headers: that.HEADER.formHeader
            }).success(function (data) {
                that.$scope.themeList = data.data;
            });
        },
        /**
         * 获取参数
         */
        getParameter: function () {
            var that = this;
            paramterUtil.init(that.$http).getParamter("subjectAresList", function (data) {
                that.$scope.themeList = data.data.list;
            });
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

        getTopic: function () {
            var that = this;
            $.get('/hotspotsSet/getTopicList.json', function (data) {
                if (data.code === 0) {
                    var list = data.data;
                    that.$scope.topicList = list;
                    that.$scope.$apply();
                }

            }, 'json')
        },
        /**
         * 页面action
         */
        viewAction: function () {


            var that = this;
            that.$scope.toggleClose = function (item) {
                item.close = !item.close;
            }
            that.$scope.checkedTopic = function (list) {
                var selected = [];
                if(that.$scope.updateItem.topicList){
                    that.$scope.updateItem.topicList.map(function (item) {
                        item.topicList.map(function (i) {
                            selected.push(i.name)
                        })
                    })
                    if (selected.indexOf(list.name) > -1) {
                        return true
                    }

                }

                return false;



            }

            that.$scope.getAllChecked = function () {
                var selected = {};
                $('.panel-body input[type=checkbox]:checked').each(function (n, v) {
                    var projectName = $(this).parent().attr('data-name');
                    selected[projectName] = selected[projectName] || [];
                    selected[projectName].push(
                        {
                            name:$(v).val(),
                            text:$(v).attr('data-text')
                        });
                })
                var temp = []
                for(var i in selected){
                    temp.push({
                        projectName:i,
                        topicList:selected[i]
                    })
                }
                that.$scope.updateItem.topicList = temp;

            }


            that.$scope.cancel = function () {
                that.cancelFn();
            };
            /**
             * 选中
             * @param item
             * @param type
             */
            that.$scope.chooseThis = function (item, type) {
                if (type == that.$scope.updateItem.startFreqType) {
                    if (that.$scope.updateItem.startFreqValue.split(',').indexOf(item) == -1) {
                        that.$scope.updateItem.startFreqValue += ',' + item
                    } else {
                        that.$scope.updateItem.startFreqValue = that.$scope.updateItem.startFreqValue.replace(item, "");
                    }
                    that.$scope.updateItem.startFreqValue = that.$scope.updateItem.startFreqValue.replace(",,", ",");
                    that.$scope.updateItem.startFreqValue = that.$scope.updateItem.startFreqValue.substr(0, 1) == ',' ? that.$scope.updateItem.startFreqValue.substr(1, that.$scope.updateItem.startFreqValue.length - 1) : that.$scope.updateItem.startFreqValue;
                    that.$scope.updateItem.startFreqValue = that.$scope.updateItem.startFreqValue.substr(that.$scope.updateItem.startFreqValue.length - 1, 1) == ',' ? that.$scope.updateItem.startFreqValue.substr(0, that.$scope.updateItem.startFreqValue.length - 1) : that.$scope.updateItem.startFreqValue;
                }
            };
            /**
             * 选中theme
             * @param p
             * @param s
             */
            that.$scope.chooseTheme = function (p, s) {
                if (p.subjectIds.split(',').indexOf(s.id + '') == -1) {
                    p.subjectIds += ',' + s.id;
                } else {
                    p.subjectIds = p.subjectIds.replace(s.id, "");
                }
                p.subjectIds = p.subjectIds.replace(",,", ",");
                p.subjectIds = p.subjectIds.substr(0, 1) == ',' ? p.subjectIds.substr(1, p.subjectIds.length - 1) : p.subjectIds;
                p.subjectIds = p.subjectIds.substr(p.subjectIds.length - 1, 1) == ',' ? p.subjectIds.substr(0, p.subjectIds.length - 1) : p.subjectIds;
            };
            that.$scope.chooseAll = function (p) {
                var str = "";
                that.$scope.themeList.subject.forEach(function (item) {
                    if (item.pid == p.aresId) {
                        str += item.id + ","
                    }
                });
                str = str.substr(0, str.length - 1);
                p.subjectIds = str;
            };
            /**
             * 删除
             */
            that.$scope.doDelete = function (item) {
                var index = that.$scope.updateItem.subjectAresList.indexOf(item);
                that.$scope.updateItem.subjectAresList.splice(index, 1);
            };

            /**
             * 新增
             */
            that.$scope.doAdd = function () {
                that.$scope.updateItem.subjectAresList.push({
                    aresId: that.$scope.themeList.ares[0].id + '',
                    subjectIds: ""
                })
            };
            /**
             * 检查num
             */
            that.$scope.checkNum = function () {
                var value = that.$scope.updateItem.startFreqValue;
                if (typeof value == 'undefined') {
                    alert('由于你输入了无效的日期，所以重置了日期');
                    that.$scope.updateItem.startFreqValue = 15;
                }
                that.$scope.updateItem.startFreqValue = Math.round(that.$scope.updateItem.startFreqValue);
            };
            that.$scope.resetValue = function () {
                that.$scope.updateItem.startFreqValue = "";
            };
            /**
             * 执行上传
             */
            that.$scope.doUpload = function () {
                var flag = checkData();
                if (flag) {
                    doUploadData();
                } else {
                    alert('信息设置有误 请检查');
                }
            };
            /**
             * 检查数据
             * @returns {boolean}
             */
            var checkData = function () {
                if(that.$scope.updateItem.analysisObject == 'all'){
                    if (that.$scope.updateItem.resultName.trim() == '' || regexp.checkStr(that.$scope.updateItem.resultName.trim())) {
                        return false
                    }else{
                        return true
                    }
                }else{
                    if (that.$scope.updateItem.resultName.trim() == '' || regexp.checkStr(that.$scope.updateItem.resultName.trim())) {
                        return false
                    }
                    if (that.$scope.updateItem.subjectAresList.length == 0) {
                        return false
                    }
                    if (that.$scope.updateItem.subjectAresList[0].subjectIds == "") {
                        return false
                    }
                    if (that.$scope.updateItem.startFreqValue == "" && that.$scope.updateItem.startFreqType != 1) {
                        return false
                    }
                    var flag = true;
                    var list = [];
                    that.$scope.updateItem.subjectAresList.forEach(function (item) {
                        if (list.indexOf(item.aresId) != -1) {
                            flag = false
                        }
                        list.push(item.aresId);
                    });
                    return flag;
                }



            };
            var doUploadData = function () {
                that.$http({
                    url: that.routerUrl.saveTopicAnalysisDefinition.url,
                    method: that.routerUrl.saveTopicAnalysisDefinition.method,
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
    return topicAnalysisDefinition;
});