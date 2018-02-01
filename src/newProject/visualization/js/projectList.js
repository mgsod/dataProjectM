/**
 * Created by setting on 2017/11/16 0016.
 */
import '../../generalExport/css/etc.scss'

var vm = new Vue({
    el: "#app",
    data: {
        form: {
            managerId: '',
            customerId: '',
            status: '',
            type: "",
            sortStatus: 'id desc',
            page: 1,
            size: 10,
            projectType: 'vis'
        },
        managerList: [],
        customerList: [],
        projectList:[],
        loading:false,
        typeList: [
            {key: '', value: '全部'},
            {key: '3', value: '日报'},
            {key: '2', value: '周报'},
            {key: '1', value: '月报'},
            {key: '4', value: '临时项目'}
        ],
        statusList: [
            {k: "", v: '全部'},
            {k: '3', v: '进行中'},
            {k: '5', v: '已完成'},
            {k: '2', v: '未启动'},
            {k: '9', v: '出错'},
            {k: '0', v: '待配置'},
            {k: '1', v: '配置中'}
        ],
        total: 400

    },
    methods: {
        //获取项目经理
        getManagerList() {
            $.post('/project/getProjectManagerList.json', res => {
                if (res.code === 0) {
                    this.managerList = res.data.list;
                    this.managerList.unshift({
                        id: "",
                        username: "全部"
                    })
                }
            })
        },
        //获取客户列表
        getCustomerList() {
            $.post('/project/getCustomerList.json', res => {
                if (res.code === 0) {
                    this.customerList = res.data.list;
                    this.customerList.unshift({
                        id: "",
                        name: "全部"
                    })
                }
            })
        },
        //获取项目列表
        getProjectList() {
            this.loading = true
            $.post('/project/getProjectList.json', this.form, res => {
                if (res.code === 0) {
                    this.total = res.data.count;
                    this.projectList = res.data.projectList
                }
                this.loading = false
            })
        },
        //创建新项目
        toCreate() {
            location.href = '/visWorkFlow/toCreateVisWorkFlowProject.html';
        },
        sortChange({column, prop, order}) {
            var reg = /\w+(?=end)/
            prop = prop == 'startTime' ? "start_time" : prop == 'endTime'? 'end_time' :prop
            this.form.sortStatus = prop + " " + order.match(reg)[0];
            this.getProjectList()
        },
        sizeChange(size) {
            this.form.size = size;
            this.getProjectList()
        },
        pageChange(page) {
            this.form.page = page;
            this.getProjectList()
        },
        //启动项目
        startProject(id){
            console.log(111)
            $.post('/project/startProject.json',{projectId:id},res =>{
                if(res.code === 0){
                    this.$message.success('启动成功');
                    this.getProjectList()
                }else{
                    this.$message.error(res.message)
                }
            })
        }

    },
    filters: {
        _status(val) {
            var obj = {
                "": '全部',
                '3': '进行中',
                '5': '已完成',
                '2': '未启动',
                '9': '出错',
                '0': '待配置',
                '1': '配置中',
                '4': '停止'
            }
            return obj[val]
        }
    },
    mounted() {
        this.getManagerList();
        this.getCustomerList();
        $('body').fadeIn('fast');
        //this.getProjectList()


    }

})