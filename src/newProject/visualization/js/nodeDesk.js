/**
 * Created by setting on 2017/10/31 0031.
 */
let Node = require('./node.js');
import '../css/node_etc.css';

let nodeList = [];//节点集合
let Vue_nodeList = new Vue({
    name: 'nodeList',
    el: '#NodeList',
    data: {
        NodeList: {
            categoryList: [
                {id: 1, name: "输入"},
                {id: 2, name: "分析"},
            ],
            nodeList: [
                {
                    jobTypeCategoryId: 1,
                    typeNo: "dataCrawl",
                    typeName: "pc抓取",
                    processType: 1,
                    typeClassify: 2,
                    inputNum: 1,
                    queryUrl: "/ visWorkFlow /getWorkFlowNodeData.json",
                    imgUrl: "/newProject/svg/1.svg",
                    tip: "提示",
                    paramArray: [
                        {
                            inputParamId: 2,
                            paramEnName: 'datasourceId',
                            paramCnName: "数据源名称",
                            restrictions: "",
                            is_required: 1,
                            requestUrl: '',
                            filedMapping: {
                                id: "datasourceId",
                                value: "datasourceName"
                            },
                            paramType: "text",
                            styleCode: 'input',
                            value: ''
                        },
                        {
                            inputParamId: 2,
                            paramEnName: 'datasourceId',
                            paramCnName: "数据源类型名称",
                            restrictions: "",
                            is_required: 1,
                            requestUrl: '',
                            filedMapping: {
                                id: "datasourceId",
                                value: "datasourceName"
                            },
                            paramType: "text",
                            styleCode: 'input',
                            value: ''
                        },
                    ]
                },
                {
                    jobTypeCategoryId: 2,
                    typeNo: "dataCrawl22",
                    typeName: "pc抓取",
                    processType: 1,
                    typeClassify: 2,
                    inputNum: 1,
                    queryUrl: "/ visWorkFlow /getWorkFlowNodeData.json",
                    imgUrl: "/newProject/svg/2.svg",
                    tip: "提示",
                    paramArray: [
                        {
                            inputParamId: 2,
                            paramEnName: 'datasourceId',
                            paramCnName: "数据源名称",
                            restrictions: "",
                            is_required: 1,
                            requestUrl: '',
                            filedMapping: {
                                id: "datasourceId",
                                value: "datasourceName"
                            },
                            paramType: "text",
                            styleCode: 'input',
                            value: ''
                        },
                        {
                            inputParamId: 2,
                            paramEnName: 'datasourceId',
                            paramCnName: "数据源类型名称",
                            restrictions: "",
                            is_required: 1,
                            requestUrl: '',
                            filedMapping: {
                                id: "datasourceId",
                                value: "datasourceName"
                            },
                            paramType: "text",
                            styleCode: 'input',
                            value: ''
                        },
                    ]
                }
            ]
        },
        content: [],
        name: '',
        select: 1,
        isShow: true
    },
    methods: {
        //获取节点列表(左侧面板)
        getWorkFlowNodeList() {
            $.get('/visWorkFlow/getWorkFlowNodeList.json', res => {
                if (res.code === 0) {
                    this.NodeList = res.data;
                    this.changeTab();
                }
            })
        },
        tabClick: function (type) {
            this.select = type;
            this.isShow = true;
            this.changeTab();
        },
        changeTab: function () {
            this.content = this.NodeList.nodeList.filter(v => {

                return v.jobTypeCategoryId === this.select;
            })
            for (let i = 0; i < this.NodeList.categoryList.length; i++) {
                if (this.NodeList.categoryList[i].id == this.select) {
                    this.name = this.NodeList.categoryList[i].name;
                }
            }
        },
        toggle: function () {
            this.isShow = !this.isShow
        },
        dragstart: function (e) {
            drag(e)
        }
    },
    mounted: function () {
        this.getWorkFlowNodeList()


    },
});
let Vue_setting = new Vue({
    name: 'nodeSetting',
    el: '#setting',
    data: {
        formName: 'form',
        type: 0,
        first: false,
        dialogVisible: false,
        setting: {},
        test: {},
        isShow: false,
        isFullScreen: false,
        active_index: 1,
        frequency: {
            Cron: "* * * * * *",
            frequencyList: [{
                key: 1, value: "单次"
            }, {
                key: 2, value: "循环"
            }],
            s: '1',
            m: '1',
            h: '1',
            d: '1',
            M: '1',
            w: '1',
            value: '',
            __s: [],
            __m: [],
            __h: [],
            __d: [],
            __M: [],
            __w: [],
        },
        activeTabs: 's'

    },
    methods: {
        //面板开关
        toggle: function () {
            this.isShow = !this.isShow;
        },
        //同步节点名称
        setName: function (name) {
            Node.canvas.select('#' + Node.clickedNode.nodeInfo.name)
                .select('.nodeName')
                .text(!name ? Vue_setting.setting[Vue_setting.type].typeName : name.length > 6 ? name.substring(0, 6) + '...' : name);

        },
        //全屏
        fullScreen: function (id) {
            if (!this.isFullScreen) {
                $('#' + id).addClass('fullScreen')
                $('.shade').removeClass('hidden');
                this.isFullScreen = true;
            } else {
                $('#' + id).removeClass('fullScreen')
                $('.shade').addClass('hidden');
                this.isFullScreen = false;
            }

        },
        //tabs标签页
        tabs(id) {
            this.active_index = id
        },
        //点击select框
        focusSelect(item) {
            let preId = item.preParamId;
            if (preId) return false;
            if (!item.load) {
                this.getSelectList(item.requestUrl, item, _ => {
                    this.$set(item, "load", true);
                })

            }
        },
        //寻找上级节点
        foundPreNode(item) {
            var preId = item.preId;
            if (preId) {
                var preNode = nodeList[Node.getNodeIndexByName(nodeList, preId)];
                return preNode
            }
        },
        submitForm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    //alert('submit!');

                } else {
                    this.$notify.error('error submit!!');
                    return false;
                }
            });
        },
        clearFormValidate() {
            if (this.$refs['form']) this.$refs['form'].clearValidate();

        },
        //更改select值
        changeSelect(item) {
            let itemValue = item.value; //获取当前选中的值
            let itemEnName = item.filedMapping.id;//获取当前控件的EnName [为匹配替换参数]
            let reg = new RegExp('(' + itemEnName + '=\\w*)'); //替换以当前控件名为参数键的url  eg: /getJson.json?EnName=   匹配EnName=   将替换成EnName=value
            let nextId = item.nextParamId && (item.nextParamId + "").split(','); //获取当前控件关联的下级节点  eg: 1,2,3,4

            if (nextId.length > 0) {
                //循环替换掉所关联的下级控件的requestUrl
                nextId.map((id, index) => {
                    let nextItem = this.getValueByParamMapId(id);
                    nextItem.requestUrl = nextItem.requestUrl.replace(reg, itemEnName + '=' + itemValue);
                    if (!index) {
                        this.getSelectList(nextItem.requestUrl, nextItem, _ => {
                            nextItem.value = "";
                        })
                    }
                })
            }

            if (this.type == "dataCrawl" && item.paramEnName == "datasouceTypeId") {
                //设置抓取频次
                this.$set(item.config, 'frequency', JSON.parse(JSON.stringify(this.frequency)))
                //设置节点映射
                var mapNode = this.getValueByParamMapId(16);//寻找映射表的节点
                var mapNodeUrls = mapNode.requestUrl.split(',');
                //寻找上级抓取节点数据源id
                var preId = this.setting[this.type].preId

                if (preId) {
                    var preNode = nodeList[Node.getNodeIndexByName(nodeList, preId)];
                    var perNode_dataSourceType = preNode.data.paramArray.filter(kj => {
                        return kj.paramEnName == "datasouceTypeId";
                    })[0];

                    var preNodeDataSourceTypeId = perNode_dataSourceType.value
                    $.get(mapNodeUrls[1] + itemValue, res => {
                        if (res.code == 0) {
                            console.log(res.data)
                            this.$set(mapNode, 'config', {});
                            this.$set(mapNode['config'], 'param', res.data);

                            $.get(mapNode.requestUrl.split(',')[0] + preNodeDataSourceTypeId, res => {
                                if (res.code == 0) {
                                    this.$set(mapNode['config'], 'output', res.data);
                                }
                            })
                        }
                    })
                }
            }

        },

        //请求下拉框列表
        getSelectList(url, toObject, callback) {
            $.get(url, res => {
                if (res.code === 0) {
                    this.$set(toObject, "config", {
                        list: []
                    })
                    this.$set(toObject['config'], "list", res.data);
                    callback && callback()
                }
            })
        },
        //根据ParamId获取控件
        getValueByParamMapId(paramMapId) {
            return this.setting[this.type].paramArray.filter(item => {
                return item.inputParamId == paramMapId
            })[0]
        },
        //导入节点 文件上传触发
        triggerUpFile() {
            $('#dataImport_input_file').trigger('click')
        },
        //导入节点 选择文件事件
        dataImport_fileChange(e, item) {
            var value = e.target.value;
            var pos = value.lastIndexOf("\\");
            this.$set(item, 'fileName', (value.substring(pos + 1)))

        },
        //导入节点上传文件事件
        submitUpload(item) {
            var dataSourceId = this.getValueByParamMapId(3).value
            let formData = new FormData();
            var file = document.getElementById('dataImport_input_file').files[0];
            formData.append('file', file);
            $.ajax({
                url: item.requestUrl + '?id=' + dataSourceId,
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.code === 0) {
                        var fieldAnnotationObj = {};
                        res.data.fieldNameList.map((item, index) => {
                            fieldAnnotationObj[item] = res.data.fieldAnnotationList[index]
                        })
                        item.value = res.data.url;
                        Vue_setting.$set(item, 'config', {})
                        Vue_setting.$set(item, 'config', res.data)
                        Vue_setting.$set(item.config, 'fieldMapping', fieldAnnotationObj)
                        Vue_setting.$set(item.config, 'tempFieldList', {})

                        Vue_setting.$set(item.config, 'selects', [])
                    }

                }
            })
        },
        //导入节点选择字段映射
        selectFieldName(v, item) {
            var tempArr = [];
            var list = item.config.tempFieldList;
            for (var i in list) {
                if (list[i] != "") {
                    tempArr.push(list[i])
                }
            }
            item.config.selects = tempArr

        },
        //导入节点数据整理
        _dataImport_getMapTableData(item) {
            var file_origainRelation = item.paramArray.filter(param => {
                return param.inputParamId == 13 || param.inputParamId == 4;
            })
            if (!file_origainRelation[0].config) return false;
            var mappingList = file_origainRelation[0].config.tempFieldList;
            var newMapping = [];
            for (var i in mappingList) {
                newMapping.push({
                    key: mappingList[i],
                    value: i
                })
            }
            console.log('mapping', newMapping)
            file_origainRelation[1].value = newMapping
        },


        //抓取节点 文件上传触发
        _dataCrawl_fileTrigger() {
            $('#_dataCrawl_inputFile').trigger('click')
        },
        //选择文件
        _dataCrawl_fileChange(e, prop) {
            var value = e.target.value;
            var pos = value.lastIndexOf("\\");
            this.$set(prop, 'fileName', (value.substring(pos + 1)));

            //立即上传
            var formData = new FormData();
            var file = document.getElementById('_dataCrawl_inputFile').files[0];
            formData.append('file', file);
            $.ajax({
                url: "/dataCrawl/uploadFile.json",
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.code === 0) {
                        var obj = {
                            value: $('#input-file-value').val(),
                            file: res.data.url
                        }
                        Vue_setting.$set(prop, 'paramValue', {})
                        Vue_setting.$set(prop.paramValue, 'value', $('#input-file-value').val())
                        Vue_setting.$set(prop.paramValue, 'file', res.data.url)

                    }
                }
            })
        },
        //抓取节点 设置value
        _dataCrawl_setProp_value(prop) {
            if (prop.paramValue) prop.paramValue.value = prop.value

        },
        //清除cron表达式
        _clearCron(c) {
            c.length = 0;
        },
        //获取Cron表达式
        getCron(frequency) {
            var getSel = (arr => {
                return arr.join(',');
            })
            var CronArr = frequency.Cron.split(' ');
            for (let i = 0; i < CronArr.length; i++) {

                if (i === 0) {
                    let c = getSel(frequency.__s)
                    CronArr[i] = c ? c : "*";

                }
                if (i === 1) {
                    let c = getSel(frequency.__m)
                    CronArr[i] = c ? c : "*"
                }
                if (i === 2) {
                    let c = getSel(frequency.__h)
                    CronArr[i] = c ? c : "*"
                }
                if (i === 3) {
                    let c = getSel(frequency.__d)
                    CronArr[i] = c ? c : "*"
                }
                if (i === 4) {
                    let c = getSel(frequency.__M)
                    CronArr[i] = c ? c : "*"
                }
                if (i === 5) {
                    let c = getSel(frequency.__w)
                    CronArr[i] = c ? c : "*"
                }
            }
            return (CronArr.join(' '))
        },
        //抓取节点整理动态组件数据
        _dataCrawl_dynaData(item) {
            //数据源类型控件
            var dataSourceType = item.paramArray.filter(ds => {
                return ds.inputParamId == 7
            })[0]
            //对应数据源类型id的动态控件
            if (!dataSourceType.config) return false;
            var prop = dataSourceType.config.list.filter(_prop => {
                return _prop.datasourceTypeId == dataSourceType.value;
            })[0];
            //获取填入值
            var inputParamArray = item.paramArray.filter(ip => {
                return ip.inputParamId == 9;
            })[0]
            //设置填入
            inputParamArray.value = prop.inpuutParam


        },
        //抓取节点 整理抓取频次
        _dataCrawl_frequency(item) {
            //数据源类型控件
            var dataSourceType = item.paramArray.filter(ds => {
                return ds.inputParamId == 7
            })[0]

            if (!dataSourceType.config) return false;
            var Corn = this.getCron(dataSourceType.config.frequency);
            //抓取频次控件
            var frequency = item.paramArray.filter(fq => {
                return fq.inputParamId == 12;
            })[0]

            frequency.value = Corn;


        },

        _dataCrawl_save() {
            //this._dataImport_getMapTableData(this.setting[this.type])
            //this.getCron()
            this._dataCrawl_dynaData(this.setting[this.type]);
            this._dataCrawl_frequency(this.setting[this.type]);
        },
        //分析对象请求数据
        _semantic_getList(item, id) {
            $.get('/semanticAnalysisObject/getContentTypeList.json?dataSourceTypeId=' + id, res => {
                if (res.code == 0) {
                    this.$set(item, 'config', {});
                    this.$set(item.config, 'list', res.data);
                    this.$set(item.config, 'sas', [{subType: 1, value: "", contentType: ""}])
                }
            });

        }

    },
    watch: {
        'setting': {
            handler: function (val) {
                for (let key in val) {
                    if (val[key].typeNo === this.type) {
                        let name = val[key].paramArray[0].value
                        this.setName(name)
                    }
                }
            },
            deep: true
        },
    },
    mounted() {
        $('body').fadeIn('fast');

    }

});
let Vue_head = new Vue({
    name: "head",
    el: "#head",
    data() {
        var time = (rule, value, callback) => {
            if (value) {
                return callback()
            }
            callback(new Error('请选择起止时间'))
        }
        return {

            editProjectDialog: false,
            tipDialog: false,
            nodeTip: [
                {
                    img: "/newProject/img/import.png",
                    name: "导入",
                    tip: "用户可通过该节点上传本地文件系统的可用excel\\csv文件，并可选择对应的数据源\\数据源类型；字段的映射关系匹配，并按照匹配后的字段被导入。"
                },
                {
                    img: "/newProject/img/crawl.png",
                    name: "抓取",
                    tip: "用户可通过该节点抓取指点数据源类型的数据，也可实现流程抓取。"
                },
                {
                    img: "/newProject/img/yy.png",
                    name: "语义对象",
                    tip: "用户可通过该节点对导入\\抓取的数据进行分析对象的设置，也就是筛选需要用于分析的字段。"
                },
                {
                    img: "/newProject/img/fc.png",
                    name: "分词",
                    tip: "通过选择的词库，对该节点输入的内容进行分词。"
                },
                {
                    img: "/newProject/img/zt.png",
                    name: "主题",
                    tip: "该节点可通过主题矩阵对输入的语料进行主题的分析。"
                },
                {
                    img: "/newProject/img/topic.png",
                    name: "话题",
                    tip: "该节点可通过话题算法对该节点输入的语料进行话题分析。"
                },
                {
                    img: "/newProject/img/export.png",
                    name: "输出",
                    tip: "该节点实现将处理之后的数据输出为API接口。"
                },
                {
                    img: "/newProject/img/crawl.png",
                    name: "抓取",
                    tip: "用户可通过该节点上传本地文件系统的可用excel\\csv文件，并可选择对应的数据源\\数据源类型；字段的映射关系匹配，并按照匹配后的字段被导入。"
                },
            ],
            nodeStatus: [
                {
                    img: "/newProject/img/wqd.png",
                    status: "未启动"
                },
                {
                    img: "/newProject/img/ing.png",
                    status: "进行中"
                },
                {
                    img: "/newProject/img/success.png",
                    status: "已完成"
                },
                {
                    img: "/newProject/img/error.png",
                    status: "出错"
                },
            ],
            nodeIcon: [
                {
                    img: "/newProject/img/icon_status.png",
                    status: "表示该节点为状态节点"
                },
                {
                    img: "/newProject/img/icon_data.png",
                    status: "表示该节点为数据节点"
                },
                {
                    img: "/newProject/img/icon_loop.png",
                    status: "设置了循环 的节点"
                }
            ],
            form: {
                projectId: getQueryString("projectId"),
                templateId: "",
                nodeList: []
            },
            editForm: {
                projectId: getQueryString("projectId"),
                projectName: '',
                projectDescribe: '',
                managerId: "",
                customerId: '',
                startTime: "",
                endTime: '',
                workFlowTemplateId: '',
                typeId: '1',
                projectType: "vis",
                time: ''
            },
            typeList: [
                {key: '3', value: '日报'},
                {key: '2', value: '周报'},
                {key: '1', value: '月报'},
                {key: '4', value: '临时项目'}
            ],
            rules: {
                projectName: [
                    {required: true, message: '请输入项目名称', trigger: 'change'},
                ],
                managerId: [
                    {required: true,  message: '请选择项目经理', trigger: 'change',pattern : /./},
                ],
                customerId: [
                    {required: true,  message: '请选择客户', trigger: 'change',pattern : /./},
                ],
                time: [
                    {validator: time, trigger: 'blur', required: true}
                ],
            },
            managerList: [],
            customerList: []
        }
    },
    methods: {
        editProject() {
            this.getCustomerList();
            this.getManagerList();
            this.getProjectBaseInfo();
            this.editProjectDialog = true;
        },
        //获取项目经理
        getManagerList() {
            $.post('/project/getProjectManagerList.json', res => {
                if (res.code === 0) {
                    this.managerList = res.data.list;
                }
            })
        },
        //获取客户列表
        getCustomerList() {
            $.post('/project/getCustomerList.json', res => {
                if (res.code === 0) {
                    this.customerList = res.data.list;
                }
            })
        },
        //获取项目基本信息
        getProjectBaseInfo() {
            $.get('/visWorkFlow/updateVisWorkFlowProject.json?projectId=' + this.editForm.projectId, res => {
                if (res.code === 0) {
                    console.log(res.data)
                    for (var i in res.data) {
                        this.editForm[i] = res.data[i];
                    }
                    this.editForm.time = [this.editForm.startTime, this.editForm.endTime,]
                }
            })
        },
        //获取节点信息
        getProjectInt() {

        },
        saveProject() {
            //整理数据
            nodeList.map(item => {
                item.froms = item.nodeInfo.from || null;
                item.tos = item.nodeInfo.to || null;
                switch (item.data.typeNo) {
                    case "dataImport":
                        Vue_setting._dataImport_getMapTableData(item.data);
                        break;
                    case "dataCrawl":
                        Vue_setting._dataCrawl_dynaData(item.data);
                        Vue_setting._dataCrawl_frequency(item.data);
                        break;
                }
            });
            console.log(this.form.nodeList = nodeList)
            $.post('/visWorkFlow/savetWorkFlowProjectNodeInfo.json', {body: JSON.stringify(this.form)}, res => {
                if (res.code === 0) {

                }
            })
        },
        line() {
            if (Node.isLine) {
                Node.restLine();
                $("#line").removeClass('active');
                Node.isLine = false
            } else {
                $("#line").addClass('active');
                Node.isLine = true;
                Node.restDasharray();
            }
        },
        selectTime(val) {
            if (val) {
                this.form.startTime = val[0];
                this.form.endTime = val[1];
            }
        },
        saveProjectBaseInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    $.post('/visWorkFlow/saveOrUpdateProject.json', this.editForm, res => {
                        if (res.code === 0) {
                            this.$message.success('更新成功');
                            this.editProjectDialog = false;
                        } else {
                            this.$message.error(res.message)
                        }
                    })

                } else {
                    return false;
                }
            });
        },
    }
})

