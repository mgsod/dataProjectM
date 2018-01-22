/**
 * Created by Administrator on 2017/4/24.
 */
define('workFlowUtil', ['dataImport', 'dataOutput', 'semanticAnalysisObject', 'themeAnalysisSetting', 'topicAnalysisDefinition', 'wordSegmentation', 'fileOutput', 'dataCrawl', 'statisticalAnalysis'],
    function (dataImport, dataOutput, semanticAnalysisObject, themeAnalysisSetting, topicAnalysisDefinition, wordSegmentation, fileOutput, dataCrawl, statisticalAnalysis) {
        /**
         * 共对对象
         * @type {{workFlowList: [*], getWork: getWork}}
         */
        var workFlowUtil = {
            /**
             * 工作流
             */
            workFlowList: [
                {key: 'dataImport', value: dataImport},
                {key: 'dataOutput', value: dataOutput},
                {key: 'semanticAnalysisObject', value: semanticAnalysisObject},
                {key: 'themeAnalysisSetting', value: themeAnalysisSetting},
                {key: 'topicAnalysisDefinition', value: topicAnalysisDefinition},
                {key: 'wordSegmentation', value: wordSegmentation},
                {key: 'fileOutput', value: fileOutput},
                {key: 'dataCrawl', value: dataCrawl},
                {key: 'statisticalAnalysis', value: statisticalAnalysis}
            ],
            /**
             * 获取工作流
             * @param key
             * @returns {{}}
             */
            getWork: function (key) {
                var obj = {};
                var list = this.workFlowList;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].key == key) {
                        obj = list[i].value;
                        break
                    }
                }
                return obj;
            }
        };
        return workFlowUtil
    });