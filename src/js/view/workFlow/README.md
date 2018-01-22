##workFlowUtil使用规则
    所有的workFlow的js都放在work文件夹下一个
    如果有新写好的work 需要在workFlowUtil去注册这个workFlow *** 很关键 如果不注册，maybe 获取不到
    具体怎么注册  可以看workFlowUtil.js  很明显的（当然你需要懂requirejs）
    
    当你需要使用workFlow时
     var work = workFlowUtil.getWork(mapJson.obj.typeNo);
                    /**
                     * targetId  容器id
                     * mapJson 页面静态数据
                     * callBack 为点击确定后触发的回调
                     */
                    work.init({
                        targetId: '#workFlowPart',
                        action: action,
                        data: item,
                        $scope: $scope,
                        $http: $http,
                        $compile: $compile,
                        mapJson: mapJson,
                        HEADER: HEADER,
                        routerUrl: routerUrl,
                        callback: function (data) {
                            if (data.code == 0) {
                                $('#workFlowPart').html('');
                                $scope.isOpenWork = false;
                                searchList();
                            } else {
                                alert(data.message);
                            }
                        },
                        cancelFn: function () {
                            $scope.isOpenWork = false;
                            $('#workFlowPart').html('');
                        }
                    });
     因为work内部是没有引用angular的，为了 内部的$scope和$http  是一致的这儿需要传入进去
     基本上都是必传，或许这儿是有问题,可以优化
    