//全局事件注册
{
    $('#canvas').on('dragover', function (e) {
        allowDrop(e.originalEvent);
    });
    $('#canvas').on('drop', function (e) {
        drop(e.originalEvent)
    });
    $('#canvas').on('click', function (e) {
        Vue_setting.isShow = false;
    });


    /*//保存
    $('#save').click(function () {
        showQRCode();
    })*/

    function showQRCode() {
        /*scrollTo(0, 0);
        if (typeof html2canvas !== 'undefined') {
            //以下是对svg的处理
            var nodesToRecover = [];
            var nodesToRemove = [];
            var svgElem = $(".bgContainer").find('svg');//divReport为需要截取成图片的dom的id
            var copyEle = svgElem.clone().removeAttr('style').css({"width": "1280px", "height": "960px"});
            copyEle.prepend('<rect x="-2000%" y="-2000%" id="bg" height="4000%" width="4000%" fill="#fff" />')
            console.log(copyEle[0])
            copyEle.each(function (index, node) {
                var parentNode = node.parentNode;
                var svg = node.outerHTML.trim();
                var canvas = document.createElement('canvas');
                canvg(canvas, svg);
                if (node.style.position) {
                    canvas.style.position += node.style.position;
                    canvas.style.left += node.style.left;
                    canvas.style.top += node.style.top;
                }

                nodesToRecover.push({
                    parent: parentNode,
                    child: node
                });
                // parentNode.removeChild(node);

                nodesToRemove.push({
                    parent: parentNode,
                    child: canvas
                });

                $('#divReport').append(canvas);
            });
            html2canvas(document.querySelector("#divReport"), {
                onrendered: function (canvas) {
                    var base64Str = canvas.toDataURL();//base64码，可以转图片

                    //...
                    console.log(base64Str)
                    $('<img>', {src: base64Str}).appendTo($('body'));//直接在原网页显示
                }
            });

            function convertCanvasToImage(canvas) {
                return canvas.toDataURL("image/png");
            }

            $('body').append('<img  src="' + convertCanvasToImage($('canvas')[0]) + '"/>')
        }*/
        var svgHtml = document.getElementById("container").innerHTML.trim()
        console.log(svgHtml)
        var canvasId = document.getElementById("c");
        canvg(canvasId, svgHtml);
    }


}


