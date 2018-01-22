/**
 * Created by ckey on 2017/6/7.
 */
(function ($) {
    // $C.init({id: 'test'}).createRect({x: 200, y: 50, height: 50, width: 10}).createCircle().addMouseListener(); 使用
    var canvasUtil = {
        canvas: null,
        ctx: null,
        OPTIONS: {id: '', isCreateOne: false, setTarget: null, textColor: '#000000', textFont: "normal 16px 微软雅黑"},
        canvasObjList: [],
        offset: {x: 0, y: 0},
        /**
         * {id:'',isCreateOne:'false'}
         * @param json
         * @returns {canvasUtil}
         */
        init: function (json) {
            var that = this;
            $.extend(that.OPTIONS, json || {});
            if (that.OPTIONS.isCreateOne) {
                that.canvas = that._createCanvas();
            } else {
                that.canvas = document.getElementById(json.id);
            }
            that.ctx = that.canvas.getContext('2d');
            that._getOffset();
            return that;
        },
        /**
         * 创建矩形
         * @param json
         * @returns {canvasUtil}
         */
        createRect: function (json) {
            json = json || {x: 0, y: 0, width: 80, height: 100};
            var that = this;
            that.ctx.beginPath();
            that.ctx.fillStyle = json.color || '#FF0000';
            that.ctx.fillRect(json.x || 0, json.y || 0, json.width || 80, json.height || 100);
            that.ctx.closePath();
            var obj = that.createNewCanvasObj('rect', {name: 'data'}, json);
            that.drawText(obj);
            return that;
        },
        updateRect: function (json) {
            json = json || {};
            var that = this;
            that.ctx.beginPath();
            that.ctx.fillStyle = json.color || '#FF0000';
            that.ctx.fillRect(json.x, json.y, json.width, json.height);
            that.ctx.closePath();
        },
        /**
         * 创建线条
         * @param json
         * @returns {canvasUtil}
         */
        createLine: function (json) {
            json = json || {};
            var that = this;
            return that;
        },
        updateLine: function (json) {
            json = json || {};
            var that = this;
            return that;
        },
        /**
         * {color:'gray',left:10,top:10,r:30}
         * @param json
         * @returns {canvasUtil}
         */
        createCircle: function (json) {
            json = json || {x: 30, y: 30, r: 30};
            var that = this;
            that.ctx.beginPath();
            that.ctx.fillStyle = json.color || "red";
            that.ctx.arc(json.x || 30, json.y || 30, json.r || 30, 0, Math.PI * 2);
            that.ctx.fill();
            that.ctx.closePath();
            var obj = that.createNewCanvasObj('circle', {name: 'data月4让大发'}, json);
            that.drawText(obj);
            return that;
        },
        updateCircle: function (json) {
            var that = this;
            that.ctx.beginPath();
            that.ctx.fillStyle = json.color || "red";
            that.ctx.arc(json.x, json.y, json.r, 0, Math.PI * 2);
            that.ctx.fill();
            that.ctx.closePath();
        },
        drawText: function (obj) {
            var that = this;
            var options = that.OPTIONS;
            that.ctx.fillStyle = options.textColor;//颜色
            that.ctx.font = options.textFont;//字体
            that.ctx.textBaseline = "middle";//竖直对齐
            that.ctx.textAlign = "center";//水平对齐　
            if (obj.type == 'rect') {
                that.ctx.fillText(obj.data.name.substr(0, 4), obj.json.width / 2 + obj.json.x, obj.json.height / 2 + obj.json.y, obj.json.width || obj.json.r);
            } else {
                that.ctx.fillText(obj.data.name.substr(0, 4), obj.json.x, obj.json.y, obj.json.width || obj.json.r);//绘制文字
            }
            return that;
        },
        /**
         * 创建canvasObj
         * @param type
         * @param data
         * @param json
         */
        createNewCanvasObj: function (type, data, json) {
            var obj = new canvasObj(type, data, json);
            this.canvasObjList.push(obj);
            return obj;
        }
        ,
        /**
         * 删除canvasObj
         * @param obj
         */
        deleteCanvasObj: function (obj) {
            var index = this.canvasObjList.indexOf(obj);
            this._deleteListItem(this.canvasObjList, index);
        }
        ,
        /**
         * 添加事件
         * @returns {canvasUtil}
         */
        addMouseDragListener: function () {
            var that = this;
            that.canvas.onmousedown = function (ev) {
                var e = ev || event;
                var x = e.clientX - that.offset.x;
                var y = e.clientY - that.offset.y;
                that._drag(x, y);
            };
            return that;
        }
        ,
        addMouseLineListener: function () {
            var that = this;
            that.canvas.onmousedown = function (ev) {
                var e = ev || event;
                var x = e.clientX - that.offset.x;
                var y = e.clientY - that.offset.y;
                that._drawLine(x, y);
            };
            return that;
        }
        ,
        /**
         *
         * @param callBack
         */
        addMouseClickListener: function (callBack) {
            var that = this;
            that.canvas.onmousedown = function (ev) {
                var e = ev || event;
                var x = e.clientX - that.offset.x;
                var y = e.clientY - that.offset.y;
                var item = that._choose(x, y);
                callBack(item)
            }
        }
        ,
        /**
         * 移除mouse事件
         * @returns {canvasUtil}
         */
        removeMouseListener: function () {
            var that = this;
            that.canvas.onmousedown = null;
            return that;
        }
        ,
        /**
         * 创建canvasDom
         * @returns {Element}
         * @private
         */
        _createCanvas: function () {
            var canvas = document.createElement('canvas');
            canvas.height = 400;
            canvas.width = 400;
            document.querySelector(this.OPTIONS.setTarget).appendChild(canvas);
            return canvas;
        }
        ,
        /**
         * 获取canvas的偏移量
         * @private
         */
        _getOffset: function () {
            var that = this;
            that.offset.x = that.canvas.offsetLeft;
            that.offset.y = that.canvas.offsetTop;
        }
        ,
        /**
         * 又拖又拽
         * @param x
         * @param y
         * @private
         */
        _drag: function (x, y) {
            var that = this;
            var obj = that._checkCanvasObj(x, y);
            if (obj != null) {
                that.canvas.onmousemove = function (ev) {
                    var e = ev || event;
                    var ax = e.clientX - that.offset.x;
                    var ay = e.clientY - that.offset.y;
                    that._clearPlane();
                    obj.json.x = ax;
                    obj.json.y = ay;
                    if (obj.type == 'rect') {
                        obj.json.x = ax - obj.json.width / 2;
                        obj.json.y = ay - obj.json.height / 2;
                    }
                    that.canvasObjList.push(obj);
                    that._resetPlane();
                };
                that.canvas.onmouseup = function () {
                    that.canvas.onmousemove = null;
                    that.canvas.onmouseup = null;
                };
            }
        }
        ,
        _drawLine: function (x, y) {
            var that = this;
            var startPoint = {x: x, y: y};
            that.canvas.onmousemove = function (ev) {
                var e = ev || event;
                var ax = e.clientX - that.offset.x;
                var ay = e.clientY - that.offset.y;
                that._clearPlane();
            }
        }
        ,
        /**
         * 选择item
         * @param x
         * @param y
         * @returns {*}
         * @private
         */
        _choose: function (x, y) {
            var that = this;
            return that._getCanvasObj(x, y);
        }
        ,
        /**
         * 清空面板
         * @private
         */
        _clearPlane: function () {
            var that = this;
            that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
        }
        ,
        /**
         * 检查canvasObj
         * @param x
         * @param y
         * @returns {*}
         * @private
         */
        _checkCanvasObj: function (x, y) {
            var that = this;
            var i = 0;
            var canvasObj = null;
            while (true) {
                if (typeof that.canvasObjList[i] == 'undefined') {
                    break
                }
                var json = that.canvasObjList[i].json;
                var type = that.canvasObjList[i].type;
                var obj = that._getArea(type, json.x, json.y, json.width || json.r, json.height || json.r);
                if (obj.minX <= x && obj.maxX > x && obj.minY <= y && obj.maxY > y) {
                    canvasObj = that.canvasObjList[i];
                    that._deleteListItem(that.canvasObjList, i);
                    break
                }
                i++;
            }
            return canvasObj
        }
        ,
        /**
         * 删除item
         * @param list
         * @param index
         * @private
         */
        _deleteListItem: function (list, index) {
            list.splice(index, 1);
        }
        ,
        /**
         * 获取canvasObj
         * @param x
         * @param y
         * @returns {*}
         * @private
         */
        _getCanvasObj: function (x, y) {
            var that = this;
            var i = 0;
            var canvasObj = null;
            while (true) {
                if (typeof that.canvasObjList[i] == 'undefined') {
                    break
                }
                var json = that.canvasObjList[i].json;
                var type = that.canvasObjList[i].type;
                var obj = that._getArea(type, json.x, json.y, json.width || json.r, json.height || json.r);
                if (obj.minX <= x && obj.maxX > x && obj.minY <= y && obj.maxY > y) {
                    canvasObj = that.canvasObjList[i];
                    break
                }
                i++;
            }
            return canvasObj
        }
        ,
        /**
         * 获取area
         * @param type
         * @param x
         * @param y
         * @param width
         * @param height
         * @returns {{minX: *, minY: *, maxX: *, maxY: *}}
         * @private
         */
        _getArea: function (type, x, y, width, height) {
            var obj = {};
            if (type == 'rect') {
                obj = {
                    minX: x,
                    minY: y,
                    maxX: x + width,
                    maxY: y + height
                };
            } else if (type == 'circle') {
                obj = {
                    minX: x - width,
                    minY: y - height,
                    maxX: x + width,
                    maxY: y + height
                };
            }
            return obj;
        }
        ,
        /**
         * 重新画图
         * @private
         */
        _resetPlane: function () {
            var that = this;
            that.canvasObjList.forEach(function (obj) {
                switch (obj.type) {
                    case 'rect':
                        that.updateRect(obj.json);
                        that.drawText(obj);
                        break;
                    case 'circle':
                        that.updateCircle(obj.json);
                        that.drawText(obj);
                        break;
                    case 'line':
                        that.updateLine(obj.json);
                    default:
                        console.log('此type未在_resetPlane里注册');
                        break;
                }
            });
            /* switch (obj.type) {
             case 'rect':
             that.updateRect(obj.json);
             break;
             case 'circle':
             that.updateCircle(obj.json);
             break;
             default:
             console.log('此type未在_resetPlane里注册');
             break;
             }*/
        }
    };
    var canvasObj = function (type, data, json) {
        this.type = type;
        this.data = data;
        this.json = json;
    };
    if (typeof define != 'undefined') {
        return canvasUtil
    } else {
        window.$C = canvasUtil;
    }
})($);