/**
 * Created by intel on 2017/2/28.
 */
define('dom', function () {
    var dom = {
        createDom: function (node) {
            var flag = node.cloneNode(true);
            return flag;
        },
        domToJson: function (node, options) {

        }
    };
    return dom;
});