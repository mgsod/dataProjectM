/**
 * Created by Administrator on 2017/4/21.
 */
define('paramterUtil', ['paramterRouter'], function (router) {
    var HEADER = router.HEADER;
    var routerUrl = router.routerUrl;
    var paramterUtil = {
        init: function (http) {
            this.http = http;
            return this
        },
        getParamter: function (name, fn) {
            var url = routerUrl[name].url;
            var method = routerUrl[name].method;
            this.http({
                url: url,
                method: method,
                headers: HEADER.formHeader
            }).success(function (data) {
                fn(data);
            });
            return this
        }
    };
    return paramterUtil;
});