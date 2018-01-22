/**
 * Created by Administrator on 2017/4/21.
 */
define('paramterRouter', function () {
    var HTTPURL = {
        HEADER: {
            formHeader: {'Content-Type': 'application/x-www-form-urlencoded'},
            undefinedHeader: {'Content-Type': undefined}
        },
        routerUrl: {
            customerList: {url: '/project/getCustomerList.json', method: 'post'},//客户
            managerList: {url: '/project/getProjectManagerList.json', method: 'post'},//管理员
            statusList: {url: '/project/statusList.json', method: 'post'},//状态
            wordLibraryList: {url: '/wordSegmentation/getWordLibraryList.json', method: 'get'},//词库
            subjectAresList: {url: '/subjectSet/getSubjectAresList.json', method: 'get'},//主题域
            getDateSourceTypeList: {url: '/dataSource/getDateSourceTypeList.json', method: 'get'},//主题域
            getAllDateSourceTypeList: {url: '/dataSource/getAllDateSourceTypeList.json', method: 'get'},//主题域
            getStatusList: {url: '/dataSource/getStatusList.json', method: 'get'},//主题域
            getNotAddDatasourceTypeList: {url: '/dataSource/getNotAddDatasourceTypeList.json', method: 'get'}//主题域
        }
    };
    return HTTPURL
});