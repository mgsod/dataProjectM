/**
 * Created by Administrator on 2017/3/2.
 */
define('router', function () {
    var HTTPURL = {
        HEADER: {
            formHeader: {'Content-Type': 'application/x-www-form-urlencoded'},
            undefinedHeader: {'Content-Type': undefined}
        },
        routerUrl: {
            getProjectList: {url: '/project/getProjectList.json', method: 'post'},
            startProject: {url: '/project/startProject.json', method: 'post'},
            stopProject: {url: '/project/stopProject.json', method: 'post'},
            deleteProject: {url: '/project/updateDelProject.json', method: 'post'},
            createOrSaveProject: {url: '/project/createProject.json', method: 'post'},
            getAnalysisObjectHomeList: {url: '/semanticAnalysisObject/getAnalysisObjectHomeList.json', method: 'get'},
            getProjectObj: {url: '/project/getProjectInf.json', method: 'post'},
            /**
             * dataImport
             */
            dataImportList: {url: '/importData/importList.json', method: 'post'},
            dataImportUploadFile: {url: '/importData/uploadFile.json', method: 'post'},
            dataImportUpload: {url: '/importData/import.json', method: 'post'},
            doDeleteData: {url: '/importData/deleteImport.json', method: 'post'},

            /**
             * semanticAnalysisObject
             */
            getSemanticAnalysisObjectList: {url: '/semanticAnalysisObject/getAnalysisObjectList.json', method: 'get'},
            saveSemanticAnalysisObject: {url: '/semanticAnalysisObject/saveAnalysisObjectList.json', method: 'post'},
            getContentTypeList: {url: '/semanticAnalysisObject/getContentTypeList.json', method: 'get'},
            /**
             * themeAnalysisSetting
             */
            themeAnalysisSettingList: {url: '/subjectSet/getSubjectSetList.json', method: 'get'},
            deleteThemeAnalysisSetting: {url: '/subjectSet/deleteSubjectSet.json', method: 'post'},
            saveThemeAnalysisSetting: {url: '/subjectSet/saveSubjectSet.json', method: 'post'},
            getSubjectSemanticResultList: {url: '/subjectSet/getSubjectSemanticResultList.json', method: 'post'},
            /**

             * topicAnalysisDefinition
             */
            topicAnalysisDefinitionList: {url: '/hotspotsSet/getHotspotsSetList.json', method: 'get'},
            deleteTopicAnalysisDefinition: {url: '/hotspotsSet/deleteHotspotsSet.json', method: 'post'},
            saveTopicAnalysisDefinition: {url: '/hotspotsSet/saveHotspotsSet.json', method: 'post'},
            getSubjectAresList: {url: '/hotspotsSet/getSubjectAresList.json', method: 'get'},
            getHotpostSemanticResultList: {url: '/hotspotsSet/getHotpostSemanticResultList.json', method: 'post'},

            /**
             * uploadWordSegmentation
             */
            uploadWordSegmentationObject: {url: '/wordSegmentation/saveSegSet.json', method: 'post'},
            getWordSegmentationObject: {url: '/wordSegmentation/getSegSet.json', method: 'get'},
            getSegSemanticResultList: {url: '/wordSegmentation/getSegSemanticResultList.json', method: 'post'},
            /**
             *dataOutput
             */
            doDeleteDataApi: {url: '/export/deleteOutput.json', method: 'post'},
            getDataOutputList: {url: '/export/getOutputList.json', method: 'post'},
            getOutDataSourceDetail: {url: '/export/getOutDataSourceDetail.json', method: 'post'},
            getOutDataSource: {url: '/export/getOutDataSource.json', method: 'post'},
            saveOutput: {url: '/export/saveOutput.json', method: 'post'},
            /**
             * fileOutput
             */
            getExportConfigList: {url: '/exportConfig/getExportFileConfigList.json', method: 'get'},
            getExportDataTypeList: {url: '/exportConfig/getExportDataTypeList.json', method: 'get'},
            getDataTypeRelationList: {url: '/exportConfig/getDataTypeRelationList.json', method: 'get'},
            getDataSourceTypeList: {url: '/exportConfig/getDataSourceTypeList.json', method: 'post'},
            saveExportConfig: {url: '/exportConfig/saveExportConfig.json', method: 'post'},
            deleteFileOutputItem: {url: '/exportConfig/deleteExportFileConfig.json', method: 'post'},
            /**
             * dataCrawl
             */
            getDataCrawlList: {url: '/dataCrawl/getDataCrawlList.json', method: 'post'},
            saveCrawlObject: {url: '/dataCrawl/saveCrawlObject.json', method: 'post'},
            delCrawlObject: {url: '/dataCrawl/delCrawlObject.json', method: 'post'},
            startCrawlObject: {url: '/dataCrawl/startCrawlObject.json', method: 'post'},
            stopCrawlObject: {url: '/dataCrawl/stopCrawlObject.json', method: 'post'},
            getCrawlInputParamList: {url: '/dataCrawl/getCrawlInputParamList.json', method: 'get'},
            dataCrawlUploadFile: {url: '/dataCrawl/uploadFile.json', method: 'post'},
            getCrawlWayList:{
                url:"/ dataCrawl/getCrawlWayList.json",
                method:'get'
            },
            getCrawlTypeList:{
               url:'/ dataCrawl/getCrawlTypeList.json',
                method:'get'
            },
            getDateSourceTypeList:{
                url:"/dataSource/getDateSourceTypeList.json",
                method:"get"
            },
            getProcess:{
                url:'/dataCrawl/getWorkFlowTemplateList.json',
                method:'get'
            },


            /**
             * showData
             */
            getSemanticAnalysisObjectListFromShowData: {
                url: '/semanticAnalysisObject/getSemanticAnalysisObjectListFromShowData.json',
                method: 'post'
            },
            getDataImportListFromShowData: {url: '/importData/getDataImportListFromShowData.json', method: 'post'},
            dataInquire: {url: '/dataInquire.json', method: 'post'},
            /*
             * 数据源管理
             * */
            getDatasourceTypeListAndContentType: {
                url: '/dataSource/getDatasourceTypeListAndContentType.json',
                method: 'post'
            },
            enabledDatasourceAndContent: {url: '/dataSource/enabledDatasourceAndContent.json', method: 'post'},
            failDatasourceAndContent: {url: '/dataSource/failDatasourceAndContent.json', method: 'post'},
            saveDatasourceTypeConf: {url: '/dataSource/saveDatasourceTypeConf.json', method: 'post'},
            getDataSourceTypeRelation: {url: '/dataSource/getDataSourceTypeRelation.json', method: 'get'},
            /*
             * 可视化
             */
            getVisTemplate: {url: '/visualization/getVisTemplate.json', method: 'get'},
            saveVis: {url: '/visualization/saveVis.json', method: 'post'},
            getVisList: {url: '/visualization/getVisList.json', method: 'post'},
            deleteVisualization: {url: '/visualization/deleteVisualization.json', method: 'post'},
            /*
             * 统计分析
             * */
            getStatisticsAnalysisList: {url: '/statisticsAnalysis/getStatisticsAnalysisList.json', method: 'get'},
            delStatisticsAnalysis: {url: '/statisticsAnalysis/delStatisticsAnalysis.json', method: 'post'},
            saveStatisticsAnalysis: {url: '/statisticsAnalysis/saveStatisticsAnalysis.json', method: 'post'},
            getDataTypeList: {url: '/statisticsAnalysis/getDataTypeList.json', method: 'get'},
            getAnalysisHierarchyList: {url: '/statisticsAnalysis/getAnalysisHierarchyList.json', method: 'get'},
            getFieldFilterList: {url: '/statisticsAnalysis/getFieldFilterList.json', method: 'get'},

            /**
             * 流程抓取模板
             */
            getWorkFlowTemplateList: {url: '/workFlowTemplate/getWorkFlowTemplateList.json', method: 'get'},
            enableWorkFlowTemplate: {url: '/workFlowTemplate/enableWorkFlowTemplate.json', method: 'post'},
            disabledWorkFlowTemplate: {url: '/workFlowTemplate/disabledWorkFlowTemplate.json', method: 'post'},
            delWorkFlowTemplate: {url: '/workFlowTemplate/delWorkFlowTemplate.json', method: 'post'},

        }
    };
    return HTTPURL
});