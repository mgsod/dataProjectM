/**
 * Created by setting on 2017/9/27 0027.
 */

var app = new Vue({
    el: "#app",
    data: {
        process: [],
        isRequiredError: 0,
        dataSource: [],
        dataSourceType: [],
        modalData: {
            'flowId': "",
            'name': '',
            'typeNo': '',
            'nodeParam': {
                'processType': '',
                'processTypeName': '',
                'datasourceId': '',
                'datasourceName': '',
                'datasourceTypeId': '',
                'datasourceTypeName': '',
                'mappingJson': [
                    {'inputParamId': '', 'fieldId': ''},
                ]
            }
        },
        paramSelect: [],
        param: [],
        output: [],
        isSave: true,
        nodeIndex: -1,
        workFlow: {
            'id': '',
            'templateName': '',
            'workFlowInfoList': []
        }
    },
    methods: {
        //选择抓取方式
        changeProcessType: function () {
            var sourceType = this.modalData.nodeParam.processType;
            this.getDataSourceList(sourceType)
        },
        //选择数据源
        changeDataSource: function () {
            var dataSource = this.dataSource;
            var id = this.modalData.nodeParam.datasourceId;
            for (var i = 0; i < dataSource.length; i++) {
                if (id == dataSource[i].datasourceId) {
                    this.dataSourceType = dataSource[i].datasourceTypes;
                    if (this.dataSourceType.length > 0) {
                        if (this.nodeIndex == -1) {
                            this.modalData.nodeParam.datasourceTypeId = this.dataSourceType[0].typeId
                        }
                        this.changeDataSourceType();
                    } else {
                        this.modalData.nodeParam.datasourceTypeId = '';
                    }
                    break;
                }
            }
        },
        //选择数据源类型
        changeDataSourceType: function () {
            var dataSourceTypeId = this.modalData.nodeParam.datasourceTypeId;
            if (this.nodeIndex == 0) {
                return false;
            }
            var prev;
            if (this.nodeIndex == -1) {
                prev = this.workFlow.workFlowInfoList.length - 1;
            } else {
                prev = this.nodeIndex - 1;
            }
            if (prev < 0) return false;
            var prev_dataSourceTypeId = this.workFlow.workFlowInfoList[prev].nodeParam.datasourceTypeId;
            this.getParamList(dataSourceTypeId);
            this.getOutputList(prev_dataSourceTypeId)
        },
        //添加节点(HTML)
        addNodeTemplate: function () {
            this.nodeIndex = -1;
            if (this.isSave) {
                var template = $('#template').html();
                $('.node-container').append(template);
                this.isSave = false;
            }

        },
        //设置节点(读取节点数据)
        setNode: function (index) {
            this.nodeIndex = index;
            var _this = this;
            var modalData = $.extend(true, {}, this.workFlow.workFlowInfoList[index]);
            this.modalData = modalData;
            this.paramSelect = modalData.nodeParam.mappingJson;
            //var mappingJson = this.modalData.nodeParam.mappingJson;
            /* for (var i = 0; i < _this.paramSelect.length; i++) {
                 if (mappingJson[i]) {
                     _this.paramSelect[i] = mappingJson[i]
                 }
             }*/

            this.changeProcessType()


        },
        //保存节点
        saveNode: function () {
            var _this = this;
            this.checkModalData(function () {
                var dsName = _this.getDataSourceName(_this.modalData.nodeParam.datasourceId);
                var typeName = _this.getDataSourceTypeName(_this.modalData.nodeParam.datasourceTypeId);
                var processName = _this.getprocessTypeName(_this.modalData.nodeParam.processType);
                _this.modalData.nodeParam.mappingJson = _this.paramSelect;
                _this.modalData.nodeParam.datasourceName = dsName;
                _this.modalData.nodeParam.processTypeName = processName;
                _this.modalData.nodeParam.datasourceTypeName = typeName;
                if (_this.nodeIndex == -1) {
                    _this.workFlow.workFlowInfoList.push($.extend(true, {}, _this.modalData));
                } else {
                    _this.workFlow.workFlowInfoList[_this.nodeIndex] = $.extend(true, {}, _this.modalData);
                }

                _this.isSave = true;
                $('#myModal').modal('hide');
                _this.cleanModalData(_this.modalData);
                _this.cleanModalData(_this.paramSelect)
                $('.tip').eq(1).remove();
            })

        },
        //获取数据源名称
        getDataSourceName: function (id) {
            var tempArr = this.dataSource;
            for (var i = 0; i < tempArr.length; i++) {
                if (tempArr[i].datasourceId == id) {
                    return tempArr[i].datasourceName;
                }
            }
        },
        //获取数据源类型名称
        getDataSourceTypeName: function (id) {
            var tempArr = this.dataSourceType;
            for (var i = 0; i < tempArr.length; i++) {
                if (tempArr[i].typeId == id) {
                    return tempArr[i].typeName;
                }
            }
        },
        //获取流程名称
        getprocessTypeName: function (id) {
            var tempArr = this.process;
            for (var i = 0; i < tempArr.length; i++) {
                if (tempArr[i].key == id) {
                    return tempArr[i].value;
                }
            }
        },
        //清除模态框数据
        cleanModalData: function (obj) {
            for (var i in obj) {
                if (typeof  obj[i] == 'object') {
                    this.cleanModalData(obj[i]);
                } else {
                    obj[i] = '';
                }
            }
            return false;
        },
        //选择参数
        selectParam: function (e, index) {
            var $select = $(e.target)
            var paramId;
            paramId = $select.parent().prev().attr('paramId');
            this.paramSelect[index].inputParamId = (paramId);
        },
        //初始化参数列表
        initParamSelect: function (fun) {
            var length = this.param.length;

            if (this.nodeIndex == -1) {
                this.paramSelect = [];
                for (var i = 0; i < length; i++) {
                    this.paramSelect.push({
                        inputParamId: '',
                        fieldId: ''
                    })
                }
            }


            fun && fun()
        },
        //删除节点
        del: function (index) {
            if (index == this.workFlow.workFlowInfoList.length - 1) {
                this.workFlow.workFlowInfoList.pop();
            } else {
                alert('不能从中间删除节点')
            }
        },
        //保存工作流
        saveWorkFlow: function () {
            var _this = this;
            this.checkWorkFLow(function () {
                $.ajax({
                    method: 'POST',
                    contentType: "application/x-www-form-urlencoded",
                    url: '/workFlowTemplate/saveDetail.json',
                    data: {jsonParam: JSON.stringify(_this.workFlow)},
                    success: function (data) {
                        if (data.code == 0) {
                            alert('保存成功')
                            history.go(-1)
                        } else {
                            alert(data.message)
                        }

                    },
                })
            })

        },
        //获取数据源
        getDataSourceList: function (sourceType) {
            var _this = this;
            $.get('/dataSource/getDateSourceTypeList.json', {sourceType: sourceType},
                function (data) {
                    if (data.code == 0) {
                        _this.dataSource = data.data;
                        if (_this.dataSource.length > 0) {
                            if (_this.nodeIndex == -1) {
                                _this.modalData.nodeParam.datasourceId = _this.dataSource[0].datasourceId;
                            }
                        } else {
                            _this.modalData.nodeParam.datasourceId = '';
                            _this.modalData.nodeParam.datasourceTypeId = '';
                            _this.dataSourceType = [];
                        }
                        _this.changeDataSource();

                    }
                }, 'json')
        },
        //获取参数列表
        getParamList: function (dataSourceTypeId) {
            var _this = this;
            $.get('/dataCrawl/getCrawlInputParamList.json', {datasourceTypeId: dataSourceTypeId},
                function (data) {
                    if (data.code == 0) {
                        _this.param = data.data;
                        _this.initParamSelect();
                    }
                }, 'json')
        },
        //获取上一节点输出内容
        getOutputList: function (dataSourceTypeId) {
            var _this = this;
            $.get('/dataSource/getDataSourceTypeRelation.json?', {datasourceTypeId: dataSourceTypeId},
                function (data) {
                    if (data.code == 0) {
                        _this.output = data.data;
                    }
                }, 'json')
        },
        //获取流程方式
        getProcessList: function () {
            var _this = this;
            $.get('/workFlowTemplate/getWorkFlowTypeList.json', function (data) {
                if (data.code == 0) {
                    _this.process = data.data;
                    _this.modalData.nodeParam.processType = _this.process[0].key;
                    _this.getDataSourceList(_this.process[0].key)
                }
            }, 'json')
        },
        //获取流程详情
        getDetail: function (id) {
            var _this = this;
            $.get('/workFlowTemplate/getDetail.json', {workTemplateId: id}, function (data) {
                if (data.code == 0) {
                    _this.workFlow = data.data;
                }
            }, 'json')
        },
        //检查模态框数据
        checkModalData: function (fun) {
            var flag = false;
            var _this = this;
            if (!this.modalData.name) {
                $('#node-name').addClass('error');
                $('.nodeName').removeClass('hidden');
                flag = false;
            } else {
                flag = true;
                $('#node-name').removeClass('error');
                $('.nodeName').addClass('hidden');

                if (!this.modalData.nodeParam.processType) {
                    $('#process').addClass('error');
                    $('.process').removeClass('hidden');
                    flag = false;
                } else {
                    flag = true;
                    $('#process').removeClass('error');
                    $('.process').addClass('hidden');

                    if (!this.modalData.nodeParam.datasourceId) {
                        $('#dataSource').addClass('error');
                        $('.datasourceId').removeClass('hidden');
                        flag = false;
                    } else {
                        flag = true;
                        $('#dataSource').removeClass('error');
                        $('.datasourceId').addClass('hidden');

                        if (!this.modalData.nodeParam.datasourceTypeId) {
                            flag = false;
                            $('#dataSourceType').addClass('error');
                            $('.dataSourceType').removeClass('hidden');
                        } else {
                            flag = true;
                            $('#dataSourceType').removeClass('error');
                            $('.dataSourceType').addClass('hidden');

                            $('tbody select[isRequire="1"]').each(function (k, v) {
                                    if (!$(v).find("option:selected").val()) {
                                        $(v).next().removeClass('hidden');
                                        _this.isRequiredError += 1;
                                    } else {
                                        $(v).next().addClass('hidden');
                                        _this.isRequiredError -= 1;
                                    }
                                }
                            );
                            if (_this.isRequiredError > 0) {
                                flag = false;
                            }
                        }

                    }
                }
            }

            if (flag && fun) fun();
        },
        //检查工作流
        checkWorkFLow: function (fun) {
            if (!this.workFlow.templateName) {
                $('#templateName').addClass('error')
                $('.templateName').removeClass('hidden')
            } else if (this.workFlow.workFlowInfoList.length < 1) {
                $('#templateName').removeClass('error')
                $('.templateName').addClass('hidden')
                alert('请先配置流程节点')
            } else {
                fun()
            }
        }

    },
    mounted: function () {
        //设置模态框点击空白处不关闭
        $('#myModal').modal({backdrop: 'static', keyboard: true});
        var _this = this;
        $('.node-container').on('click', '._setNode', function () {
            //默认选择第一个
            var firstProcessKey = _this.process[0].key
            _this.modalData.nodeParam.processType = firstProcessKey;
            _this.getDataSourceList(firstProcessKey)
        });

        $('.node-container').on('click', '._delNode', function () {
            $(this).parent().remove();
            _this.isSave = true;
        });
        //左侧菜单
        $('#aside_nav>li').click(function(e){
            $(this).addClass('active')
                .siblings()
                .removeClass('active');

        })





    },
    created: function () {

        //给节点的template绑定事件.

        //获取${data}中的id  [编辑时用]
        var data = $('#data').val();
        if (data != "{}") {
            this.getDetail(JSON.parse(data).workFlowTemplateId);
        }
        this.getProcessList();

    }
});
