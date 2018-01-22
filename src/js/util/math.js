/**
 * Created by intel on 2017/2/27.
 */
define('math', function () {
    var math = {
        getPage: function (count, size) {
            return Math.ceil(count / size)
        },
        numToList: function (num) {
            var list = [];
            for (var i = 1; i <= num; i++) {
                list.push(i);
            }
            return list;
        }
    };
    return math;
});