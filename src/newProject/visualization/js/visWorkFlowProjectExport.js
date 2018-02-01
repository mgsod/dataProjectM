import '../../generalExport/css/etc.scss'

new Vue({
    el: "#app",
    data(){
        return {
            form:{
                fileName:"",
                typeNo:"",
                projectId: '',
                createTime:"",
                status:"",
                page: 1,
                size: 10,

            },
            dataTypeList: [],
            selection: [],
            tableLoading:false,
            tableList:[],
            projectName: '',
            count: 0,
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
            downLoadUrl:'',
        }
    },
    methods:{
        toCreate(){
            location.href = '/visWorkFlow/toCreateVisWorkFlowProjectExport.html?projectId=' + this.form.projectId
        },
        //获取节点类型列表
        getDataTypeList(){
            $.get('/visWorkFlow/getExportDetailType.json?projectId='+ this.form.projectId, res => {
                if (res.code === 0) {
                    this.dataTypeList = res.data;
                    this.dataTypeList.push({
                        key:'全部',
                        value:''

                    })
                }
            })
        },
        //列表过滤
        getProjectExportList() {
            this.tableLoading = true;
            $.post('/visWorkFlow/getVisWorkFlowProjectExportList.json', this.form, res => {
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
        $('body').fadeIn('fast');
    },
    computed: {
        selectionList: function () {
            console.log(111)
            return this.selection.map(item => {
                return item.id
            })
        }
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
})