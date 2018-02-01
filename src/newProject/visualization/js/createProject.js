/**
 * Created by setting on 2018/1/8 0008.
 */
import '../../generalExport/css/etc.scss'

var vm = new Vue({
    el: "#app",
    data() {
        var time = (rule, value, callback) => {
            if (value) {
                return callback()
            }
            callback(new Error('请选择起止时间'))
        }
        return {
            form: {
                //projectId: '',
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
            dialogVisible: false,
            innerVisible: false,
            templateList: [{
                templateId: 1,
                templateName: 'test'
            }, {
                templateId: 2,
                templateName: 'test2'
            }],
            temp_templateId: '',
            temp_templateName: "",
            rules: {
                projectName: [
                    {required: true, message: '请输入项目名称', trigger: 'change'},
                ],
                managerId: [
                    {required: true, type: 'number', message: '请选择项目经理', trigger: 'change'},
                ],
                customerId: [
                    {required: true, type: 'number', message: '请选择客户', trigger: 'change'},
                ],
                time: [
                    {validator: time, trigger: 'blur', required: true}
                ],
            },
            typeList: [
                {key: '3', value: '日报'},
                {key: '2', value: '周报'},
                {key: '1', value: '月报'},
                {key: '4', value: '临时项目'}
            ],
            managerList: [],
            customerList: [],
            reviewUrl: "/newProject/img/t.png",
            searchTemplateName: "",
            templateType:"0",
            templateLoading:true

        }


    },

    methods: {
        selectTime(val) {
            if (val) {
                this.form.startTime = val[0];
                this.form.endTime = val[1];
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    $.post('/visWorkFlow/saveOrUpdateProject.json', this.form, res => {
                        if (res.code === 0) {
                            let result = res.data;
                            let templateId = result.templateId ? result.templateId : ''
                            location.href = "/visWorkFlow/toWorkFlow.html?projectId=" + result.projectId + "&templateId=" + templateId;
                        } else {
                            this.$message.error(res.message)
                        }
                    })

                } else {
                    return false;
                }
            });
        },
        cancel() {
            location.href = "/visualization/toVisualizationList.html";
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
        //选择模板
        selectTemplate() {
            this.dialogVisible = true;
            this.getTemplateList();
        },
        //获取模板列表
        getTemplateList(){
            this.templateLoading = true;
            $.get('/workFlowTemplate/getWorkFlowTemplateListNoPage.json', {
                workFlowTemplateName: this.searchTemplateName,
                status: 1
            }, res => {
                if (res.code === 0) {
                    this.templateList = res.data.workFlowTemplateList
                }
                this.templateLoading = false;
            })
        },
        //选择模板方式
        changeTemplateType(val){
            if(val == 0){
                this.form.workFlowTemplateId = ''
            }
        }
    },
    mounted() {
        this.getManagerList();
        this.getCustomerList();
        $('body').fadeIn('fast');
    }
})