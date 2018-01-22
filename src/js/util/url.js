/**
 * Created by Administrator on 2017/3/1.
 */
define('url', function () {
    var url = {
        getUrlParams: function (name) {
            var pattern = /(\w+)=(\w+)/ig;
            var resultName = "";
            document.URL.replace(pattern, function (a, b, c) {
                if (b == name) {
                    resultName = c;
                }
            });
            return resultName;
        }
    };
    return url;
});