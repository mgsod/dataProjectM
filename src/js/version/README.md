##version控制
     这儿其实就是一个添加你版本需要的东西
     var version = ['1.0.0','1.2.0','1.2.2'];
     var getLastVersion = function () {
         return version[version.length-1]
     };
     exports.version = getLastVersion();
     只需要在这儿 的version这个list 后面添加上版本号就行了。
     这个地方主要是sonar会用到。
    