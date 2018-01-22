/**
 * Created by setting on 2017/12/1 0001.
 */

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

let header = `<div class="header">
 <span class="title">数据项目管理系统</span>
            <el-dropdown trigger="click" style="float: right">
             
                 <span class="el-dropdown-link">
                     <a  class="user" >
                    <img class="head_img" :src="address+'/newProject/img/user.jpg'" alt="">
                 </a>
                <span class="name">admin<i class="el-icon-arrow-down el-icon--right"></i></span>
                     <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>Logout</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>`;
let aside = `<div class="aside">      
        <el-menu
                :default-active="menuIndex"
                background-color="#3a3f51"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-submenu index="1">
                <template slot="title">
                    <span>项目管理</span>
                </template>
                <el-menu-item index="1-1">
                    <a slot="title" href="/project/projectListPage.html">
                        项目列表
                    </a>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <span>抓取流程配置管理</span>
                </template>

                <el-menu-item index="2-1">
                    <a slot="title" href="/workFlowTemplate/toWorkFlowTemplateList.html">
                        抓取流程配置列表
                    </a>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="3">                
                <span slot="title">可视化工作流</span>
                 <el-menu-item index="3-1">
                    <a slot="title" href="/project/projectListPage.html?type=vis">
                        可视化工作流列表
                    </a>
                </el-menu-item>
                <el-menu-item index="3-2">
                    <a slot="title" href="/workFlowTemplate/toVisWorkFlowTemplateList.html">
                        模板列表
                    </a>
                </el-menu-item>
                <el-menu-item index="3-3">
                    <a slot="title" href="#">
                        可视化文件导出
                    </a>
                </el-menu-item>
                
            </el-submenu>
        </el-menu>
    </div>`;
Vue.component('ex-header',{
    template:header,
    props:['address']
})

Vue.component('ex-aside',{
    template:aside,
    props:['menuIndex']
})