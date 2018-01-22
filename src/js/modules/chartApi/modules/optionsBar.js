/**
 * Created by Administrator on 2017/8/9.
 * 选项栏
 */
define('optionsBar', function () {
    /**
     * {
     setType://目前有"line","bar","pie"
     setTypeLine: //设置线图
     setTypeBar: //设置柱状图
     setTypePie: //设置饼图
     setToolBox://自定义的toolbox
     ...
     }
     */
    var optionsBar = function () {
        this._type = "line";
        /**
         * 支持的图
         * @type {[*]}
         * @private
         */
        var _typeList = ["line", "bar", "pie"];
        /**
         * 设置type
         * @param param
         */
        this.setType = function (param) {
            var flag = _typeList.indexOf(param) != -1 ? true : false;
            if (!flag) {
                throw "暂时不支持此类型，only line，bar，pie"
            }
            this.type = param;
        };
        /**
         * 设置line  折线
         */
        this.setTypeLine = function () {
            this._type = "line";
        };
        /**
         * 设置bar  柱状
         */
        this.setTypeBar = function () {
            this._type = "bar";
        };
        /**
         * 设置pie  饼状
         */
        this.setTypePie = function () {
            this._type = "pie";
        };
        /**
         * 设置框
         */
        this.setToolBox = function () {
            console.log("没想好");
        };
        /**
         * 获取type
         * @returns {string}
         */
        this.getType = function () {
            return this._type;
        }
    };
    return optionsBar;
});