Node.init({
    canvas: d3.select('svg'),
    nodeList: nodeList,
    nodeWidth: 50,
    vue_setting: Vue_setting,
    onNodeClick: function (d) {
        Vue_setting.isShow = true;
        Vue_setting.clearFormValidate();
    },
    onBeforeLine: function (node) {

        if (!node.data.inputNum) {
            Vue_setting.$message.error('该节点没有输入')
            Node.restLine();
        }
        if (node.nodeInfo.from && node.nodeInfo.from.length >= node.data.inputNum) {
            Vue_setting.$message.error('该节点只能有' + node.data.inputNum + '个输入');
            Node.restLine();
        }


    },
    onDrawLine: function (preNode, nextNode) {
        Node.saveNodeInfo();
        nextNode.data.preId = preNode.nodeInfo.name
        $('#line').removeClass('active');
        if (nextNode.data.typeNo = "semanticAnalysisObject") {
            //寻找上级节点
            var preNode = nodeList[Node.getNodeIndexByName(nodeList, nextNode.data.preId)];
            var dataSourceTypeId = preNode.data.paramArray.filter(_ => {
                return _.inputParamId == 7;
            })[0]
            var sas = Vue_setting.getValueByParamMapId(18);
            Vue_setting._semantic_getList(sas, dataSourceTypeId.value)
        }
    },
    onCreateNode: function (d) {
        Vue_setting.isShow = true;
        Node.saveNodeInfo();
    },
    onDelPath: function () {

    }
});
nodeList = Node.nodeList;

