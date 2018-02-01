import '../../generalExport/css/etc.scss'

let app = new Vue({
    name: 'Export',
    el: '#app',
    data() {
        // 验证typeNo
        var validateTypeNo = (rule, value, callback) => {
            if (value == '') {
                return callback(new Error('请选择节点'))
            } else {
                return callback()
            }
        }
        //验证筛选条件
        var validateFilter = (rule, value, callback) => {
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
        }
        return {
            loading: true,
            //表单数据
            form: {
                projectId: '',
                exportType: 'excel',
                fileName: '',
                fieldList: [],
                typeNo: [],
                detailTask: '',
                storageTypeTable: '',
                fieldAndFilter: [],
            },
            fieldList: [],
            //文件导出类型list
            fileTypeList: [],
            //已选择的字段
            checkList: [],
            //节点类型list
            detailTypeList: [],
            //节点任务list
            detailTaskList: [],
            //原始过滤条件
            conditionList: [],
            conditionExpList: [],
            //提交loading
            submitLoading: false,
            rules: {
                fileName: [
                    {required: true, message: '请输入导出文件名', trigger: 'blur'},
                    {pattern: /^[a-zA-Z\u4e00-\u9fa5\d]*$/, message: '只允许输入因为字母,中文和数字', trigger: 'blur'}
                ],
                typeNo: [
                    {
                        validator: validateTypeNo, trigger: 'change', required: true
                    }
                ],
                detailTask: [
                    {required: true, message: '请选择节点任务', trigger: 'change'},
                ],
                filter: [
                    {
                        validator: validateFilter, trigger: 'change', required: true
                    }
                ],
            }
        }
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
            this.getDetailType().done(() => {
                this.getConditionList().done(() => {

                    this.loading = false;
                })
            })
        })

        $('body').fadeIn('fast')
    },
    methods: {
        changeTime(value, condition) {
            if (typeof value == 'object') {
                condition.conditionValue = (new Date(Date.parse(value[0]))).Format('yyyy-MM-dd hh:mm:ss');
                condition.conditionValue2 = (new Date(Date.parse(value[1]))).Format('yyyy-MM-dd hh:mm:ss');
            } else {
                condition.conditionValue = value;
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitLoading = true;

                    // //获取选中的值
                    // let temp = JSON.parse(JSON.stringify(this.fieldList))
                    // temp = temp.filter(item => {
                    //     item.list = item.list.filter(filed => {
                    //         return filed.select
                    //     })
                    //     return item.list.length > 0
                    // })sdf
                    // this.form.dataSourceTypeArray = temp;

                    $.post('/visWorkFlow/addVisWorkFlowProjectExportTask.json', {body: JSON.stringify(this.form)}, res => {
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
        selectDataType(item) {

        },
        //获取节点类型
        getDetailType() {
            return $.get('/visWorkFlow/getExportDetailType.json?projectId=' + this.form.projectId, res => {
                if (res.code === 0) {
                    this.detailTypeList = res.data;
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
        //获取字段
        getFieldList() {
            return $.get('/visWorkFlow/getWorkFlowDetailOutputField.json?flowDetailId=' + this.form.detailTask, res => {
                if (res.code === 0) {
                    this.fieldList = res.data;
                    this.form.storageTypeTable = this.fieldList[0].storageTypeTable
                }
            })
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
        //根据typeOf获取conditionExp
        getConditionExp(typeOf) {
            for (let i = 0; i < this.conditionList.length; i++) {
                if (this.conditionList[i].typeOf == typeOf) {
                    return this.conditionList[i].conditionExpList;
                }
            }

        },
        //获取节点任务
        getDetailTask() {
            return $.get('/visWorkFlow/getVisWorkFlowExportDetailTask.json?projectId=' + this.form.projectId + "&typeNo=" + this.form.typeNo.value, res => {
                if (res.code === 0) {
                    this.detailTaskList = res.data;
                }
            })
        },
        //选择节点类型事件
        selectType() {
            this.form.detailTask = '';
            this.getDetailTask();
        },
        //选择任务名称事件
        selectTaskName() {
            this.getFieldList();
        },
        //选择字段事件
        checkedField(selected, field) {
            field.select = selected;
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
        //选择原始第一条件(typeOf)
        changeTypeOf(id, index) {
            console.log(id)
            let item = this.fieldList.filter(item => {
                return item.id === id;
            })[0];

            this.form.fieldAndFilter[index].conditionExp = null;
            this.form.fieldAndFilter[index].conditionType = item.filedType;
            this.form.fieldAndFilter[index].filedId = item.filedId;
            this.form.fieldAndFilter[index].filed = item.filedEnName;
            this.form.fieldAndFilter[index].filedName = item.filedCnName;
            this.conditionExpList[index] = this.getConditionExp(item.filedType)
        },
    }
})