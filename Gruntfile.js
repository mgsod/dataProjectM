/**
 * Created by Administrator on 2016/5/16.
 * grunt任务。。。
 * 复制文件到build，压缩文件，检查标准，修改时间戳，监听文件，清理文件夹
 */
var version = require('./src/js/version/version');
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.initConfig({
        sonarRunner: {
            analysis: {
                options: {
                    debug: true,
                    separator: '\n',
                    sonar: {
                        host: {
                            url: "http://codecheck.dookoo.net"
                        },
                        projectKey: 'dmpfs',
                        projectName: 'dmpfs',
                        login:"ckey",
                        password:"ckey9182",
                        projectVersion: version,
                        sources: ['./'].join(','),
                        language: ['js', 'html', 'css'],
                        sourceEncoding: 'UTF-8',
                        exclusions: ['src/css/lib/**','src/html/**','src/template/**','src/css/public/api/**', 'src/js/lib/**', 'node_modules/**', 'build/**', 'src/js/modules/api/**'].join(',')
                    }
                }
            }
        },
        connect: {
            options: {
                // 服务器端口号
                port: 8000,
                // 服务器地址(可以使用主机名localhost，也能使用IP)
                hostname: '0.0.0.0',
                // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                base: 'src'
            },
            livereload: {
                options: {
                    open: 'http://localhost:<%= connect.options.port %>/html/api/index.html'
                }
            }
        },
        //jshint
        jshint: {
            client: {
                src: ['src/js/(animation,controllers,modules,util,view,widget)/*.js'],
                options: {
                    jshintrc: 'src/.jshintrc'
                }
            }
        },
        //clean
        clean: {
            build: 'build'
        },
        concat: {
            options: {},
            dist: {
                src: ['build/js/modules/api/**/*.js'],//src文件夹下包括子文件夹下的所有文件
                dest: 'build/js/modules/api/ck.js'//合并文件在dist下名为built.js的文件
            }
        },
        //copy
        copy: {
            main: {
                files: [{
                    //css
                    expand: true,
                    cwd: 'src/css',
                    src: '**/*.*',
                    dest: 'build/css',
                    options: {
                        timestamp: true
                    }
                }, {
                    //images
                    expand: true,
                    cwd: 'src/images',
                    src: '**/*.{png,jpg}',
                    dest: 'build/images',
                    options: {
                        timestamp: true
                    }
                }, {
                    //vender
                    expand: true,
                    cwd: 'src/vender',
                    src: '**/*',
                    dest: 'build/vender',
                    options: {
                        timestamp: true
                    }
                }, {
                    //js
                    expand: true,
                    cwd: 'src/js',
                    src: '**/*',
                    dest: 'build/js',
                    options: {
                        timestamp: true
                    }
                }
                ]
            }
        },
        //uglify
        uglify: {
            release: {
                files: [{
                    expand: true,
                    cwd: 'build/js/view',
                    src: ['**/*.js'],
                    dest: 'build/js/view',
                    ext: '.js',
                    options: {
                        timestamp: true
                    }
                }, {
                    expand: true,
                    cwd: 'build/js/util',
                    src: ['**/*.js'],
                    dest: 'build/js/util',
                    ext: '.js',
                    options: {
                        timestamp: true
                    }
                }, {
                    expand: true,
                    cwd: 'build/js/router',
                    src: ['**/*.js'],
                    dest: 'build/js/router',
                    ext: '.js',
                    options: {
                        timestamp: true
                    }
                }]
            },
            build: {
                src: 'build/js/modules/api/ck.js',//压缩源文件是之前合并的buildt.js文件
                dest: 'build/js/modules/api/ck.js'//压缩文件为built.min.js
            }
        },
        //replace
        replace: {
            release: {
                options: {
                    patterns: [
                        {
                            match: /\.js\"/g,
                            replacement: function (matchedWord) {
                                return ".js?t=" + new Date().getTime() + "\"";
                            }
                        }, {
                            match: /\.css\"/g,
                            replacement: function (matchedWord) {
                                return ".css?t=" + new Date().getTime() + "\"";
                            }
                        }, {
                            match: /\.png\"/g,
                            replacement: function (matchedWord) {
                                return ".png?t=" + new Date().getTime() + "\"";
                            }
                        }, {
                            match: /\.jpg\"/g,
                            replacement: function (matchedWord) {
                                return ".jpg?t=" + new Date().getTime() + "\"";
                            }
                        }
                    ]
                },
                files: [
                    {expand: true, cwd: 'src', src: ['html/**', 'template/**'], dest: 'build/'}
                ]
            }
        },
        //watch
        watch: {
            client: {
                files: ['*.html', 'css/*', 'js/*', 'images/**/*'],
                options: {
                    livereload: true
                }
            },
            // lint js files when they change, and then copy them over to build directory
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['jshint', 'copy']
            },

            html: {
                files: ['src/html/**', 'src/template/**'],
                tasks: ['copy', 'replace']
            },
            css: {
                files: ['src/css/**/*.css'],
                tasks: ['copy']
            },
            images: {
                files: ['src/images/**/*.{png,jpg}'],
                tasks: ['copy']
            },
            voiding: {
                files: ['src/public'],
                tasks: ['copy']
            },
            rebuild: {
                files: ['Gruntfile.js'],
                tasks: ['jshint']
            }
        }
    });
    // 'uglify:release', 
    grunt.registerTask('dev', ['jshint', 'clean', 'copy', 'replace']);
    grunt.registerTask('gamma', ['jshint', 'clean', 'copy','replace', 'concat', 'uglify:build']);
    grunt.registerTask('http', ['connect:livereload', 'watch:client']);
    grunt.registerTask('sonar', ['sonarRunner:analysis']);
};