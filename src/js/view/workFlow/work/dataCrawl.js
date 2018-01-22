/**
 * Created by Administrator on 2017/6/29.
 */
define('dataCrawl', ['angular', 'jquery', 'regexp', 'paramterUtil', 'foundation-datepicker'], function (angular, $, regexp, paramterUtil) {
    var dataCrawl = {
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
            this.isTimeOk = true;
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
                taskName: "",
                datasourceId: "1",
                datasourceTypeId: "1",
                storageTypeTable: "1",
                inputParamArray: [],
                crawlFreqType: "1",
                quartzTime: "* * * * * *",
                crawlType: '',
                crawlWay: ''
            };
            that.resetCron();
            that.createCronList();
            that.$scope.action = that.action;
            if (that.action == 1) {
                that.$scope.updateItem = this.data;
            }
            that.translateCron(that.$scope.updateItem.quartzTime || "* * * * * *");
            that.$scope.dataSourceTypeList = [{
                datasourceId: "1",
                datasourceName: "微博",
                datasourceTypes: [{typeId: "1", typeName: "新浪微博", storageTypeTable: "weibo"}]
            }, {
                datasourceId: "2",
                datasourceName: "微信",
                datasourceTypes: [{typeId: "2", typeName: "朋友圈", storageTypeTable: "weibo"}]
            }
            ];
            //that.getDateSourceTypeList();
            /*    if (that.action == 0) {
             that.getElementList();
             }*/

            that.$scope.crawlWayList = [{'key': 'data', 'value': '数据抓取'}, {'key': 'process', 'value': '流程抓取'}]
            that.$scope.crawlTypeList = [{'key': 'mobileCrawl', 'value': '移动端抓取'}, {'key': 'pcCrawl', 'value': 'PC抓取'}];
            that.createDatePicker();
            that.getCrawlTypeList();
            that.getCrawlWayList();
            this.getProcessList();
        },
        /**
         * 翻译cron表达式
         * @param param
         */
        translateCron: function (param) {
            var that = this;
            var list = param.split(" ");
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (i == 0) {
                    //秒
                    that.$scope.secondValue = item == "?" ? "" : item + "";
                    if (item != '*') {
                        that.$scope.second = "2";
                    } else {
                        that.$scope.second = "1";
                    }
                } else if (i == 1) {
                    //分
                    that.$scope.minutesValue = item == "?" ? "" : item + "";
                    if (item != '*') {
                        that.$scope.minutes = "2";
                    } else {
                        that.$scope.minutes = "1";
                    }
                } else if (i == 2) {
                    //时
                    that.$scope.hourValue = item == "?" ? "" : item + "";
                    if (item != '*') {
                        that.$scope.hour = "2";
                    } else {
                        that.$scope.hour = "1";
                    }
                } else if (i == 3) {
                    //日
                    that.$scope.dayValue = item == "?" ? "" : item + "";
                    if (item != '*') {
                        that.$scope.day = "2";
                    } else {
                        that.$scope.day = "1";
                    }
                } else if (i == 4) {
                    //月
                    that.$scope.monthValue = item == "?" ? "" : item + "";
                    if (item != '*') {
                        that.$scope.month = "2";
                    } else {
                        that.$scope.month = "1";
                    }
                } else if (i == 5) {
                    //星期
                    that.$scope.weekValue = item == "?" ? "" : item + "";
                    if (item != '*') {
                        that.$scope.week = "2";
                    } else {
                        that.$scope.week = "1";
                    }
                }
            }
        },
        /**
         * 创建cronList
         */
        createCronList: function () {
            var that = this;
            that.$scope.secondList = that.createNumberList(60, 1);
            that.$scope.minutesList = that.createNumberList(60, 1);
            that.$scope.hourList = that.createNumberList(24, 1);
            that.$scope.dayList = that.createNumberList(31, 0);
            that.$scope.monthList = that.createNumberList(12, 0);
            that.$scope.weekList = that.createNumberList(7, 0);
        },
        /**
         * 重置Crom表达式
         */
        resetCron: function () {
            var that = this;
            that.$scope.second = "1";
            that.$scope.minutes = "1";
            that.$scope.hour = "1";
            that.$scope.day = "1";
            that.$scope.month = "1";
            that.$scope.week = "1";
            that.$scope.secondValue = "";
            that.$scope.minutesValue = "";
            that.$scope.hourValue = "";
            that.$scope.dayValue = "";
            that.$scope.monthValue = "";
            that.$scope.weekValue = "";
        },
        /**
         * 创建数字list
         * @param length
         * @param start
         * @returns {Array}
         */
        createNumberList: function (length, start) {
            var list = [];
            for (var i = 1 - start; i <= length - start; i++) {
                list.push(i + "")
            }
            return list;
        },
        /**
         * 获取typelist
         */
        getDateSourceTypeList: function (sourceType) {
            var that = this;
            /*paramterUtil.init(that.$http).getParamter('getDateSourceTypeList', function (data) {
                that.$scope.dataSourceTypeList = data.data;
                if (that.action == 0) {
                    that.$scope.updateItem.datasourceId = that.$scope.dataSourceTypeList[0].datasourceId + "";
                    that.$scope.updateItem.datasourceTypeId = that.$scope.dataSourceTypeList[0].datasourceTypes[0].typeId + "";
                    that.$scope.updateItem.storageTypeTable = that.$scope.dataSourceTypeList[0].datasourceTypes[0].storageTypeTable;
                    that.getElementList();
                }
            });*/
        },
        /**
         * 获取参数list
         */
        getElementList: function () {
            var that = this;
            if (that.$scope.updateItem.crawlWay != "process") {
                that.$scope.updateItem.storageTypeTable = that._getStorageTypeTable();
            }
            that.$http({
                url: that.routerUrl.getCrawlInputParamList.url + "?" + $.param({datasourceTypeId: that.$scope.updateItem.datasourceTypeId}),
                method: that.routerUrl.getCrawlInputParamList.method
            }).success(function (data) {
                data.data.forEach(function (item) {
                    if (item.styleCode == 'input_file') {
                        item.paramValue = {}
                    } else if (item.styleCode == 'doubleTime') {
                        item.paramValue = {}
                    }
                });
                that.$scope.updateItem.inputParamArray = data.data;
                that.createDatePicker();
            });
        },
        /**
         * 查table
         * @returns {string}
         * @private
         */
        _getStorageTypeTable: function () {
            var that = this;
            var storageTypeTable = "";
            var i = 0;
            while (1) {
                if (that.$scope.dataSourceTypeList[i].datasourceId == that.$scope.updateItem.datasourceId) {
                    var list = that.$scope.dataSourceTypeList[i].datasourceTypes;
                    var j = 0;
                    while (1) {
                        if (list[j].typeId == that.$scope.updateItem.datasourceTypeId) {
                            storageTypeTable = list[j].storageTypeTable;
                            break;
                        }
                        j++;
                    }
                    break;
                }
                i++;
            }
            ;
            return storageTypeTable;

        },
        /**
         * 查datasourcetypeid
         * @returns {string}
         * @private
         */
        _getdatasourcetypeId: function () {
            var that = this;
            var datasourcetypeid = "";
            var i = 0;
            while (1) {
                if (that.$scope.dataSourceTypeList[i].datasourceId == that.$scope.updateItem.datasourceId) {
                    datasourcetypeid = that.$scope.dataSourceTypeList[i].datasourceTypes[0].typeId;
                    break;
                }
                i++;
            }
            return datasourcetypeid + "";
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
         * 创建时间picker
         */
        createDatePicker: function () {
            var _this = this;
            var start, end;
            $('#col_part').on('input', '#step', function () {
                var value = $(this).val();
                if (value.length === 1) {
                    $(this).val(value.replace(/[^1-9]/g, ''));

                } else {
                    $(this).val(value.replace(/\D/g, ''));
                }
            });
            setTimeout(function () {

                $('.datetime').fdatepicker({
                        format: 'yyyy/mm/dd hh:ii',
                        pickTime: true
                    }
                );
                $('.start').fdatepicker({
                        format: 'yyyy/mm/dd hh:ii',
                        pickTime: true
                    }
                ).on('changeDate', function (ev) {
                    start = ev.date;
                    if (end) {
                        if (start.valueOf() > end.valueOf()) {
                            // $('.start').val('');
                            $('.timeError').removeClass('hide');
                            _this.isTimeOk = false;
                        } else {
                            $('.timeError').addClass('hide');
                            _this.isTimeOk = true;
                        }
                    }

                });
                $('.end').fdatepicker({
                        format: 'yyyy/mm/dd hh:ii',
                        pickTime: true
                    }
                ).on('changeDate', function (ev) {
                    end = ev.date;
                    if (start) {
                        $('.selectStart').add('hide');
                        if (start.valueOf() > end.valueOf()) {
                            //   $('.end').val('');
                            $('.timeError').removeClass('hide');
                            _this.isTimeOk = false;
                        } else {
                            $('.timeError').addClass('hide');
                            _this.isTimeOk = true;
                        }
                    } else {
                        $('.selectStart').removeClass('hide');
                        _this.isTimeOk = false;
                    }
                });

            }, 1000);
        },
        /**
         * 选择checkbox
         * @param action
         * @param str
         * @param item
         */
        checkItem: function (action, str, item) {
            var that = this;
            var list = that.$scope[str].split(",");
            if (action == 1) {
                list.push(item)
            } else {
                var index = list.indexOf(item);
                list.splice(index, 1);
            }
            that.$scope[str] = that.listToString(list);
        },
        /**
         * 设置cron到源数据
         */
        setQuartzTime: function () {
            var that = this;
            that.$scope.updateItem.quartzTime = (that.$scope.secondValue == "" ? "?" : that.$scope.secondValue) + " "
                + (that.$scope.minutesValue == "" ? "?" : that.$scope.minutesValue) + " "
                + (that.$scope.hourValue == "" ? "?" : that.$scope.hourValue) + " "
                + (that.$scope.dayValue == "" ? "?" : that.$scope.dayValue) + " "
                + (that.$scope.monthValue == "" ? "?" : that.$scope.monthValue) + " "
                + (that.$scope.weekValue == "" ? "?" : that.$scope.weekValue);
            console.log(that.$scope.updateItem.quartzTime)
        },
        /**
         * list变成String
         * @param list
         * @returns {string}
         */
        listToString: function (list) {
            var str = "";
            list = list.sort(function (a, b) {
                return a - b
            });
            for (var i = 0; i < list.length; i++) {
                if (list[i] != "") {
                    str += list[i] + ",";
                }
            }
            str = str.substr(0, str.length - 1);
            return str;
        },
        /**
         * 检查上传参数
         * @returns {boolean}
         */
        checkUpdateItem: function () {
            var that = this;
            that.$scope.taskNameError = "";
            var flag = false;
            var list = [];
            if (that.$scope.updateItem.taskName.trim() == "") {
                that.$scope.taskNameError = "不能为空";
                flag = true;
            }
            that.$scope.updateItem.inputParamArray.forEach(function (item) {
                if (item.isRequired == 1 && item.styleName != 'checkbox') {
                    if (item.paramValue == '') {
                        flag = true;
                    }
                }
                if (item.restrictions.trim() != "") {
                    var datetime = new Date().getTime();
                    var flag2 = false;
                    var str = "";
                    if (typeof item.paramValue.file == 'undefined') {
                        str = "var test" + datetime + "=" + item.restrictions + ";flag2=test" + datetime + "('" + item.paramValue + "');";
                    } else {
                        str = "var test" + datetime + "=" + item.restrictions + ";flag2=test" + datetime + "('" + item.paramValue.input + "');";
                    }
                    eval(str);
                    if (flag2) {
                        list.push(item.paramCnName);
                        flag = flag2;
                    }
                }
            });
            if (flag && list.length != "") {
                alert(that.listToString(list) + "  参数配置有错!");
            }
            return flag
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
                saveOutput();
            };
            window.doUploadFile = function (e) {
                var file = $(e)[0].files[0];
                var item = that.$scope.updateItem.inputParamArray[$(e).attr('ngmodel')];
                var formData = new FormData();
                formData.append("file", file);
                that.$http({
                    url: that.routerUrl.dataCrawlUploadFile.url,
                    method: that.routerUrl.dataCrawlUploadFile.method,
                    data: formData,
                    headers: that.HEADER.undefinedHeader
                }).success(function (data) {
                    item.paramValue = {};
                    item.paramValue.file = data.data.url;
                });
            };
            that.$scope.getDataSourceType = function () {
                that.$scope.updateItem.datasourceTypeId = that._getdatasourcetypeId();
                that.getElementList();
            };

            that.$scope.getDateSourceTypeList = function (sourceType) {
                that.$http({
                    url: that.routerUrl.getDateSourceTypeList.url + '?sourceType=' + sourceType,
                    method: that.routerUrl.getDateSourceTypeList.method
                }).success(function (data) {
                    that.$scope.dataSourceTypeList = data.data;
                    if (that.action == 0) {
                        that.$scope.updateItem.datasourceId = that.$scope.dataSourceTypeList[0].datasourceId + "";
                        that.$scope.updateItem.datasourceTypeId = that.$scope.dataSourceTypeList[0].datasourceTypes[0].typeId + "";
                        that.$scope.updateItem.storageTypeTable = that.$scope.dataSourceTypeList[0].datasourceTypes[0].storageTypeTable;
                        that.getElementList();
                    }

                });
            };
            that.$scope.doCheck = function ($event, item) {
                var checkbox = $event.target;
                item.paramValue = checkbox.checked;
            };
            that.$scope.getElementList = function () {
                that.getElementList();
            };
            that.$scope.checkNumbers = function ($event, str, item) {
                if ($event != 1) {
                    var checkbox = $event.target;
                    var action = (checkbox.checked ? '1' : '0');
                } else {
                    var list = that.$scope[str].split(",");
                    var action = list.indexOf(item) != -1 ? '0' : '1'
                }
                that.checkItem(action, str, item);
            };
            that.$scope.changeType = function (param, i) {
                that.$scope[param + "Value"] = i == '1' ? "*" : "";
                console.log(that.$scope[param + "Value"])
            };
            that.$scope.isCheck = function (str, item) {
                var list = str.split(',');
                var flag = list.indexOf(item) != -1 ? true : false;
                return flag;
            };

            this.$scope.selectCrawlWay = function () {
                var way = that.$scope.updateItem.crawlWay;
                if (way == 'process') {
                    that.$scope.selectProcess();
                } else {
                    if (that.action == 0) {
                        that.$scope.updateItem.datasourceTypeId = that.$scope.dataSourceTypeList[0].datasourceTypes[0].typeId + "";
                    }

                }

            }

            that.$scope.selectProcess = function () {
                var processId = that.$scope.updateItem.workFlowTemplateId;
                for (var i = 0; i < that.$scope.processList.length; i++) {
                    if (processId == that.$scope.processList[i].id) {
                        that.$scope.updateItem.datasourceTypeId = that.$scope.processList[i].datasourceTypeId;
                        that.getElementList();
                        break;
                    }
                }
            }

            var saveOutput = function () {
                if (that.checkUpdateItem()) {
                    return
                }
                if (!that.isTimeOk) return

                that.setQuartzTime();
                that.$http({
                    url: that.routerUrl.saveCrawlObject.url,
                    method: that.routerUrl.saveCrawlObject.method,
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


        },

        /**
         *获取抓取方式
         */
        getCrawlWayList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getCrawlWayList.url,
                method: that.routerUrl.getCrawlWayList.method
            }).success(function (data) {
                that.$scope.crawlWayList = data.data;
                if (that.action == 0) {
                    that.$scope.updateItem.crawlWay = data.data[0].key;
                }

            });
        },
        /**
         * 获取抓取类别
         */
        getCrawlTypeList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getCrawlTypeList.url,
                method: that.routerUrl.getCrawlTypeList.method
            }).success(function (data) {
                that.$scope.crawlTypeList = data.data;
                if (that.action == 0) {
                    that.$scope.updateItem.crawlType = data.data[0].key;
                    that.$scope.getDateSourceTypeList(data.data[0].key)
                }
                that.$scope.getDateSourceTypeList(that.$scope.updateItem.crawlType)
            });
        },
        getProcessList: function () {
            var that = this;
            that.$http({
                url: that.routerUrl.getProcess.url,
                method: that.routerUrl.getProcess.method
            }).success(function (data) {
                that.$scope.processList = data.data;
                if (that.action == 0) {
                    that.$scope.updateItem.workFlowTemplateId = data.data[0].id + '';
                }
            });
        }

    };
    return dataCrawl
});