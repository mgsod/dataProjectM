/**
 * Created by setting on 2017/12/1 0001.
 */
import '../css/etc.scss'

let app = new Vue({
        el: '#app',
        name: 'app',
        data: {
            tableLoading:true,
            form: {
                page: 1,
                size: 10,
                fileName: '',
                exportDataType: '',
                status: '',
                projectId: '',
                projectType: 'page',
                createTime: ''
            },
            dataTypeList: [],
            tableList: [],
            count: 0,
            selection: [],
            projectName: '',
            processList: {
                '':'全部',
                1: '进行中',
                2: '完成',
                9: '异常'
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            downLoadUrl:''

        },
        methods: {
            //创建导出
            toCreate() {
                location.href = '/projectExport/createExport.html?projectId=' + this.form.projectId
            },
            //获取导出类型列表
            getDataTypeList() {
                $.get('/projectExport/getDataTypeList.json', res => {
                    if (res.code === 0) {
                        this.dataTypeList = res.data;
                        this.dataTypeList.push({
                            key:'',
                            value:'全部'

                        })
                    }
                })
            },
            //列表过滤
            getProjectExportList() {
                this.tableLoading = true;
                $.get('/projectExport/getProjectExportList.json', this.form, res => {
                    if (res.code === 0) {
                        if (res.data.projectList) {
                            this.tableList = res.data.projectList;
                            this.count = res.data.count
                        }
                        this.tableLoading = false;
                    }
                })
            },
            //更改每页显示条数
            sizeChange(size) {
                this.form.size = size;
                this.getProjectExportList()
            },
            //翻页
            pageChange(page) {
                this.form.page = page;
                this.getProjectExportList()
            },
            //表格项选择事件
            handleSelectionChange(selected) {
                this.selection = selected;
            },
            //删除
            del(id) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    $.get('/projectExport/deleteExportTask.json', {id: id.join(',')}, res => {
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getProjectExportList();
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch(() => {

                });

            },
            //再次执行
            reExec(id) {
                $.post('/projectExport/startProjectExport.json', {projectExportTaskId: id}, res => {
                    if (res.code === 0) {
                        this.$message.success('启动成功');
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            downLoad(id) {
                $.get('/projectExport/downloadTask.json?id=' + id, res => {
                    if(res.code === 0){
                        this.downLoadUrl = res.data.url+'?t='+Date.parse(new Date())
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            exportType(val){
                return  this.dataTypeList.filter(item =>{
                    return item.key == val;
                })[0]['value']
            }


        },
        mounted() {
            function getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = decodeURIComponent(window.location.search).split('?')[1];
                r = r ? r.match(reg) : null;
                if (r != null) return unescape(r[2]);
                return null;
            }

            this.form.projectId = getQueryString('projectId');
            this.projectName = getQueryString('name')

            this.getDataTypeList();
            this.getProjectExportList();
            $('body').fadeIn('fast')
        },
        filters: {
            processFilter(val) {
                let proObj = {
                    0: '待启动',
                    1: '启动中',
                    2: '已完成',
                    4: '停止',
                    9: '异常'
                }
                return proObj[val]
            }
        },
        computed: {
            selectionList: function () {
                console.log(111)
                return this.selection.map(item => {
                    return item.id
                })
            }
        }
    }
)