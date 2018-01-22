##work编写规则
    dataImport是第一版代码，很丑  
    剩下的works都是可以参考的代码
    下面介绍一下结构
    init方法//初始化时 调用的方法
    init方法会触发一个加载function的方法    importFunction();
      /**
             * 加载功能模块
             */
            importFunction: function () {
                var that = this;
                that.makeData();
                that.getHtml();
                that.viewFunction();
            },
     importFunction 主要会做 3件事
     加载data，就是那些基础数据的配置啊 等等的
     获取页面，就是去获取work的html页面 通过ajax // 这一串可以直接copy来用
     加载页面事件, 就是去给workHtml上的事件进行注册
     