/**
 * Created by setting on 2018/1/9 0009.
 */
//webpack基础配置
module.exports = {
    dev:{
        output: {
            path: __dirname + "/",
            filename: "[name].min.js?t=[hash]",
            publicPath: 'http://127.0.0.1:3000/'
        },
        copyTo:__dirname + '/newProject/',
        htmlOptions:function(name){
            var name_project = name.split('/')
            return  {
                filename: ''+name+'.html',
                title: '数据项目管理',
                template: 'src/newProject/'+name_project[0]+'/'+name_project[1]+'.html',
                chunks: [name],
                hash:true
            }
        }
    },
    pro:{
        output: {
            path: __dirname + "/build/newProject/",
            filename: "js/[name].min.js?t=[hash]",
            publicPath: '${staticAddress}/newProject'     //
        },
        copyTo:__dirname + '/build/newProject/',
        htmlOptions:function(name){
            var name_project = name.split('/')
            return  {
                filename: __dirname + '/build/template/newProject/'+name+'.html',
                title: '数据项目管理',
                template: 'src/newProject/'+name_project[0]+'/'+name_project[1]+'.html',
                chunks: [name],
                freemarkerPath:'${staticAddress}',
                vue:'vue.min.js'
            }
        }
    }
}