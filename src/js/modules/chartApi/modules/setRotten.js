/**
 * Created by Administrator on 2017/8/8.
 * 设置参数
 */
define('setRotten', function () {
    /*
     * {
     setTextStyle://设置文字
     setAxisPointer://悬浮文案
     setDataZoom://数据量大的时候，自动设置此参数,可以手动设置
     setGrid://设置坐标系
     ...
     }
     * */
    var setRotten = function () {
        this._textStyle = {
            fontStyle: "default",
            color: "#fff",
            fontWeight: "normal",
            fontFamily: "sans-serif"
        };
        this._axisPointer = {
            label: {
                backgroundColor: '#777'
            }
        };
        this._dataZoom = {};
        this._grid = {
            show: false
        };
        /**
         * 设置grid
         * @param flag
         */
        this.setGridIsShow = function (flag) {
            flag = flag == true ? true : false;
            this._grid.show = flag;
        };
        /**
         * 设置testStyle
         * @param json
         */
        this.setTextStyle = function (json) {
            _extend(this._textStyle, json);
        };
        /**
         * 设置axispointer
         * @param json
         */
        this.setAxisPointer = function (json) {
            _extend(this._axisPointer, json);
        };
        /**
         * 设置datazoom
         * @param json
         */
        this.setDataZoom = function (json) {
            _extend(this._dataZoom, json);
        };
        /**
         * 继承函数(只能根据父类继承)
         * @param aJson
         * @param bJson
         * @private
         */
        var _extend = function (aJson, bJson) {
            for (var key in aJson) {
                if (typeof bJson[key] != "undefined") {
                    aJson[key] = bJson[key]
                }
            }
        }
    };
    return setRotten;
});