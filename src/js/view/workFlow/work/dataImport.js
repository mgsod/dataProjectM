/**
 * Created by Administrator on 2017/4/24.
 */
define('dataImport', ['angular', 'jquery', 'paramterUtil'], function (angular, $, paramterUtil) {
    var dataImport = {
        /**
         * 初始参数 ，基本全部需要配置
         * @param json
         * targetId;$scope;$http;$compile;mapJson;HEADER;routerUrl;callback;
         * 必须有
         */
        init: function (json) {
            var id = json.targetId;
            var $scope = json.$scope;
            var $http = json.$http;
            var $compile = json.$compile;
            var mapJson = json.mapJson;
            var HEADER = json.HEADER;
            var routerUrl = json.routerUrl;
            var fn = json.callback;
            var cancelFn = json.cancelFn;
            var that = this;
            $scope.typeList = [{
                datasourceId: "1",
                datasourceName: "微博",
                datasourceTypes: [{typeId: "1", typeName: "新浪微博", storageTypeTable: "weibo"}]
            }, {
                datasourceId: "2",
                datasourceName: "微信",
                datasourceTypes: [{typeId: "2", typeName: "朋友圈", storageTypeTable: "weibo"}]
            }
            ];
            $scope.origainField = [/*'你好', '你妹', '死人', '债最', '123'*/];
            $scope.field = [/*'a', 'b', 'c', 'd'*/];
            $scope.describe = [/*'1', '2', '3', '4'*/];
            $scope.uploadParamter = {
                projectId: mapJson.projectId,
                typeNo: mapJson.obj.typeNo,
                name: $scope.fileName,
                datasourceId: "1",
                typeId: "1",
                typeName: "新闻",
                storageTypeTable: "weibo",
                url: "",
                origainField: []
            };
            $scope.waitField = [];
            $scope.fileName = "";
            $scope.setTable = function () {
                var typeId = $scope.uploadParamter.typeId;
                var i = 0;
                while (true) {
                    if ($scope.typeChildrenList[i].typeId == typeId) {
                        $scope.uploadParamter.storageTypeTable = $scope.typeChildrenList[i].storageTypeTable;
                        $scope.uploadParamter.typeName = $scope.typeChildrenList[i].typeName;
                        break;
                    }
                    i++
                }
                $scope.doUploadFile();
            };
            $scope.getTypeListChildren = function () {
                var dataSourceId = $scope.uploadParamter.datasourceId;
                getChildrenList(dataSourceId);
                $scope.doUploadFile();
            };
            /**
             * 获取children
             * @param dataSourceId
             */
            var getChildrenList = function (dataSourceId) {
                var i = 0;
                while (true) {
                    if ($scope.typeList[i].datasourceId == dataSourceId) {
                        $scope.typeChildrenList = $scope.typeList[i].datasourceTypes;
                        $scope.uploadParamter.typeId = $scope.typeChildrenList[0].typeId + "";
                        $scope.uploadParamter.typeName = $scope.typeChildrenList[0].typeName + "";
                        $scope.uploadParamter.storageTypeTable = $scope.typeChildrenList[0].storageTypeTable;
                        break;
                    }
                    i++;
                }
            };
            var file = null;
            /**
             * 上传文件
             */
            $scope.doUploadFile = function () {
                if (file == null) {
                    return
                }
                $('#loading').show()
                var formData = new FormData();
                formData.append('file', file);
                formData.append('id', $scope.uploadParamter.typeId);
                $scope.uploadParamter.name = file.name;
                $http({
                    url: routerUrl.dataImportUploadFile.url,
                    method: routerUrl.dataImportUploadFile.method,
                    data: formData,
                    headers: HEADER.undefinedHeader
                }).success(function (data) {
                    $('#loading').hide()
                    if (data.code == 0) {
                        $scope.uploadParamter.url = data.data.url;
                        $scope.origainField = data.data.origainFieldList;
                        $scope.field = data.data.fieldNameList;
                        $scope.describe = data.data.fieldAnnotationList;
                        $scope.waitField = data.data.fieldNameList;
                        that.createTable($scope.origainField, $scope.field, $scope.describe, function (hang, fieldKV, list) {
                            $scope.uploadParamter.origainField = list;
                            $scope.hang = hang;
                            $scope.fieldKV = fieldKV;
                        });
                    } else {
                        alert(data.message);
                    }
                });
                /*   $scope.origainField = ['你好', '你妹', '死人', '债最', '123'];
                 $scope.field = ['a', 'b', 'c', 'd'];
                 $scope.describe = ['1', '2', '3', '4'];
                 $scope.uploadParamter.fileUrl = 'test';
                 /!**
                 * 创建table 需要的数据
                 *!/
                 that.createTable($scope.origainField, $scope.field, $scope.describe, function (hang, fieldKV, list) {
                 $scope.uploadParamter.list = list;
                 $scope.hang = hang;
                 $scope.fieldKV = fieldKV;
                 });*/
            };

            /**
             * 修改key value的值
             */
            $scope.updateKV = function () {
                $scope.waitField = [];
                $scope.field.forEach(function (item) {
                    var flag = false;
                    for (var i = 0; i < $scope.uploadParamter.origainField.length; i++) {
                        if ($scope.uploadParamter.origainField[i].key == item) {
                            flag = true
                        }
                    }
                    if (!flag) {
                        $scope.waitField.push(item);
                    }
                });
            };
            $scope.cancel = function () {
                cancelFn();
            };
            /**
             * 执行上传
             */
            $scope.doUpload = function () {
                if ($scope.uploadParamter.origainField.length == 0) {
                    alert('请选择文件');
                    return
                }
                $scope.uploadParamter.name = $scope.fileName;
                console.log(JSON.stringify($scope.uploadParamter));
                dataImportUpload();
            };
            /**
             * 选择文件
             * @param e
             */
            window.chooseFile = function (e) {
                file = $(e)[0].files[0];
                $scope.uploadParamter.url = "";
                $scope.fileName = file.name;
                $(e).val("");
                $scope.$apply();
            };
            /**
             * 执行上传
             */
            var dataImportUpload = function () {
                $scope.uploadParamter.origainField = JSON.stringify($scope.uploadParamter.origainField);
                $http({
                    url: routerUrl.dataImportUpload.url,
                    method: routerUrl.dataImportUpload.method,
                    data: $.param($scope.uploadParamter),
                    headers: HEADER.formHeader
                }).success(function (data) {
                    if (data != 0) {
                        $scope.uploadParamter.origainField = JSON.parse($scope.uploadParamter.origainField);
                    }
                    fn(data);
                });
            };
            /**
             * 获取页面
             */
            var getHtml = function () {
                $http({
                    url: routerUrl[mapJson.obj.typeNo].url,
                    method: routerUrl[mapJson.obj.typeNo].method
                }).success(function (data) {
                    /**
                     * 把普通dom转换为ng 的 dom
                     */
                    var template = angular.element(data);
                    var mobileDialogElement = $compile(template)($scope);
                    $(id).html(mobileDialogElement);
                })
            };
            getHtml();
            /**
             * 获取参数
             */
            var getParamter = function () {
                paramterUtil.init($http).getParamter('getDateSourceTypeList', function (data) {
                    if (data.code == 0) {
                        $scope.typeList = data.data;
                        getChildrenList($scope.uploadParamter.datasourceId);
                    }
                });
            };
            getParamter();
        },
        /**
         * origainField,field describe,callback
         * @param origainField
         * @param field
         * @param describe
         * @param cb
         */
        createTable: function (origainField, field, describe, cb) {
            var h = origainField.length > field.length ? origainField : field;
            var fieldkv = {};
            for (var i = 0; i < field.length; i++) {
                fieldkv[field[i]] = describe[i];
            }
            var mkv = [];
            for (var j = 0; j < h.length; j++) {
                var obj2 = {};
                obj2.key = "";
                obj2.value = origainField[j] || "";
                mkv.push(obj2);
            }
            cb(h, fieldkv, mkv);
        }

    };
    return dataImport
});