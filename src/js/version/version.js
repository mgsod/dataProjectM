/**
 * Created by Administrator on 2017/3/27.
 */
var version = ['1.0.0','1.2.0','1.2.2','1.3.0'];
var getLastVersion = function () {
    return version[version.length-1]
};
exports.version = getLastVersion();