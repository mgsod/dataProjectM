/**
 * Created by Administrator on 2017/8/8.
 */
define('chart', ['palette', 'setRotten', 'optionsBar'], function (palette, setRotten, optionsBar) {
    var chart = new function (id) {
        this.id = id || "box";
        this._palette = new palette();//面板
        this._setRotten = new setRotten();//设置框 面板
        this._optionsBar = new optionsBar();//选项栏
        /**
         * 获取面板
         * @returns {*}
         */
        this.getPalette = function () {
            return this._palette
        };
        /**
         * 获取设置栏
         * @returns {*}
         */
        this.getSetRotten = function () {
            return this._setRotten
        };
        /**
         * 获取选项栏
         * @returns {*}
         */
        this.getOptionsBar = function () {
            return this._optionsBar
        };
        /**
         * 设置Id
         * @param id
         */
        this.setId = function (id) {
            this.id = id;
        };
        /**
         * 获取id
         * @returns {*}
         */
        this.getId = function () {
            return this.id;
        }
    };
    return chart;
});