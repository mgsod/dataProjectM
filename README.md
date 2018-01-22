# 前端页面开发结构
#####文档结构
    1.简介
    2.目录结构
    3.操作手册
## 简介
    1. 主要使用npm来管理包（如：jquery,react）
    2. 使用grunt来进行打包src下的文件到build路径（详情看Gruntfile.js配置）
    3. 使用require来进行加载包文件(需配置config.js 路径：js目录下)
    4. 动态template 使用freemarker进行编写 （网址:http://freemarker.org）
    
## 使用框架及工具介绍
    1.  Angular框架（主要使用模板引擎,双向绑定,$http）
    2.  jquery（基础框架是用jq开发的所以需要使用)
    3.  requirejs（用来管理js文件）
    4.  echarts（图表插件)
    5.  css（除了基础css,其他自己写吧）

## 目录结构
### SRC目录
#### CSS
_CSS结构_

    common                         //主要用户存放reset.css 和common.css
    public                         //公共css（如：main.css  ,index.css）
    view                           //相应html的css

#### HTML
_静态html_

    index.html                    //入口html
    modules                         //模块html

#### IMAGES
_图片结构_

    animation                     //存放动画需要的图片
    icon                          //存放icon图片
    modules                       //存放模块图片
    UI                            //存放原图

#### JS
_JS结构_

    animation                     //存放js 操作的动画
    lib                           //库js(如：jquery.js/require.js等)
    modules                       //模块js
    util                          //公用工具util.js
    view                          //html引用的js

#### TEMPLATE
_动态html，结构和静态html一样_
#### VENDER
_第三方插件(类似plugins)，其中按三方插件名进行区分_

### BUILD目录
_此目录用来存放编译后的各种文件，不用手动copy，此目录通过grunt插件来进行自动生成代码。_


##操作手册

### 首先需要安装node环境
    具体操作请百度，很详细

####安装需要的模块
    npm install -g cnpm --registry=https://registry.npm.taobao.org  安装淘宝镜像
    cnpm install

####安装grunt管理器
    cnpm install -g grunt-cli --save

####启动grunt
    可以手写脚本来启动，在package.json里的script可以配置脚本或者通过grunt直接启动
    现在配置好的启动脚本有：npm dev （开发环境启动）
    对应的grunt是：grunt dev