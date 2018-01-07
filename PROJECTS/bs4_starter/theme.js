// Set the NODE_ENV when calling your gulp task
var prodLikeEnvs = ['production', 'staging'];

var _BASE_PATH = _PROJECTS_PATH + 'bs4_starter/';

module.exports = {
	bundle: {
        'assets/css/theme':{
            styles:[
                //'//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
                //'./src/assets/css/font-awesome.css',
                _BASE_PATH + 'assets/css/theme.css'                
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