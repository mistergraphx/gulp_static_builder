// Set the NODE_ENV when calling your gulp task
var prodLikeEnvs = ['production', 'staging'];

var _BASE_PATH = _PROJECTS_PATH + 'app/';

module.exports = {
	bundle: {
        'assets/css/main':{
            styles:[
                //'//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
                //'./src/assets/css/font-awesome.css',
                _BASE_PATH + 'assets/css/main.css'                
            ],
            options: {
                minCss: false,
                uglify: false,
                rev: false, // use hash for file revision
                map:false,
                pluginOptions: { // pass additional options to underlying gulp plugins. By default the options object is empty
                    'gulp-clean-css': {
                        keepBreaks: true,
                        keepSpecialComments: 0
                    }
                }
            }
        },
        'assets/js/libs':{
            scripts: [
				_BASE_PATH +'assets/js/email-decode.min.js',
                _BASE_PATH +'assets/js/jquery.min.js',
				_BASE_PATH +'assets/js/bootstrap.min.js',
				_BASE_PATH +'assets/js/jquery.backstretch.min.js',
				_BASE_PATH +'assets/js/jquery.countTo.js',
				_BASE_PATH +'assets/js/jquery.waypoints.min.js',
				//_BASE_PATH +'assets/js/contact.js'
            ],
            options: {
                uglify: false,
                rev: false, // use hash for file revision
                map:false
            }
        },
        'assets/js/theme':{
            scripts: [
                //'./src/assets/js/skel.min.js',
                //'./src/assets/js/util.js',
                //'//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js',
				_BASE_PATH +'assets/js/theme.js',
            ],
            options: {
                uglify: false,
                rev: false, // use hash for file revision
                map:false
            }
        }
    },
    copy: [
        {
            src: [
				_BASE_PATH + 'assets/css/**/*.map',
                _BASE_PATH + 'images/**/*.{jpg,jpeg,gif,svg,png}',
                _BASE_PATH + 'assets/fonts/**/*.{eot,svg,ttf,woff,woff2,otf}'
            ],
            base: _BASE_PATH,
            watch:true
        }
    ]
};