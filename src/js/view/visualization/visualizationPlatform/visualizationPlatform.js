/**
 * Created by Administrator on 2017/8/16.
 */
(function ($) {
    /**
     * get请求
     * @param url
     * @param data
     * @param fn
     */
    var httpGet = function (url, data, fn) {
        $.ajax({
            url: url,
            data: data,
            type: 'get',
            success: function (data) {
                fn(data)
            }
        })
    };
    /**
     * post请求
     * @param url
     * @param data
     * @param fn
     */
    var httpPost = function (url, data, fn) {
        $.ajax({
            url: url,
            data: data,
            type: 'post',
            success: function (data) {
                fn(data)
            }
        })
    };
    /**
     * 流上传
     * @param url
     * @param formData
     * @param fn
     */
    var httpFile = function (url, formData, fn) {
        $.ajax({
            url: url,
            data: formData,
            type: 'post',
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
                fn(data)
            }
        })
    };
    var mapJson = JSON.parse($('#mapJson').val());
    var imgBaseUrl = "../../../images/chart/";
    var defaultData = JSON.stringify({
        defaultData: [
            {
                visChartId: 1,
                defaultDataArray: {
                    title: {
                        show: true
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {
                                title: "保存",
                                show: true
                            }
                        }
                    },
                    legend: {
                        data: ["36氪", "网易汽车"]
                    },
                    grid: {
                        y: 65
                    },
                    axisPointer: {
                        show: true
                    },
                    tooltip: {
                        show: true
                    },
                    xAxis: [{
                        type: "category",
                        boundaryGap: false,
                        data: ["2017/6/21", "2017/6/21"]
                    }],
                    yAxis: [{
                        type: "value"
                    }],
                    series: [
                        {
                            name: "36氪",
                            type: "line",
                            stack: "网站",
                            data: [120, 132]
                        },
                        {
                            name: "网易汽车",
                            type: "line",
                            stack: "网站",
                            data: [85, 456]
                        }
                    ]
                },
                defaultTableArray: [
                    [
                        "日期",
                        "网站",
                        "url"
                    ],
                    [
                        "2017/6/21",
                        "36氪",
                        "120"
                    ],
                    [
                        "2017/6/21",
                        "网易汽车",
                        "85"
                    ],
                    [
                        "2017/6/22",
                        "36氪",
                        "132"
                    ],
                    [
                        "2017/6/22",
                        "网易汽车",
                        "456"
                    ]
                ],
                inputFieldArray: [
                    {
                        "field": "xAxis",
                        "fieldName": "X轴"
                    },
                    {
                        "field": "yAxis",
                        "fieldName": "y轴"
                    },
                    {
                        "field": "k",
                        "fieldName": "图例"
                    }
                ]
            },
            {
                visChartId: 3,
                defaultDataArray: {
                    title: {
                        show: true
                    },
                    legend: {
                        data: ["36氪", "网易汽车"]
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {
                                title: "保存",
                                show: true
                            }
                        }
                    },
                    axisPointer: {
                        show: true
                    },
                    tooltip: {
                        show: true
                    },
                    xAxis: [{
                        type: "category",
                        axisLine: {
                            onZero: false
                        },
                        data: ["2017/6/21", "2017/6/21"]
                    }],
                    yAxis: [{
                        type: "value"
                    }],
                    series: [
                        {
                            name: "36氪",
                            type: "bar",
                            data: [120, 132]
                        },
                        {
                            name: "网易汽车",
                            type: "bar",
                            data: [85, 456]
                        }
                    ]
                },
                defaultTableArray: [
                    [
                        "日期",
                        "网站",
                        "url"
                    ],
                    [
                        "2017/6/21",
                        "36氪",
                        "120"
                    ],
                    [
                        "2017/6/21",
                        "网易汽车",
                        "85"
                    ],
                    [
                        "2017/6/22",
                        "36氪",
                        "132"
                    ],
                    [
                        "2017/6/22",
                        "网易汽车",
                        "456"
                    ]
                ],
                inputFieldArray: [
                    {
                        "field": "xAxis",
                        "fieldName": "X轴"
                    },
                    {
                        "field": "yAxis",
                        "fieldName": "y轴"
                    },
                    {
                        "field": "k",
                        "fieldName": "图例"
                    }
                ]
            }, {
                visChartId: 5,
                defaultDataArray: {
                    title: {
                        show: true
                    },
                    legend: {
                        data: ["36氪", "网易汽车"]
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {
                                title: "保存",
                                show: true
                            }
                        }
                    },
                    axisPointer: {
                        show: true
                    },
                    tooltip: {
                        show: true
                    },
                    series: [
                        {
                            name: "网站",
                            type: "pie",
                            data: [
                                {
                                    value: 335,
                                    name: "36氪"
                                },
                                {
                                    value: 310,
                                    name: "网易汽车"
                                }
                            ]
                        }
                    ]
                },
                defaultTableArray: [
                    [
                        "日期",
                        "网站",
                        "url"
                    ],
                    [
                        "2017/6/21",
                        "36氪",
                        "5"
                    ],
                    [
                        "2017/6/21",
                        "网易汽车",
                        "6"
                    ]
                ],
                inputFieldArray: [
                    {
                        "field": "xAxis",
                        "fieldName": "X轴"
                    },
                    {
                        "field": "yAxis",
                        "fieldName": "y轴"
                    },
                    {
                        "field": "k",
                        "fieldName": "图例"
                    }
                ]
            }, {
                visChartId: 6,
                defaultDataArray: "是打发的说",
                defaultTableArray: "是打发的说"
            }
        ],
        statisticsData: [
            {
                "dataResult": "统计数据",
                "itemList": [
                    {
                        "paramId": "1",
                        "name": "统计报告1",
                        "fieldList": [
                            {
                                "field": "dateTime", "fieldName": "日期"
                            }
                        ]
                    }
                ]
            }
        ]
    });
    var chartsTopMenu = new Vue({
        el: "#chartsTopMenu",
        data: {
            name: mapJson.userName,
            projectName: mapJson.projectName,
            visId: mapJson.visId
        },
        methods: {
            /**
             * 执行保存
             */
            doSave: function () {
                var that = this;
                that.doCreateImg(function (data) {
                    var settingsArray = settingBox.getAllData();
                    var chartsArray = contentBox.getAllData();
                    var backSetting = backSettingBox.getAllData();
                    var formData = new FormData();
                    formData.append("settingsArray", JSON.stringify(settingsArray));
                    formData.append("chartsArray", JSON.stringify(chartsArray));
                    formData.append("backSetting", JSON.stringify(backSetting));
                    formData.append("visId", that.visId);
                    formData.append("image", data);
                    httpFile("/visualization/saveVisInfo.json", formData, function (data) {
                        if (data.code != 0) {
                            alert(data.message);
                        } else {
                            that.deleteLocalStorage();
                            that.goIndex();
                        }
                    });
                });
            },
            /**
             * 循环保存
             * @returns {null}
             */
            intervalSave: function () {
                var that = this;
                var settingsArray = settingBox.getAllData();
                var chartsArray = contentBox.getAllData();
                var backSetting = backSettingBox.getAllData();
                var data = that.getLocalStorage();
                if (data != null && JSON.stringify(data.data) == JSON.stringify({
                        settingsArray: settingsArray,
                        chartsArray: chartsArray,
                        backSetting: backSetting
                    })) {
                    return null;
                }
                var formData = new FormData();
                formData.append("settingsArray", JSON.stringify(settingsArray));
                formData.append("chartsArray", JSON.stringify(chartsArray));
                formData.append("backSetting", JSON.stringify(backSetting));
                formData.append("visId", that.visId);
                that.setLocalStorage();
                httpFile("/visualization/saveVisInfo.json", formData, function (data) {
                    if (data.code != 0) {
                        alert(data.message);
                    }
                });
            },
            /**
             * 创建图片
             * @param fn
             */
            doCreateImg: function (fn) {
                $('.chars_menuToolBox').css({opacity: 0});
                document.body.scrollTop = 0;
                html2canvas(document.getElementById('chartsShowBox'), {
                    onrendered: function (canvas) {
                        var data = canvas.toDataURL();
                        fn(data);
                    },
                    useCORS:true,
                    // allowTaint: true,
                    // taintTest: false,
                    width: document.getElementById('chartsShowBox').scrollWidth,
                    height: document.body.scrollHeight
                });
            },
            /**
             * 取消
             */
            doCancel: function () {
                this.goBack();
            },
            /**
             * 返回
             */
            goBack: function () {
                window.location.href = mapJson.backUrl;
            },
            /**
             * 去首页
             */
            goIndex: function () {
                window.location.href = mapJson.saveUrl;
            },
            /**
             * 设置本地数据
             */
            setLocalStorage: function () {
                var curTime = new Date().getTime();
                var settingsArray = settingBox.getAllData();
                var chartsArray = contentBox.getAllData();
                var backSetting = backSettingBox.getAllData();
                console.log("调用setLocalStorage");
                localStorage.setItem("data", JSON.stringify({
                    data: {
                        settingsArray: settingsArray,
                        chartsArray: chartsArray,
                        backSetting: backSetting
                    }, time: curTime, visId: mapJson.visId
                }));
            },
            /**
             * 获取本地数据
             * @returns {null}
             */
            getLocalStorage: function () {
                var data = localStorage.getItem("data");
                var dataObj = JSON.parse(data);
                if (dataObj == null) {
                    return null;
                }
                if (new Date().getTime() - dataObj.time > 1000 * 60 * 60 * 12) {
                    console.log('信息已过期');
                    this.deleteLocalStorage();
                    return null;
                } else {
                    if (dataObj.visId != mapJson.visId) {
                        this.deleteLocalStorage();
                        return null;
                    } else {
                        return dataObj;
                    }
                }
            },
            /**
             * 删除本地数据
             */
            deleteLocalStorage: function () {
                localStorage.setItem("data", null);
            }
        }
    });
    /*
     * 15s  缓存一次
     * */
    setInterval(function () {
        chartsTopMenu.intervalSave();
    }, 1000 * 15);
    var createColorPicker = function () {
        setTimeout(function () {
            $(".colorPicker").colorpicker({
                fillcolor: true,
                success: function (o, color) {
                    $(o).css("background-color", color);
                }
            });
        }, 500);
    };
    /**
     * settings
     * @type {[*]}
     */
    var settingList = JSON.stringify([
        {
            type: "text",
            data: "",
            position: 1,
            paramSettings: [
                {
                    name: "颜色设置",
                    type: "color",
                    isShow: true,
                    params: [{
                        name: "颜色",
                        paramsList: [
                            {
                                set: "color",
                                name: "颜色",
                                type: "text",
                                value: ""
                            }
                        ]
                    }]
                },
                {
                    name: "文本属性",
                    type: "text",
                    isShow: true,
                    params: [
                        {
                            name: "字体",
                            paramsList: [{
                                set: 'fontWeight',
                                name: "",
                                type: "select",
                                value: "normal",
                                defaultData: [{key: "bold", value: "加粗"}, {key: "normal", value: "不加粗"}]
                            }, {
                                set: 'text-align',
                                name: "",
                                type: "select",
                                value: "left",
                                defaultData: [{key: "left", value: "靠左"}, {key: "right", value: "靠右"}, {
                                    key: "center",
                                    value: "居中"
                                }]
                            }, {
                                set: 'text-decoration',
                                name: "",
                                type: "select",
                                value: "none",
                                defaultData: [{key: "none", value: "不加线"}, {key: "underline", value: "加线"}]
                            }]
                        }
                    ]
                }
            ]
        }, {
            type: "chart",
            data: [],
            position: 2,
            paramSettings: [
                {
                    name: "表格",
                    type: "table",
                    isShow: true,
                    params: [{
                        name: "从---到",
                        paramsList: [
                            {
                                set: 'yAxis.min',
                                name: "从",
                                type: "minText",
                                value: ''
                            },
                            {
                                set: 'yAxis.max',
                                name: "到",
                                type: "minText",
                                value: ''
                            }
                        ]
                    }]
                },
                {
                    name: "描述",
                    type: "desc",
                    isShow: true,
                    params: [{
                        name: "x轴描述",
                        paramsList: [
                            {
                                set: "xAxis.name",
                                name: "",
                                type: "text",
                                value: ""
                            }
                        ]
                    }, {
                        name: "y轴描述",
                        paramsList: [
                            {
                                set: "yAxis.name",
                                name: "",
                                type: "text",
                                value: ""
                            }
                        ]
                    }, {
                        name: "标题",
                        paramsList: [
                            {
                                set: "title.text",
                                name: "",
                                type: "text",
                                value: ""
                            }
                        ]
                    }, {
                        name: "副描述",
                        paramsList: [
                            {
                                set: "title.subtext",
                                name: "",
                                type: "text",
                                value: ""
                            }
                        ]
                    }
                    ]
                }
            ]
        }
    ]);
    var backSetting = {
        type: "text",
        data: "",
        position: 1,
        paramSettings: [
            {
                name: "颜色设置",
                type: "color",
                isShow: true,
                params: [{
                    name: "颜色",
                    paramsList: [
                        {
                            set: "background-color",
                            name: "颜色",
                            type: "text",
                            value: ""
                        }
                    ]
                }]
            }
        ]
    };
    /*
     * 面板设置栏
     * */
    var backSettingBox = new Vue({
        "el": "#backSettingBox",
        data: {
            backSetting: backSetting,
            isShow: true
        },
        methods: {
            getAllData: function () {
                return this.backSetting;
            },
            showBox: function () {
                this.isShow = true;
                settingBox.isShow = false;
                createColorPicker();
            },
            hideBox: function () {
                this.isShow = false;
            },
            changeData: function (item, $event) {
                var that = this;
                setTimeout(function () {
                    if (typeof item != 'undefined') {
                        item.value = $event.target.value;
                    }
                    that.resetBox();
                }, 500);
            },
            resetBox: function () {
                var obj = {};
                this.backSetting.paramSettings.forEach(function (item) {
                    item.params.forEach(function (ztem) {
                        ztem.paramsList.forEach(function (jtem) {
                            if (jtem.value != "") {
                                obj[jtem.set] = jtem.value;
                            }
                        });
                    });
                });
                for (var key in obj) {
                    $(".chars_plan").css(key, obj[key]);
                }
            }
        }
    });
    /**
     * 右侧设置栏
     */
    var settingBox = new Vue({
        el: "#chartsSettingBox",
        data: {
            settings: [],
            type: "",
            chooseItem: {},
            abcList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "S", "Y", "Z"],
            isShow: false
        },
        methods: {
            /**
             * 初始化数据
             * @param key
             * @param defaultData
             * @param type
             */
            initData: function (key, defaultData, type) {
                this.type = "data";
                var i = 0;
                while (true) {
                    if (JSON.parse(settingList)[i].type == type) {
                        var chooseItem = {
                            key: key,
                            settings: JSON.parse(settingList)[i],
                            tableData: defaultData.defaultTableArray,
                            data: defaultData.defaultDataArray,
                            inputParam: defaultData.inputFieldArray,
                            visChartId: defaultData.visChartId
                        };
                        this.settings.push(chooseItem);
                        this.chooseItem = chooseItem;
                        break;
                    }
                    i++;
                }
                this.flashCharts();
            },
            hideBox: function () {
                this.isShow = false;
                contentBox.hideAllToolBox();
            },
            getImage: function (key) {
                var base64 = contentBox.getImageBase64(key);
                console.log(base64);
                return base64
            },
            /**
             * 刷新charts
             */
            flashCharts: function () {
                var that = this;
                var obj = this.translateSettings();
                contentBox.createEcharts(this.chooseItem.key, this.chooseItem.settings.type, obj);
                setTimeout(function () {
                    contentBox.showToolBox(that.chooseItem.key, that.settings.length - 1);
                }, 500);
            },
            /**
             * 初始化key 的data
             * @param type
             * @param key
             */
            initKeyData: function (type, key) {
                var i = 0;
                var that = this;
                that.type = type;
                while (true) {
                    if (typeof that.settings[i].key == 'undefined') {
                        break;
                    }
                    if (that.settings[i].key == key) {
                        that.chooseItem = that.settings[i];
                        break;
                    }
                    i++;
                }
                createColorPicker();
            },
            /**
             * 翻译settings
             * @returns {{}}
             */
            translateSettings: function () {
                var type = this.chooseItem.settings.type;
                var settings = this.chooseItem.settings.paramSettings;
                var obj = {};
                if (type == "text") {
                    settings.forEach(function (item) {
                        item.params.forEach(function (ztem) {
                            ztem.paramsList.forEach(function (jtem) {
                                if (jtem.value != "") {
                                    obj[jtem.set] = jtem.value;
                                }
                            });
                        });
                    });
                    obj.data = this.chooseItem.data;
                } else {
                    for (var key in this.chooseItem.data) {
                        obj[key] = this.chooseItem.data[key]
                    }
                    settings.forEach(function (item) {
                        item.params.forEach(function (ztem) {
                            ztem.paramsList.forEach(function (jtem) {
                                if (jtem.value != "") {
                                    var sets = jtem.set.split(".");
                                    /**
                                     *  a.b.c ==> {a:{b:{c:""}}}
                                     * @param obj
                                     * @param list
                                     * @param i
                                     * @param value
                                     * @returns {*}
                                     */
                                    var test = function (obj, list, i, value) {
                                        if (list.length - 1 > i) {
                                            if (list[i] == 'xAxis' || list[i] == 'yAxis') {
                                                if (typeof obj[list[i]] != 'undefined') {
                                                    obj[list[i]][0] = typeof obj[list[i]][0] != 'undefined' ? obj[list[i]][0] : {};
                                                    i++;
                                                    test(obj[list[i - 1]][0], list, i, value);
                                                }
                                            } else {
                                                obj[list[i]] = typeof obj[list[i]] != 'undefined' ? obj[list[i]] : {};
                                                i++;
                                                test(obj[list[i - 1]], list, i, value);
                                            }
                                        } else {
                                            obj[list[i]] = value;
                                        }
                                        return obj;
                                    };
                                    obj = test(obj, sets, 0, jtem.value);
                                }
                            })
                        });
                    });
                }
                return obj;
            },
            /**
             * 改变type
             * @param string
             */
            changeType: function (string) {
                this.type = string;
                if (string == 'setting') {
                    createColorPicker()
                }
            },
            /**
             * 展示item
             * @param item
             */
            showItem: function (item) {
                item.isShow = !item.isShow;
            },
            /**
             * 改变data
             */
            changeData: function (item, $event) {
                console.log("触发改变echarts");
                var that = this;
                setTimeout(function () {
                    if (typeof item != 'undefined') {
                        item.value = $event.target.value;
                    }
                    var obj = that.translateSettings();
                    contentBox.updateEcharts(that.chooseItem.key, obj);
                }, 500);
                //触发修改表格
            },
            /**
             * 改变data
             */
            changeDataSelect: function () {
                console.log("触发改变echarts");
                var that = this;
                var obj = that.translateSettings();
                contentBox.updateEcharts(that.chooseItem.key, obj);
            },
            /**
             * 显示数据box
             */
            showSettingDataBox: function () {
                settingDataBox.paramData = this.chooseItem.inputParam;
                if (typeof this.chooseItem.inputSettingsParam != "undefined") {
                    settingDataBox.updateData = typeof this.chooseItem.inputSettingsParam == 'string' ? JSON.parse(this.chooseItem.inputSettingsParam) : this.chooseItem.inputSettingsParam;
                } else {
                    settingDataBox.updateData.visChartId = this.chooseItem.visChartId;
                }
                settingDataBox.$data.isShow = true;
            },
            /**
             * 改变数据
             * @param data
             */
            exchangeData: function (data) {
                this.chooseItem.tableData = data.defaultTableArray;
                this.chooseItem.tableData = data.defaultDataArray;
                this.flashCharts();
            },
            /**
             * 获取所有settings
             * @returns {Array|*}
             */
            getAllData: function () {
                return this.settings;
            },
            /**
             * 设置params
             * @param data
             */
            setParams: function (data) {
                this.chooseItem.inputSettingsParam = data;
            },
            /**
             * 删除setting
             * @param key
             */
            deleteSettingItem: function (key) {
                var i = 0;
                while (true) {
                    if (this.settings[i].key == key) {
                        this.settings.splice(i, 1);
                        this.chooseItem = this.settings[0];
                        break;
                    }
                    i++;
                }
            }
        }
    });
    /**
     * 弹出框设置
     */
    var settingDataBox = new Vue({
        el: "#settingDataBox",
        data: {
            isShow: false,
            isShowss: false,
            settingData: [
                {
                    "dataResult": "统计数据",
                    "dataResultId": "1",
                    "itemList": [
                        {
                            "paramId": "1",
                            "name": "统计报告1",
                            "fieldList": [
                                {
                                    "field": "dateTime", "fieldName": "日期"
                                }
                            ]
                        }
                    ]
                },
                {
                    "dataResult": "统计数据2",
                    "dataResultId": "2",
                    "itemList": [
                        {
                            "paramId": "2",
                            "name": "统计报告2",
                            "fieldList": [
                                {
                                    "field": "dateTime", "fieldName": "日期2"
                                }
                            ]
                        }
                    ]
                }
            ],
            settingData2: [
                {
                    "paramId": "1",
                    "name": "统计报告1",
                    "fieldList": [
                        {
                            "field": "dateTime", "fieldName": "日期"
                        }
                    ]
                }
            ],
            settingData3: [
                {
                    "field": "dateTime", "fieldName": "日期"
                }
            ],
            updateData: {
                visChartId: "",
                sortOrder: []
            },
            paramData: [
                {
                    "field": "xAxis",
                    "fieldName": "X轴"
                },
                {
                    "field": "yAxis",
                    "fieldName": "y轴"
                },
                {
                    "field": "k",
                    "fieldName": "图例"
                }
            ]
        },
        methods: {
            /**
             * 隐藏box
             */
            hiddenBox: function () {
                this.isShow = false;
            },
            /**
             * deleteItem
             */
            deleteItem: function (index) {
                this.updateData.sortOrder.splice(index, 1);
            },
            /**
             * 获取子list
             */
            getChildren: function () {
                var i = 0;
                while (true) {
                    if (this.updateData.dataResultId == this.settingData[i].dataResultId) {
                        this.settingData2 = this.settingData[i].itemList;
                        this.updateData.paramId = this.settingData2[0].paramId;
                        break;
                    }
                    i++;
                }
                this.getChildren2();
            },
            /**
             * 获取子list
             */
            getChildren2: function () {
                var i = 0;
                var that = this;
                while (true) {
                    if (this.updateData.paramId == this.settingData2[i].paramId) {
                        this.settingData3 = this.settingData2[i].fieldList;
                        this.paramData.forEach(function (item) {
                            that.updateData[item.field] = that.settingData3[0].field;
                        });
                        break;
                    }
                    i++;
                }
            },
            /**
             * 设置默认staticData
             * @param array
             */
            setDefaultStaticData: function (array) {
                this.settingData = array;
                this.updateData.dataResultId = this.settingData[0].dataResultId;
                this.settingData2 = array[0].itemList;
                this.updateData.paramId = this.settingData2[0].paramId;
                this.getChildren2();
            },
            /**
             * 获取数据
             */
            getData: function () {
                var that = this;
                settingBox.setParams(JSON.stringify(this.updateData));
                httpGet("/visualization/getVisData.json", {jsonParam: JSON.stringify(this.updateData)}, function (data) {
                    if (data.code == 0) {
                        settingBox.chooseItem.data = data.data.dataArray;
                        settingBox.chooseItem.tableData = data.data.tableArray;
                        settingBox.changeData();
                        that.isShow = false;
                    } else {
                        alert(data.message);
                    }
                });
            }
        }
    });
    /**
     *
     * 中间画板
     */
    var contentBox = new Vue({
        el: "#chartsShowBox",
        data: {
            chartsList: []
        },
        methods: {
            showBackSettingBox: function () {
                backSettingBox.showBox();
                this.hideAllToolBox();
            },
            /**
             * 创建echarts
             * @param key
             * @param type
             * @param options
             */
            createEcharts: function (key, type, options) {
                console.log(JSON.stringify(options));
                this.chartsList.push({
                    key: key, type: type, option: options
                });
                this.createAllEcharts();
            },
            /**
             * 更新echarts
             * @param key
             * @param options
             */
            updateEcharts: function (key, options) {
                var i = 0;
                var that = this;
                while (true) {
                    if (that.chartsList[i].key == key) {
                        that.chartsList[i].option = options;
                        if (that.chartsList[i].type == 'chart') {
                            that.chartsList[i].chart.clear();
                            that.chartsList[i].chart.setOption(options);
                        } else if (that.chartsList[i].type == "text") {
                            for (var key in that.chartsList[i].option) {
                                if (key == "data") {
                                    that.chartsList[i].div.text(that.chartsList[i].option[key])
                                }
                                that.chartsList[i].div.css(key, that.chartsList[i].option[key]);
                            }
                        }
                        break;
                    }
                    i++;
                }
            },
            getImageBase64: function (key) {
                var base64 = "";
                var that = this;
                var i = 0;
                while (true) {
                    if (that.chartsList[i].key == key) {
                        base64 = that.chartsList[i].chart.getDataURL({
                            pixelRatio: 2,
                            backgroundColor: '#fff',
                            excludeComponents: ['toolbox']
                        });
                        break;
                    }
                    i++;
                }
                return base64;
            },
            /**
             * 创建所有echarts
             */
            createAllEcharts: function () {
                var that = this;
                setTimeout(function () {
                    var i = 0;
                    that.chartsList.map(function (item) {
                        var div = $('#' + i);
                        if (item.type == "chart") {
                            var myChart = echarts.init(document.getElementById(i));
                            myChart.clear();
                            myChart.setOption(item.option);
                            item.chart = myChart;
                            item.div = div;
                        } else if (item.type == "text") {
                            for (var key in item.option) {
                                if (key == "data") {
                                    div.text(item.option[key])
                                }
                                div.css(key, item.option[key]);
                            }
                            item.div = div;
                        }
                        i++;
                    });
                    that.createTz();
                }, 500);
            },
            /**
             * 创建tz功能
             */
            createTz: function () {
                $(".chars_plan").dad({
                    draggable: ".tz"
                })
            },
            /**
             * 选择此data
             * @param item
             */
            chooseThisData: function (item) {
                settingBox.initKeyData("data", item.key);
            },
            /**
             * 选择此setting
             * @param item
             */
            chooseThisSetting: function (item) {
                settingBox.initKeyData("setting", item.key);
            },
            /**
             * 触发下载
             * @param item
             * @param i
             */
            downLoad: function (item, i) {
                var base64 = item.chart.getDataURL({
                    pixelRatio: 2,
                    backgroundColor: '#fff',
                    excludeComponents: ['toolbox']
                });
                //  downloadFile("chart.png", base64);
                // window.open(base64);
                saveAsLocalImage(item.key + ".jpg", base64);
            },
            /**
             * 删除item
             * @param item
             * @param index
             */
            deleteItem: function (item, index) {
                var key = item.key;
                this.chartsList.splice(index, 1);
                settingBox.deleteSettingItem(key);
                this.createAllEcharts();
            },
            /**
             * 获取所有数据
             * @returns {Array}
             */
            getAllData: function () {
                var result = [];
                this.chartsList.forEach(function (item) {
                    var obj = {};
                    for (var k in item) {
                        if (k != "chart") {
                            obj[k] = item[k]
                        }
                    }
                    result.push(obj)
                });
                return result;
            },
            showToolBox: function (key, index) {
                backSettingBox.hideBox();
                this.chartsList.forEach(function (item, i) {
                    $('#toolBox' + item.key).css({opacity: "0"});
                    if (i == index) {
                        $('#' + i).css({"box-shadow": "0 0 15px #cccccc"})
                    } else {
                        $('#' + i).css({"box-shadow": "0 0 0 #cccccc"});
                    }
                });
                $('#toolBox' + key).css({opacity: "1"});
                settingBox.initKeyData("data", key);
                settingBox.isShow = true;
            },
            hideAllToolBox: function () {
                this.chartsList.forEach(function (item) {
                    $('#toolBox' + item.key).css({opacity: "0"});
                    $('.chars_textItem').css({"box-shadow": "0 0 0 #cccccc"});
                    $('.chars_item').css({"box-shadow": "0 0 0 #cccccc"});
                });
            }
        }
    });

    /**
     * 保存图片
     * @param fileName
     * @param base64
     */
    function saveAsLocalImage(fileName, base64) {
        var atag = document.createElement("a");
        atag.href = base64;
        atag.download = fileName;
        atag.click();
    }

    /**
     * 左侧面板
     */
    var menu = {
        "menuList": [
            {
                "id": 1,
                img: imgBaseUrl + "../icon/tb.png",
                "type": "chart",
                "name": "img"

            },
            {
                "id": 2,
                "img": "",
                "type": "text",
                "name": "A"
            }
        ],
        "menudata": [
            {
                type: "chart",
                list:
                    [
                {
                    typeName: "折线图", typeItems: [
                    {
                        name: "线1",
                        type: "line",
                        pType: "chart",
                        img: imgBaseUrl + "dynamic-data2.png",
                        visChartId: "1"
                    }
                ]
                },
                {
                    typeName: "柱状图", typeItems: [
                    {
                        name: "柱1",
                        type: "bar",
                        pType: "chart",
                        img: imgBaseUrl + "bar-tick-align.png",
                        visChartId: "3"
                    }
                ]
                },
                {
                    typeName: "饼状图", typeItems: [
                    {
                        name: "饼1",
                        type: "pie",
                        pType: "chart",
                        img: imgBaseUrl + "pie-simple.png",
                        visChartId: "5"
                    }, {
                        name: "饼1",
                        type: "pie",
                        pType: "chart",
                        img: imgBaseUrl + "pie-simple.png",
                        visChartId: "5"
                    }
                ]
                }
            ]
            },
            {
                type: "text", list: [
                {
                    typeName: "文本框", typeItems: [
                    {
                        name: "框1",
                        type: "text",
                        pType: "text",
                        img: "",
                        visChartId: "6"
                    },
                    {
                        name: "框2",
                        type: "text",
                        pType: "text",
                        img: "",
                        visChartId: "6"
                    }
                ]
                }
            ]
            }
        ]
    };
    /**
     * 具体菜单
     */
    var chartsBox = new Vue({
        el: "#chartsBox",
        data: {
            charsBox: [],
            searchParam: ""
        },
        methods: {
            even: function (charsBox) {
                var reg = new RegExp(this.searchParam, "i");
                return charsBox.filter(function (chars) {
                    return reg.test(chars.name) ? chars : null;
                })
            },
            /**
             * 选择item
             * @param data
             */
            chooseItem: function (data) {
                console.log("菜单选择visChartId:" + data.visChartId);
                var i = 0;
                while (true) {
                    if (JSON.parse(defaultData).defaultData[i].visChartId == data.visChartId) {
                        var date = new Date().getTime();
                        settingBox.initData(date, JSON.parse(defaultData).defaultData[i], data.pType);
                        break;
                    }
                    i++
                }
            }
        }
    });
    /*
     大菜单
     * */
    var menuBox = new Vue({
        el: "#charsMenu",
        data: {
            menuList: menu.menuList
        },
        methods: {
            /**
             * 选择item
             * @param type
             * @param e
             */
            chooseItem: function (type, e) {
                var top = e.offsetX;
                setChartsBox(type, top);
            },
            /**
             * 选择menulist
             * @param array
             */
            setMenuList: function (array) {
                this.menuList = array;
            }
        }
    });
    /**
     * 制作数据
     * @param data
     */
    var makeChartsBox = function (data) {
        chartsBox.charsBox = data;
    };
    /**
     * 设置chratsbox
     * @param type
     * @param top
     */
    var setChartsBox = function (type, top) {
        setBoxTop(35);
        makeChartsBox(getMenuListData(type));
        setLeftBtn(360, 35);
    };
    /**
     * 获取menuListdata
     * @param type
     * @returns {Array}
     */
    var getMenuListData = function (type) {
        var i = 0;
        var result = [];
        while (true) {
            if (menu.menudata[i].type == type) {
                result = menu.menudata[i].list;
                break;
            }
            i++
        }
        return result;
    };

    /*
     * 页面事件
     * */
    $('#leftBtn').bind('click', function () {
        makeChartsBox([]);
        chartsBox.searchParam = "";
        $('#leftBtn').css({"display": "none"});
    });
    /**
     * 设置左边btn
     * @param left
     * @param top
     */
    var setLeftBtn = function (left, top) {
        $('#leftBtn').css({"left": left, "top": top, "display": "block"});
    };
    /**
     * 设置top
     * @param top
     */
    var setBoxTop = function (top) {
        $('#chartsBox').css({"top": top});
    };
    /**
     * 获取所有data
     */
    var getAllData = function () {
        var haveData = false;
        httpGet("/visualization/getVisLeftMenuList.json", {}, function (data) {
            menu = data.data;
            menuBox.setMenuList(menu.menuList);
        });
        httpGet("/visualization/getVisRightSettingList.json", {}, function (data) {
            settingList = JSON.stringify(data.data.settingList);
        });
        httpGet("/visualization/getVisRightDefaultList.json", {projectId: mapJson.projectId}, function (data) {
            defaultData = JSON.stringify(data.data);
            settingDataBox.setDefaultStaticData(data.data.statisticsData);
        });
        httpGet("/visualization/getVisModuleList.json", {visId: mapJson.visId}, function (data) {
            if (data.code == 0) {
                contentBox.chartsList = data.data.chartsArray;
                settingBox.settings = data.data.settingsArray;
                var _data = data.data.backSetting;

                backSettingBox.backSetting = _data ? _data:backSetting;
                contentBox.createAllEcharts();
                backSettingBox.resetBox();
                haveData = true;
            }
        });
        httpGet("/visualization/getVisBackSetting.json", {}, function (data) {
            if (data.code == 0) {
                backSettingBox.backSetting = typeof backSettingBox.backSetting == 'undefined' ? data.data : typeof backSettingBox.backSetting.paramSettings == 'undefined' ? data.data : backSettingBox.backSetting;
                backSettingBox.resetBox();
            }
        });
        var resetLocalStorage = function () {
            var value = chartsTopMenu.getLocalStorage();
            if (value == null) {
                return false;
            }
            contentBox.chartsList = value.data.chartsArray;
            settingBox.settings = value.data.settingsArray;
            backSettingBox.backSetting = value.data.backSetting;
            contentBox.createAllEcharts();
        };
        //    resetLocalStorage();
    };
    /**
     * 执行初始化
     */
    var initChartPlatform = function () {
        console.log("执行初始化!");
        getAllData();
    };
    initChartPlatform();
    createColorPicker();
    /**
     * js加载完毕 显示body
     */
    $('body').css({"opacity": "1"});
})($);