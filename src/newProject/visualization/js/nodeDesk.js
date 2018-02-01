/**
 * Created by setting on 2017/10/31 0031.
 */
let Node = require('./node.js');
import '../css/node_etc.css';

const action = getQueryString('action');
const projectId = getQueryString('projectId');
const templateId = getQueryString('templateId');
const freemarkerPath = $("#freemarkerPath").val()
let nodeList = [];//节点集合
//左侧面板
let Vue_nodeList = new Vue({
    name: 'nodeList',
    el: '#NodeList',
    data: {
        NodeList: {
            categoryList: [
                {id: 1, name: "输入"},
                {id: 2, name: "分析"},
            ],
            nodeList: []
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
//右侧面板
let Vue_setting = new Vue({
    name: 'nodeSetting',
    el: '#setting',
    data: {
        formName: 'form',
        type: 0,
        first: false,
        dialogVisible: false,
        setting: {},
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
            value: 1,
            __s: [],
            __m: [],
            __h: [],
            __d: [],
            __M: [],
            __w: [],
        },
        activeTabs: 's',
        dataList: [],
        count: 0,
        titleList: [],
        tableForm: {
            currentPage: 1,
            lastIndexId: "",
            projectId: projectId,
            size: 15
        },
        tableLoading: false,
        nodeTableData:{
            page:1,
            size:14,
            projectId: projectId,
            flowDetailId: "",
            flag:"",
            lastIndexId:""
        }
    },
    methods: {
        //面板开关
        toggle: function () {
            this.isShow = !this.isShow;
        },
        //同步节点名称
        setName: function (name) {
            Node.canvas.select('#' + Node.currentNode.nodeInfo.name)
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
            this.active_index = id;
            if (id == 2) {
                this.getDataList()
            }
        },
        //获取节点查看数据
        getDataList() {
            this.tableLoading = true;
            let flowDetailId = this.setting[this.type].flowDetailId;
            this.nodeTableData.flowDetailId = flowDetailId
            $.post('/visWorkFlow/getWorkFlowNodeData.json',this.nodeTableData , res => {
                if (res.code === 0) {
                    this.dataList = res.data.dataList;
                    this.count = parseInt(res.data.count);
                    this.titleList = res.data.titleList;
                } else {
                    this.$message.error(res.message)
                }
                this.tableLoading = false;
            })
        },
        handleSizeChange(page) {
        },
        handleCurrentChange(page) {
            let flag = this.nodeTableData.page - page > 0 ? 'pre' : 'next';
            let id_index = this.titleList.indexOf('indexId');
            let length = this.dataList.length;
            let lastIndexId  = flag === 'next' ? this.dataList[length-1][id_index] : this.dataList[0][id_index];
            this.nodeTableData.lastIndexId = lastIndexId;
            this.nodeTableData.flag = flag;
            this.nodeTableData.page = page;

            this.getDataList();
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
            let preId = item.preId;
            if (preId) {
                let preNode = nodeList[Node.getNodeIndexByName(nodeList, preId)];
                return preNode
            }
        },
        submitForm(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    //alert('submit!');
                    this.setting[this.type].isSave = true;
                } else {
                    this.setting[this.type].isSave = false;
                    this.$notify.error('error submit!!');
                    return false;
                }
            });
        },
        clearFormValidate() {
            if (this.$refs['form']) this.$refs['form'].clearValidate();

        },
        //删除节点
        delNode() {
            //删除一个节点(Node.delNode())必传参数为欲删除的节点对象(d3)
            //由于属性面板中的删除按钮无法获得鼠标点击的对象 所以通过Node.currentNode(当前选中的节点)来获取name
            //画布中的节点id = 节点的name 所以用d3.select('#'+name) 即可拿到当前欲删除的节点对象
            //然后调用Node.delNode();
            let nodeName = Node.currentNode.nodeInfo.name;
            let node = d3.select('#' + nodeName);
            Node.delNode(node)
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
                    let nextItem = this.getWidgetByParamId(this.setting[this.type], id);
                    nextItem.requestUrl = nextItem.requestUrl.replace(reg, itemEnName + '=' + itemValue);
                    if (!index) {
                        this.getSelectList(nextItem.requestUrl, nextItem, _ => {
                            nextItem.value = "";
                        })
                    }
                })
            }

            if (this.type == "dataCrawl" && item.paramEnName == "datasourceTypeId") {
                //设置抓取频次
                this.$set(item.config, 'frequency', JSON.parse(JSON.stringify(this.frequency)))
                //设置节点映射
                let mapNode = this.getWidgetByParamEnName(this.setting[this.type], 'mappingJson');//寻找映射表的节点
                let mapNodeUrls = mapNode.requestUrl.split(',');
                //寻找上级抓取节点数据源id
                let preId = this.setting[this.type].preId

                if (preId) {
                    let preNode = nodeList[Node.getNodeIndexByName(nodeList, preId)];
                    let perNode_dataSourceType = preNode.data.paramArray.filter(kj => {
                        return kj.paramEnName == "datasourceTypeId";
                    })[0];

                    let preNodeDataSourceTypeId = perNode_dataSourceType.value
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
        getWidgetByParamId(node, paramMapId) {
            return node.paramArray.filter(item => {
                return item.inputParamId == paramMapId
            })[0]
        },
        //根据paramEnName获取控件
        getWidgetByParamEnName(node, paramEnName) {
            return node.paramArray.filter(item => {
                return item.paramEnName == paramEnName
            })[0]
        },
        //导入节点 文件上传触发
        triggerUpFile() {
            $('#dataImport_input_file').trigger('click')
        },
        //导入节点 选择文件事件
        dataImport_fileChange(e, item) {
            let value = e.target.value;
            let pos = value.lastIndexOf("\\");
            this.$set(item, 'fileName', (value.substring(pos + 1)))

        },
        //导入节点上传文件事件
        submitUpload(item) {
            let dataSourceId = this.getWidgetByParamEnName(this.setting[this.type], 'typeName').value
            let formData = new FormData();
            let file = document.getElementById('dataImport_input_file').files[0];
            formData.append('file', file);
            $.ajax({
                url: item.requestUrl + '?id=' + dataSourceId,
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.code === 0) {
                        let fieldAnnotationObj = {};
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
            let tempArr = [];
            let list = item.config.tempFieldList;
            for (let i in list) {
                if (list[i] != "") {
                    tempArr.push(list[i])
                }
            }
            item.config.selects = tempArr

        },
        //导入节点数据整理
        _dataImport_getMapTableData(item) {
            //文件上传控件
            let widget_file = this.getWidgetByParamEnName(item, 'url');
            let widget_originRelation = this.getWidgetByParamEnName(item, 'origainRelation');

            if (!widget_file.config) return false;
            let mappingList = widget_file.config.tempFieldList;
            let newMapping = [];
            for (let i in mappingList) {
                newMapping.push({
                    key: mappingList[i],
                    value: i
                })
            }
            widget_originRelation.value = newMapping
        },

        //抓取节点 文件上传触发
        _dataCrawl_fileTrigger() {
            $('#_dataCrawl_inputFile').trigger('click')
        },
        //选择文件
        _dataCrawl_fileChange(e, prop) {
            let value = e.target.value;
            let pos = value.lastIndexOf("\\");
            this.$set(prop, 'fileName', (value.substring(pos + 1)));

            //立即上传
            let formData = new FormData();
            let file = document.getElementById('_dataCrawl_inputFile').files[0];
            formData.append('file', file);
            $.ajax({
                url: "/dataCrawl/uploadFile.json",
                method: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.code === 0) {
                        let obj = {
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
            let getSel = (arr => {
                return arr.join(',');
            })
            let CronArr = frequency.Cron.split(' ');
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
            let widget_dataSourceType = this.getWidgetByParamEnName(item, 'datasourceTypeId')
            //对应数据源类型id的动态控件
            if (!widget_dataSourceType.config) return false;
            let prop = widget_dataSourceType.config.list.filter(_prop => {
                return _prop.datasourceTypeId == widget_dataSourceType.value;
            })[0];
            //获取填入值
            let widget_inputParamArray = this.getWidgetByParamEnName(item, 'inputParamArray');
            //设置填入
            widget_inputParamArray.value = prop.inpuutParam


        },
        //抓取节点 整理抓取频次
        _dataCrawl_frequency(item) {
            //数据源类型控件
            let widget_dataSourceType = this.getWidgetByParamEnName(item, 'datasourceTypeId');

            if (!widget_dataSourceType.config) return false;
            let Corn = this.getCron(widget_dataSourceType.config.frequency);

            //抓取频次控件
            let widget_frequency = this.getWidgetByParamEnName(item, 'crawlFreq')
            widget_frequency.value = Corn;
        },
        //抓取节点 映射表数组整理
        _dataCrawl_getMapTableData(item) {
            let widget_map = this.getWidgetByParamEnName(item, 'mappingJson')
            let temp = [];
            if (!widget_map.config) return false
            widget_map.config.param.map(p => {
                temp.push({
                    "inputParamId": p.id,
                    "fieldId": p.value
                })
            })
            widget_map.value = temp;
        },

        /* _dataCrawl_save() {
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

        },*/
        //分析对象数据整理
        _semantic_getData(item) {
            let widget_sas = this.getWidgetByParamEnName(item, 'analysisObject');
            if (!widget_sas.config) return false;
            let sasArr = widget_sas.config.sas;
            let temp = [];
            sasArr.map(sa => {
                temp.push({
                    contentType: sa.contentType,
                    subType: sa.subType,
                    value: sa.value
                })
            })
            widget_sas.value = temp;
        },
        //分词节点获取词库
        _word_getLibrary(item) {
            this.$set(item, 'loading', true)
            $.get(item.requestUrl, res => {
                if (res.code === 0) {
                    item.config || this.$set(item, 'config', {});
                    this.$set(item.config, 'list', res.data);
                    this.$set(item.config, 'selectList', [])
                    this.$set(item.config, 'show', false)
                    this.$set(item, 'loading', false)
                }
            })
        },
        //分词节点词库选择
        _word_selectLibrary(selection, item) {
            let temp = [];
            selection.map(sel => {
                let arr = sel.split('|');
                temp.push({
                    type: arr[1],
                    name: arr[0]
                })
            })
            this.$set(item, 'value', temp)

        },
        //获取上节点输出 本节点输出
        _getPreNodeOutput(item, typeNo, dataSourceType) {
            $.get(item.requestUrl, {typeNo: typeNo, dataSourceTypeId: dataSourceType}, res => {
                if (res.code === 0) {
                    if (!item.config) this.$set(item, 'config', {});
                    this.$set(item.config, 'list', res.data)

                    if (item.paramEnName == 'analysisObject') {
                        this.$set(item.config, 'sas', [{subType: 1, value: "", contentType: ""}])
                    }
                    if (item.paramEnName == 'field') {
                        this.$set(item.config, 'selection', [])
                    }

                }
            })

        },
        //话题分析 数据整理
        _topic_getData(item) {
            //获取抓取频次控件
            let widget = this.getWidgetByParamEnName(item, 'startFreqTypeName');
            let cron = this.getCron(widget.config.frequency);
            widget.value = cron;
        },
        //主题分析 获取主题树
        _theme_getTheme(item) {
            let treeSetting = {
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
                            let themeArea = Vue_setting.getWidgetByParamEnName(Vue_setting.setting[Vue_setting.type], 'subjectAresName');


                            Vue_setting.$set(themeArea, 'value', node.name)
                            Vue_setting.$set(themeArea.config, 'names', node.name)
                            let theme = Vue_setting.getWidgetByParamEnName(Vue_setting.setting[Vue_setting.type], 'subjectNames');
                            let lexContext = node.lexContextPOList;
                            let [ids, names] = [[], []];
                            lexContext.map(({id, name}) => {
                                ids.push(id);
                                names.push(name);
                            })
                            Vue_setting.$set(theme, 'value', names.join(','))
                            Vue_setting.$set(theme, 'config', theme.config || {})
                            Vue_setting.$set(theme.config, 'names', names)
                        }
                    }
                },
                view: {
                    fontCss: function (treeId, treeNode) {
                        return treeNode.projectPO !== null ? {color: "red"} : {}
                    }
                }
            };

            //请求主题树
            let widget = this.getWidgetByParamEnName(this.setting[this.type], 'subjectAresName');
            this.$set(item, 'loading', true)
            $.get(widget.requestUrl, res => {
                if (res.code === 0) {
                    widget.config || this.$set(widget, 'config', {});
                    this.$set(widget.config, 'list', res.data);
                    //初始化主题树
                    $.fn.zTree.init($("#tree"), treeSetting, res.data);
                    this.$set(item, 'loading', false)
                }
            })
        },
        //选择结果策略
        _theme_changeResult(item, r) {
            let resultsStrategyType = item.config.resultsStrategyType;
            let resultsStrategyTypeValue = item.config.resultsStrategyTypeValue;
            this.$set(item, 'value', ({resultsStrategyType, resultsStrategyTypeValue}))
            if (r) {
                item.config.resultsStrategyTypeValue = '0';
            }

        },
        //数据输出 选择字段
        _output_SelectField(selection, item) {
            this.$set(item, 'value', selection.join(','))
        },
        //数据输出 push频率数据整理
        _output_getData(item) {
            let widget = this.getWidgetByParamEnName(item, 'PushFrequency');
            let {type, value} = widget.config;
            this.$set(widget, 'value', value + type)
        }


    },
    watch: {
        //深度watch 更新节点名称到视图
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
//顶部head
let Vue_head = new Vue({
    name: "head",
    el: "#head",
    data() {
        let time = (rule, value, callback) => {
            if (value) {
                return callback()
            }
            callback(new Error('请选择起止时间'))
        }
        return {
            canvasLoading: false,
            canvasLoading_text: "加载中...",
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
            action: action,
            //保存项目/模板的form表单
            form: {
                projectId: projectId,
                templateId: templateId,
                nodeList: []
            },
            //编辑项目/模板信息的form表单
            editForm: {
                projectId: projectId,
                projectName: '',
                projectDescribe: '',
                managerId: "",
                customerId: '',
                startTime: "",
                endTime: '',
                workFlowTemplateId: '',
                typeId: '1',
                projectType: "vis",
                time: '',
                templateName: "",
                templateId: templateId
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
                    {required: true, message: '请选择项目经理', trigger: 'change', pattern: /./},
                ],
                customerId: [
                    {required: true, message: '请选择客户', trigger: 'change', pattern: /./},
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
        //点击编辑
        editProject() {
            //如果是模板 编辑的时候不需要请求客户和经理列表
            if (action != 'template') {
                this.getCustomerList();
                this.getManagerList();
            }
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
                    for (let i in res.data) {
                        this.editForm[i] = res.data[i];
                    }
                    this.editForm.time = [this.editForm.startTime, this.editForm.endTime,]
                }
            })
        },
        //获取节点信息
        getNodeList() {
            this.canvasLoading = true;
            this.canvasLoading_text = "加载中";
            $.get('/visWorkFlow/getProjectWorkFlowNodeInfo.json', {
                    projectId: projectId,
                    templateId: templateId
                },
                res => {
                    if (res.code === 0) {
                        console.log(res.data)
                        nodeList = res.data.nodeList;
                        nodeList.map(item => {
                            item.data.paramArray.map(p => {
                                p.config = JSON.parse(p.config)
                            })
                        })
                        Node.reappear(nodeList);
                    }
                    this.canvasLoading = false;
                })
        },
        //保存项目/模板
        saveProject() {
            this.canvasLoading = true;
            this.canvasLoading_text = "保存中";
            this.form.nodeList = this.getSaveNodeListData();
            let saveUrl = action == 'template' ? '/workFlowTemplate/saveWorkFlowTemplateNodeInfo.json' : '/visWorkFlow/savetWorkFlowProjectNodeInfo.json';
            if (action == 'template') {
                getSvgBase64((base64) => {
                    let templateForm = this.form;
                    templateForm.file = base64;
                    $.post(saveUrl, {body: JSON.stringify(templateForm)}, this.saveSuccessCallback)

                })
            } else {
                $.post(saveUrl, {body: JSON.stringify(this.form)}, this.saveSuccessCallback)
            }

        },
        //连线
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
        //选择时间
        selectTime(val) {
            if (val) {
                this.form.startTime = val[0];
                this.form.endTime = val[1];
            }
        },
        //编辑更新项目基本信息
        saveProjectBaseInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let requestUrl = action == 'template' ? '/visWorkFlow/saveOrUpdateVisTemplate.json' : '/visWorkFlow/saveOrUpdateProject.json';
                    let saveAsUrl = '/visWorkFlow/savaCopyVisWorkFlowProject.json';
                    this.editForm.templateName = this.editForm.workFlowTemplateName
                    if (!this.isSaveAs) {
                        //编辑基本项目信息
                        $.post(requestUrl, this.editForm, res => {
                            if (res.code === 0) {
                                this.$message.success('更新成功');
                                this.editProjectDialog = false;
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                    } else {
                        this.isSaveAs = false;
                        this.canvasLoading = true;
                        this.canvasLoading_text = "另存中...";
                        //另存
                        let projectForm = this.editForm;
                        this.form.nodeList = this.getSaveNodeListData();
                        projectForm.body = JSON.stringify(this.form);
                        $.post(saveAsUrl, projectForm, res => {
                            if (res.code === 0) {
                                this.$message.success('另存成功');

                            } else {
                                this.$message.error(res.message)
                            }
                            this.canvasLoading = false;
                            this.editProjectDialog = false;
                        })
                    }

                } else {
                    return false;
                }
            });
        },
        //另存为
        saveAs() {
            this.editProject();
            this.isSaveAs = true;
        },
        //获取模板信息
        getTemplateInfo() {
            $.get('/workFlowTemplate/updateVisWorkFlowTemplate.json?templateId=' + templateId, res => {
                if (res.code === 0) {
                    this.editForm.workFlowTemplateName = res.data.name
                }
            })
        },
        //保存项目/模板成功的回调函数
        saveSuccessCallback(res, a) {
            this.canvasLoading = false;
            if (res.code === 0) {
                let detailIds = res.data;
                detailIds.map(({nodeId, detailId, paramArray}) => {
                    let node = nodeList[Node.getNodeIndexByName(nodeList, nodeId)];
                    node.data.flowDetailId = detailId;
                    paramArray.map(({inputParamId, paramId}) => {
                        let widget = Vue_setting.getWidgetByParamId(node.data, inputParamId);
                        widget.paramId = paramId
                    })

                })
                Vue_setting.$message.success('保存成功');
                if (this.isLeave) {
                    if(action == 'template'){
                        location.href = '/workFlowTemplate/toVisWorkFlowTemplateList.html';
                    }else{
                        location.href = '/project/projectListPage.html?type=vis';
                    }
                }
            } else {
                Vue_setting.$message.error(res.message)
            }

        },
        //返回
        goBack() {
            this.$confirm('离开前是否保存对该项目的更改?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                this.isLeave = true;
                this.saveProject();

            }).catch(() => {
                if(action == 'template'){
                    location.href = '/workFlowTemplate/toVisWorkFlowTemplateList.html';
                }else{
                    location.href = '/project/projectListPage.html?type=vis';
                }

            });
        },
        //提交前整理nodeList数据
        getSaveNodeListData() {
            nodeList.map(item => {
                item.froms = item.nodeInfo.from || null;
                item.tos = item.nodeInfo.to || null;
                item.nodeId = item.nodeInfo.name;
                switch (item.data.typeNo) {
                    case "dataImport":
                        Vue_setting._dataImport_getMapTableData(item.data);
                        break;
                    case "dataCrawl":
                        Vue_setting._dataCrawl_dynaData(item.data);
                        Vue_setting._dataCrawl_frequency(item.data);
                        Vue_setting._dataCrawl_getMapTableData(item.data);
                        break;
                    case "semanticAnalysisObject":
                        Vue_setting._semantic_getData(item.data)
                        break;
                    case "topicAnalysisDefinition":
                        Vue_setting._topic_getData(item.data);
                        break;
                    case "dataOutput":
                        Vue_setting._output_getData(item.data);
                        break;
                }
            });
            return nodeList;
        }


    },
    mounted: function () {
        //获取项目基本信息
        projectId && this.getProjectBaseInfo();
        //获取模板基本信息
        templateId && this.getTemplateInfo()
        this.getNodeList();

    }
})

//svg转canvas转base64
function getSvgBase64(callback) {
    let svgHtml = document.getElementById("container").innerHTML.trim()
    let canvasId = document.getElementById("c");
    canvg(canvasId, svgHtml, {
        useCORS: true, //允许跨域
        renderCallback: function () {
            let url = canvasId.toDataURL('image/png');
            callback(url)
        }
    });

}

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

    //初始化右键菜单插件
    context.init({preventDoublecontext: false});

    //绑定节点右键菜单
    context.attach('.node', [
        {header: '选项'},
        {
            text: '删除该节点', href: 'javascript:void(0);', action: function (e) {
            let node = d3.select(context.target);
            Node.delNode(node);
        }
        }
    ]);

}

/**
 * 初始化画布 [具体函数属性请看node.js]
 */
Node.init({
    canvas: d3.select('svg'),
    nodeList: nodeList,
    nodeWidth: 50,
    path: freemarkerPath,
    vue_setting: Vue_setting,
    onNodeClick: function (d) {
        Vue_setting.isShow = true; //弹出属性面板
        Vue_setting.clearFormValidate(); //清楚之前的表单验证结果

        if (d.data.typeNo == 'topicAnalysisDefinition') {
            //设置默认值
            initConfig('startFreqTypeName', 'frequency', JSON.parse(JSON.stringify(Vue_setting.frequency)))
        }
        if (d.data.typeNo == 'themeAnalysisSetting') {
            //设置默认值
            initConfig('resultsStrategyType', 'resultsStrategyType', '1', 'resultsStrategyTypeValue', '0')
        }
        if (d.data.typeNo == 'dataOutput') {
            //设置默认值
            initConfig('apiType', 'list', ['Json', 'Xml']);
            initConfig('PushFrequency', 'list', [
                {key: "每小时", value: "h"},
                {key: "每天", value: "d"},
                {key: "每月", value: "m"},
            ], 'type', "h", 'value', "1");

        }
        if (Vue_setting.active_index == 2) {
            Vue_setting.getDataList();
        }


        //初始化指定控件的config 第一个参数为控件名称
        //气候参数成对出现 奇数为key 偶数为value 依次循环
        function initConfig(widgetName, ...keyValues) {
            //获取控件名
            let widget = Vue_setting.getWidgetByParamEnName(d.data, widgetName);
            if (!widget.config) {
                Vue_setting.$set(widget, 'config', {})
                keyValues.map((item, i) => {
                    if (i % 2 == 0) {
                        Vue_setting.$set(widget.config, keyValues[i], keyValues[i + 1])
                    }
                })
            }
        }
    },
    onBeforeLine: function (node) {
        //连线前限制逻辑
        if (!node.data.inputNum) {
            Vue_setting.$message.error('该节点没有输入')
            Node.restLine();
        } else if (node.nodeInfo.from && node.nodeInfo.from.length >= node.data.inputNum) {
            Vue_setting.$message.error('该节点只能有' + node.data.inputNum + '个输入');
            Node.restLine();
        } else if (!Node.selectedNodeData.data.isSave) {
            Vue_setting.$message.error('起始节点未保存!');
            Node.restLine();
        }

    },
    onDrawLine: function (preNode, nextNode) {
        //设置下节点的preId = 上节点的name
        nextNode.data.preId = preNode.nodeInfo.name

        $('#line').removeClass('active');

        //连线时需要对下节点的指定控件设置值并请求数据
        let typeNo_objName = {
            'semanticAnalysisObject': 'analysisObject',
            'wordSegmentation': 'wordSegmentationObject',
            'topicAnalysisDefinition': 'topicAnalysisDefinitionObject',
            'themeAnalysisSetting': 'themeAnalysisSettingObject',
            'dataOutput': "field"
        }
        if (nextNode.data.jobTypeCategoryId == '2' || nextNode.data.typeNo == 'dataOutput') {
            setNextNodeInput(typeNo_objName[nextNode.data.typeNo]);
        }
        if (nextNode.data.typeNo == 'dataCrawl') {
            let nextWidget = Vue_setting.getWidgetByParamEnName(nextNode.data, 'datasourceTypeId');
            Vue_setting.$set(nextWidget, 'value', '')
        }

        //设置下个节点控件的输入参数
        function setNextNodeInput(widgetName) {
            let nextWidget = Vue_setting.getWidgetByParamEnName(nextNode.data, widgetName); //获取控件名称
            //获取上节点数据源类型
            let preWidget_dataSourceTypeId = preNode.data.paramArray.filter(_ => {
                return _.paramEnName == 'datasourceTypeId';
            })[0];
            let dataSourceTypeId = preWidget_dataSourceTypeId ? preWidget_dataSourceTypeId.value : ''
            //传入下节点控件,上节点类型,数据源类型id 请求数据
            Vue_setting._getPreNodeOutput(nextWidget, preNode.data.typeNo, dataSourceTypeId);
        }


    },
    onCreateNode: function (d) {
        Vue_setting.isShow = true;
        Node.saveNodeInfo();
    },
    onDelNode: function () {
        Vue_setting.isShow = false;
        Vue_setting.type = '';
    }
});


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
        Node.nodeList = nodeList;
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
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
