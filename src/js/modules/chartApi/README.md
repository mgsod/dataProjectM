##**chart设计**
###_简介_
    canvas集成的echarts框架作为图表底层来进行画图,echarts主要封装到/modules/palette.js中
    引用文件为chart.js
    主要模块文件有3大类
    1. optionsBar  //选项栏
    2. palette     //* 图表综合体
    3. setRotten   //设置栏
    链式结构组合框架
    
### chart
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
            }
        
    
####_optionsBar_ 
     主要做图表选择
    {
        setType://目前有"line","bar","pie"
        setTypeLine: //设置线图
        setTypeBar: //设置柱状图
        setTypePie: //设置饼图
        setToolBox://自定义的toolbox
        ...
    }
    
####_palette_
    主要做合成数据，和制作出图表
    {
        createChart://创建图表
        resetData: //重置图表
        makeData: //制作数据
        getData:  //获取数据
        getChartSetting: //获取图表所有参数
        ...
    }
    
####_setRotten_
    主要做设置参数，和获取数据
    {
       setTextStyle://设置文字
       setAxisPointer://悬浮文案
       setDataZoom://数据量大的时候，自动设置此参数,可以手动设置
       setGrid://设置坐标系
       ... 
    }