/**
 * Created by setting on 2017/12/1 0001.
 */
import '../css/etc.scss'
let app = new Vue({
    name: 'Export',
    el: '#app',
    data() {
        //验证taskName
        var validateTaskName = (rule, value, callback) => {
            if (this.form.exportChoice != 'semanticResult') {

                if (!this.tempModel.detailId) {
                    return callback(new Error('请选择任务'))
                } else {
                    callback()
                }
            } else {
                return callback()
            }

        }
        //验证dataWay
        var validateDataWay = (rule, value, callback) => {
            if (this.form.exportChoice == 'orAndAn' || this.form.exportChoice == 'originalData') {
                if (!value) {
                    return callback(new Error('请选择数据方式'))
                } else {
                    return callback()
                }
            } else {
                return callback()
            }
        }
        //验证筛选条件
        var validateFilter = (rule, value, callback) => {
            if (this.form.exportChoice == 'orAndAn' || this.form.exportChoice == 'originalData') {
                let errorCount = 0;
                this.form.fieldAndFilter.map((item, k) => {
                    for (let i in item) {
                        if (!item[i]) {
                            errorCount++;
                        }
                    }
                })
                if (errorCount === 0) {
                    return callback()
                } else {
                    return callback(new Error('请完善筛选条件'))

                }
            } else {
                return callback()
            }
        }
        //验证节点选择
        var validateNode = (rule, value, callback) => {
            if (this.form.exportChoice == 'orAndAn' || this.form.exportChoice == 'originalData') {
                if (this.form.dataWay === 'node') {
                    if (!value) {
                        return callback(new Error('请选择节点'))
                    } else {
                        return callback()
                    }
                } else {
                    return callback()
                }
            } else {
                return callback()
            }
        }

        return {
            loading: true,
            //表单数据
            form: {
                projectId: 234,
                exportType: 'excel',
                fileName: '',
                exportChoice: '',
                exportChoiceCnName: '',
                detailIdArray: [],
                taskNameArray: [],
                dataWay: '',
                nodeTask: '',
                nodeTaskDetailId: '',
                fieldAndFilter: [],
                dataSourceTypeArray: [],
                level: {
                    type: '1,2,3',
                    hierarchy: '1,2,3'
                }
            },
            tempModel: {
                detailId: '',
                selectField: {}

            },
            //导出文件形式
            fileTypeList: [],
            //导出选择
            typeList: [],
            //原始过滤条件
            conditionList: [],
            //过滤exp
            conditionExpList: [],
            //任务列表
            taskNameList: [],
            //已选择的字段
            checkList: [],
            //已选择的level
            checkSentenceList: ['1', '2', '3'],
            checkTopicList: ['1', '2', '3'],
            //数据方式
            dataWay: [
                {name: '结果数据', value: 'result'},
                {name: '节点数据', value: 'node'}
            ],
            //句段文list
            sentenceList: [
                {name: '句级', value: '1'},
                {name: '段级', value: '2'},
                {name: '文级', value: '3'}
            ],
            topicList: [
                {name: '分词', value: '1'},
                {name: '主题', value: '2'},
                {name: '话题', value: '3'}
            ],
            //字段列表
            fieldList: [],
            hasField: false,
            //节点任务下拉框
            nodeList: [],
            //提交loading
            submitLoading: false,
            //表单验证
            rules: {
                fileName: [
                    {required: true, message: '请输入导出文件名', trigger: 'blur'},
                    {pattern: /^[a-zA-Z\u4e00-\u9fa5\d]*$/, message: '只允许输入因为字母,中文和数字', trigger: 'blur'}
                ],
                exportChoice: [
                    {required: true, message: '请选择导出', trigger: 'change'},
                ],
                detailId: [
                    {
                        validator: validateTaskName, trigger: 'change', required: true
                    }
                ],
                dataWay: [
                    {
                        validator: validateDataWay, trigger: 'change', required: true
                    }
                ],
                filter: [
                    {
                        validator: validateFilter, trigger: 'change', required: true
                    }
                ],
                nodeTaskDetailId: [
                    {
                        validator: validateNode, trigger: 'change', required: true
                    }
                ]
            },

        }

    },
    methods: {
        changeTime(value,condition){
            if(typeof value == 'object'){
                condition.conditionValue = (new Date(Date.parse(value[0]))).Format('yyyy-MM-dd hh:mm:ss');
                condition.conditionValue2 = (new Date(Date.parse(value[1]))).Format('yyyy-MM-dd hh:mm:ss');
            }else{
                condition.conditionValue = value;
            }



        },
        submitForm(formName) {

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitLoading = true;

                    //获取选中的值
                    let temp = JSON.parse(JSON.stringify(this.fieldList))
                    temp = temp.filter(item => {
                        item.list = item.list.filter(filed => {
                            return filed.select
                        })
                        return item.list.length > 0
                    })
                    this.form.dataSourceTypeArray = temp;

                    $.post('/projectExport/saveProjectExport.json', {body: JSON.stringify(this.form)}, res => {
                        this.submitLoading = false
                        if (res.code === 0) {
                            this.$confirm('创建成功,是否继续创建?', '提示', {
                                confirmButtonText: '是',
                                cancelButtonText: '否',
                                type: 'success '
                            }).then(() => {
                                location.reload()
                            }).catch(() => {
                                history.go(-1);
                            });


                        } else {
                            this.$message.error(res.message)
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //获取导出形式
        getExportFileTypeList() {
            return $.get('/projectExport/getExportFileTypeList.json', res => {
                if (res.code === 0) {
                    this.fileTypeList = res.data
                }
            })
        },
        //获取导出选择
        getDataTypeList() {
            return $.get('/projectExport/getDataTypeList.json', res => {
                if (res.code === 0) {
                    this.typeList = res.data;
                }
            })
        },
        //获取原始数据查询条件
        getConditionList() {
            return $.get('/projectExport/getConditionList.json', res => {
                if (res.code === 0) {
                    this.conditionList = res.data;
                    /*if(this.form.fieldAndFilter.length > 0){
                        this.form.fieldAndFilter.forEach((item, i) => {
                            this.conditionExpList[i] = this.getConditionExp(item.typeOf)
                        })
                    }*/
                }
            })
        },
        //获取任务名称下拉选项
        getTaskNameList() {
            return $.get('/projectExport/getTaskNameList.json?projectId=' + this.form.projectId + '&exportChoice=' + this.form.exportChoice, res => {
                if (res.code === 0) {
                    /*res.data.unshift({
                        detailId: -1,
                        taskName: '所有'
                    })*/
                    this.taskNameList = res.data;
                }
            })
        },
        //选择原始第一条件(typeOf)
        changeTypeOf(typeOfID, index) {
            this.form.fieldAndFilter[index].conditionExp = null;
            let field = this.getFieldById(typeOfID)
            this.form.fieldAndFilter[index].conditionType = field.fieldType
            this.form.fieldAndFilter[index].filed = field.fieldEnName;
            this.form.fieldAndFilter[index].filedName = field.fieldCnName;
            this.conditionExpList[index] = this.getConditionExp(field.fieldType)
        },
        //根据typeOf获取conditionExp
        getConditionExp(typeOf) {
            for (let i = 0; i < this.conditionList.length; i++) {
                if (this.conditionList[i].typeOf == typeOf) {
                    return this.conditionList[i].conditionExpList;
                }
            }

        },
        //添加条件过滤
        addFilter() {
            this.form.fieldAndFilter.push({
                conditionType: '',
                conditionExp: '',
            })
        },
        //移除条件过滤
        removeFilter(index) {
            this.form.fieldAndFilter.splice(index, 1)
        },
        //改变导出选择
        selectDataType() {
            for (let i = 0; i < this.typeList.length; i++) {
                if (this.typeList[i].key === this.form.exportChoice) {
                    this.form.exportChoiceCnName = this.typeList[i].value;
                    break
                }
            }
            this.getTaskNameList()
        },
        //选择conditionExp
        changeConditionExp(exp, index) {
            this.form.fieldAndFilter[index]['conditionValue'] = ''
            if (exp !== 'between') {
                delete this.form.fieldAndFilter[index]['conditionValue2']
            } else {
                this.form.fieldAndFilter[index]['conditionValue2'] = ''
            }
        },
        //获取字段
        getFieldList() {
            return $.get('/projectExport/getFieldList.json?detailId=' + this.form.detailIdArray.join(',')+'&nodeTaskDetailId='+this.form.nodeTaskDetailId, res => {
                //return $.get('https://easy-mock.com/mock/59f9602d3d31c97b90482dbb/example/test?detailId=' + this.form.detailIdArray.join(','), res => {
                if (res.code === 0) {
                    this.fieldList = res.data;
                    if (this.fieldList.length >= 0) {
                        //默认全选
                        this.fieldList.map(item => {
                            item.list.map(listItem => {
                                listItem.select = true
                                this.checkList.push(listItem.id)
                            })
                        })
                        if (this.checkList.length == 0) {
                            this.hasField = false;
                        } else {
                            this.hasField = true;
                        }
                    }
                }
            })
        },
        //根据id获取字段详细信息
        getFieldById(id) {
            for (let i = 0; i < this.fieldList.length; i++) {
                for (let j = 0; j < this.fieldList[i].list.length; j++) {
                    if (this.fieldList[i].list[j].id === id) {
                        return this.fieldList[i].list[j];
                    }
                }
            }
        },
        //选择字段事件
        checkedField(selected, field, item) {
            field.select = selected;
        },
        //获取节点
        getNodeNameList() {
            return $.get('/projectExport/getNodeNameList.json?detailId=' + this.form.detailIdArray, res => {
                if (res.code === 0) {
                    this.nodeList = res.data;
                }
            })
        },
        //选择任务名称事件
        selectTaskName() {
            this.form.nodeTask = '';
            this.form.nodeTaskDetailId = '';
            this.form.taskNameArray = [];
            this.form.detailIdArray = [];
            for (let i = 0; i < this.taskNameList.length; i++) {
                if (this.tempModel.detailId === -1) {
                    if (this.taskNameList[i].detailId === -1) {
                        continue;
                    } else {
                        this.form.taskNameArray.push(this.taskNameList[i].taskName);
                        this.form.detailIdArray.push(this.taskNameList[i].detailId);
                    }

                } else {
                    if (this.taskNameList[i].detailId === this.tempModel.detailId) {
                        this.form.taskNameArray = [this.taskNameList[i].taskName];
                        this.form.detailIdArray = [this.taskNameList[i].detailId];
                        break;
                    }
                }

            }

            this.getFieldList()
            if (this.tempModel.detailId !== -1) {
                this.getNodeNameList();
            } else {
                this.form.dataWay = 'result'
            }


        },

        //选择节点事件
        selectNode() {
            for (let i = 0; i < this.nodeList.length; i++) {
                if (this.nodeList[i].detailId === this.form.nodeTaskDetailId) {
                    this.taskName = this.nodeList[i].name;
                }
            }
            this.getFieldList();
        },
        changeDataWay(){
            if(this.form.dataWay == 'result'){
                this.form.nodeTaskDetailId = '';
                this.getFieldList();
            }

        },
        //选择文级事件
        checkedLevel(selected, type) {
            let temp = [];
            selected.map(name => {
                temp.push(name)
            });
            this.form.level[type] = temp.join(',')
        },

    },
    mounted() {
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }

        this.form.projectId = getQueryString('projectId') || 234;
        $('body').fadeIn('fast')

        this.getExportFileTypeList().done(() => {
            this.getDataTypeList().done(() => {
                this.getConditionList().done(() => {
                    this.loading = false;

                })
            })
        })
    }

})