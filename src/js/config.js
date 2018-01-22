/**
 * Created by Administrator on 2017/2/13.
 */
if (!navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/)) {
    alert('为了好的体验,请使用chrome浏览器!')
}
var http = document.getElementById('http').value || '../../';
require.config({
    baseUrl: http + '/js/',
    /**
     * 配置js 路径 和 引用名称
     */
    paths: {
        "jquery": "lib/jquery.min",
        'bootstrap':'lib/bootstrap.min',
        "angular": "lib/angular.min",
        "treemenu": "lib/jquery.treemenu",
        "comboSelect": "lib/jquery.combo.select",
        "foundation-datepicker": 'lib/foundation-datepicker.min',
        "ck_defaultclick": "modules/api/ui/defaultclick",
        "ck_exception": "modules/api/exception/exception",
        "ck_url": "modules/api/util/url",
        "ck_response": "modules/api/util/response",
        "ck_menu": "modules/api/ui/menu",
        "ck_pagination": "modules/api/ui/pagination",
        "ck_progress": "modules/api/ui/progress",
        "ck": "modules/api/ck",
        "router": "router/router",
        "paramterRouter": "router/paramterRouter",
        "paramterUtil": "pubHttp/paramter",
        "pagination": "util/pagination",
        "regexp": "util/regexp",
        "math": "util/math",
        "dom": "util/dom",
        "url": "util/url",
        "windowCt": "util/window",
        "http": "ngUtil/http",
        "httpException": "exception/httpException",
        "chart": "modules/chartApi/chart",
        "palette": "modules/chartApi/modules/palette",
        "setRotten": "modules/chartApi/modules/setRotten",
        "optionsBar": "modules/chartApi/modules/optionsBar",
        "echarts.common.min": "modules/chartApi/modules/echarts.common.min",
        "dHttpUtil": "pubHttp/dHttp",
        "tz": "lib/tz",
        "zTree":"lib/jquery.ztree.all.min",
        /**
         * 流程
         */
        "workFlowUtil": "view/workFlow/workFlowUtil",
        "dataImport": "view/workFlow/work/dataImport",
        "dataCrawl": "view/workFlow/work/dataCrawl",
        "topicAnalysisDefinition": "view/workFlow/work/topicAnalysisDefinition",
        "dataOutput": "view/workFlow/work/dataOutput",
        "fileOutput": "view/workFlow/work/fileOutput",
        "semanticAnalysisObject": "view/workFlow/work/semanticAnalysisObject",
        "wordSegmentation": "view/workFlow/work/wordSegmentation",
        "themeAnalysisSetting": "view/workFlow/work/themeAnalysisSetting",
        "statisticalAnalysis": "view/workFlow/work/statisticalAnalysis"
    },
    /**
     * 有依赖关系的包，如（jquery的插件需要在jquery加载后再加载）
     *
     */
    shim: {
        "ck_defaultclick": ['jquery'],
        "bootstrap":['jquery'],
        "comboSelect": ['jquery'],
        "ck_menu": ['jquery'],
        "ck_pagination": ['jquery'],
        "ck_progress": ['jquery'],
        "foundation-datepicker": ['jquery'],
        "treemenu": ['jquery'],
        "tz": ['jquery'],
        "zTree":['jquery'],
        "angular": {
            exports: "angular"
        },
        "jquery": {
            exports: "jquery"
        }
    }
});