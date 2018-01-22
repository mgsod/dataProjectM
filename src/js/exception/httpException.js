/**
 * Created by Administrator on 2017/3/27.
 */
define("httpException", function () {
    var exception = {
        normalException: function (exception) {
            console.log(exception);
        },
        codeException: function (exception) {
            console.log(exception);
        }
    };
    return exception;
});