//初始化右键菜单插件
context.init({preventDoublecontext: false});

//绑定节点右键菜单
context.attach('.node', [
    {header: 'Options'},
    {
        text: 'Del', href: '#', action: function (e) {
        let node = d3.select(context.target);
        Node.delNode(node);
    }
    }
]);

//绑定线条右键菜单
context.attach('.line', [
    {header: 'Options'},
    {
        text: 'Del', href: '#', action: function (e) {
        let path = d3.select(context.target);
        Node.delPath(path)
    }
    }
]);

//html5拖拽结束 阻止默认行为
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * html5拖拽
 * @param ev 拖拽的事件对象
 */
function drag(ev) {
    ev.dataTransfer.setData("index", $(ev.target).attr('data-index'));
    ev.dataTransfer.setData("type", $(ev.target).attr('data-type'));
}

/**
 * 从菜单中拖到svg画布的函数
 * @param ev  拖拽的事件对象
 */
function drop(ev) {
    ev.preventDefault();
    //获取拖拽时设置的id属性
    let index = ev.dataTransfer.getData("index");
    let type = ev.dataTransfer.getData("type");
    if (index) {
        let x = Node.computedPosition('x', ev.offsetX - Node.nodeWidth / 2);
        let y = Node.computedPosition('y', ev.offsetY - Node.nodeHeight / 2);

        //记录新增节点
        nodeList.push({
            nodeInfo: {
                x: x,
                y: y,
                type: type
            },
            data: $.extend(true, {}, Vue_nodeList.content[index])
        });
        //在svg上创建对应节点
        Node.createNode();

    }

}

/**
 * 获取地址栏参数
 * @param name
 * @returns {null}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
