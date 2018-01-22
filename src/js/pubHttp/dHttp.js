/**
 * Created by Administrator on 2017/6/19.
 */
define('dHttpUtil', ['router', 'jquery'], function (router, $) {
    var HEADER = router.HEADER;
    var routerUrl = router.routerUrl;
    var dHttpUtil = {
        init: function (http) {
            this.http = http;
            return this
        },
        /**
         * {action:123,data:123,isFile:true,callback:fn}
         * @param option
         * @returns {paramterUtil}
         */
        dHttp: function (option) {
            var that = this;
            try {
                var url = routerUrl[option.action].url;
                var method = routerUrl[option.action].method;
                if (option.isFile) {
                    that.http({
                        url: url,
                        method: method,
                        data: option.data,
                        headers: HEADER.undefinedHeader
                    }).success(function (data) {
                        option.callback(data);
                    });
                } else {
                    var data = typeof option.data != 'undefined' ? $.param(option.data) : "";
                    if (method == 'post') {
                        that.http({
                            url: url,
                            method: method,
                            data: data,
                            headers: HEADER.formHeader
                        }).success(function (data) {
                            option.callback(data);
                        });
                    } else if (method == 'get') {
                        that.http({
                            url: url + "?" + data,
                            method: method
                        }).success(function (data) {
                            option.callback(data);
                        });
                    }
                }
            } catch (exception) {
                console.log("没找到action为" + option.action + "的接口");
                throw exception;
            }
            return that
        }
    };
    return dHttpUtil;
});