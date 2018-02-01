/**
 * Created by setting on 2018/1/11 0011.
 */
import '../../generalExport/css/etc.scss'

let vm = new Vue({
    el: "#app",
    data() {
        return {
            form: {
                workFlowTemplateName: "",
                createTime: "",
                page: 1,
                size: 10
            },
            templateList: [],
            total: 50,
            dialogVisible: false,
            reviewUrl: '',
            tableLoading:false

        }
    },
    methods: {
        getTemplateList() {
            this.tableLoading = true;
            $.get('/workFlowTemplate/getVisWorkFlowTemplateList.json', this.form, res => {
                if (res.code === 0) {
                    this.total = res.data.count;
                    this.templateList = res.data.workFlowTemplateList;
                }
                this.tableLoading = false;
            })
        },
        delTemplate(id) {
            this.$confirm('确认删除该模板?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                $.post('/workFlowTemplate/deleteWorkFlowTemplate.json', {templateId: id}, res => {
                    if (res.code === 0) {
                        this.$message.success('已删除');
                        this.getTemplateList();
                    } else {
                        this.$message.error(res.message);
                    }
                })
            }).catch(() => {
            });
        },
        editTemplate(id) {
            location.href = '/visWorkFlow/toWorkFlow.html?templateId=' + id + '&action=template';
        },
        createTemplate() {
            this.$prompt('请输入模板名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                 inputPattern: /\S/,
                 inputErrorMessage: '模板名称不能为空'
            }).then(({value}) => {
                $.post('/visWorkFlow/saveOrUpdateVisTemplate.json', {templateId: '', templateName: value}, res => {
                        if(res.code === 0){
                            let { id } = res.data;
                            location.href = '/visWorkFlow/toWorkFlow.html?templateId=' + id + '&action=template';
                        }
                })
            }).catch(() => {

            });

            // location.href = '/visWorkFlow/toWorkFlow.html?action=template'
        },
        sizeChange(size) {
            this.form.size = size;
            this.getTemplateList()
        },
        pageChange(page) {
            this.form.page = page;
            this.getTemplateList()
        }

    },
    mounted() {
        this.getTemplateList();
        $('body').fadeIn('fast');
    },


})