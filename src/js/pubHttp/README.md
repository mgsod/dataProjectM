##dHttp 使用手册
     var dHttp = dHttpUtil.init($http);//初始化dHttp  目前$http 支持ng的$http
     一个页面只需要初始化一个dhttp对象 （做了单列的 创建不出来第二个）
     然后需要在router/router.js 下去进行配置接口
     //deleteFileOutputItem: {url: '/exportConfig/deleteExportFileConfig.json', method: 'post'}
     使用时：
       dHttp.dHttp({
                         action: 'delStorageTypeField',
                         data: {id: id},
                         callback: function (data) {
                             alert(data.message || "删除成功");
                             $scope.isDeleteBox = false;
                             _getDataList();
                         }
                     });
       action 为 你在配置router时 配置的 deleteFileOutputItem
       data 为 需要传输的参数
       callback 为成功返回时 执行的操作
       options还有参数为
       {
       action:123,
       data:123,
       isFile:true,
       callback:fn
       }
       注意，如果是file 需要把data 转化为formData对象，框架传输文件使用的是html5的formData对象
##paramterHttp 使用手册
    次对象在crawlfs项目中使用，dpm中使用的是第一版，crawl是第二版
    var pHttp = paramterHttp.init($http);//初始化pHttp  目前$http 支持ng的$http
    一个页面只需要初始化一个dhttp对象 （做了单列的 创建不出来第二个）
    然后需要在router/paramterRouter.js 下去进行配置接口
    getStatusList: {url: '/dataSource/getStatusList.json', method: 'get'},//获取状态list
     pHttp.getParamter({
                        action: 'getStorageTypeList',
                        callback: function (data) {
                            if (data.code == 0) {
                                $scope.storageTypeList = data.data;
                            } else {
                                alert(data.message);
                            }
                        }
                    });
     action 为 你在配置paramterRouter时 配置的 getStatusList
            data 为 需要传输的参数
            callback 为成功返回时 执行的操作
            options还有参数为
            {
            action:123,
            data:123,
            callback:fn
            }
    