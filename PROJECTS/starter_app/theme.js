// Set the NODE_ENV when calling your gulp task
var prodLikeEnvs = ['production', 'staging'];

var _BASE_PATH = _PROJECTS_PATH + 'starter_app/_src/';

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
				//'./_JS_LIBS/jquery/dist/jquery.js',
				'./_EXTENSIONS/fragments/src/addons/responsive_menu/responsive_menu.js',
				'./_JS_LIBS/jquery.localScroll/jquery.localScroll.js',
                './_JS_LIBS/jquery.scrollTo/jquery.scrollTo.js',
				'./_JS_LIBS/jquery-backstretch/jquery.backstretch.js',
                // Waypoint : déclencher des action suivant la position dans la fenetre du navigateur
                // lazy load, sticky
                //'./_JS_LIBS/jquery-waypoints/lib/jquery.waypoints.js',
                // './_JS_LIBS/jquery-waypoints/lib/waypoints.debug.js',
                //'./_JS_LIBS/jquery-waypoints/lib/shortcuts/sticky.js',
                // Owl.carousel
                //'./_JS_LIBS/owl.carousel/dist/owl.carousel.js',
                //'./_JS_LIBS/timelines/src/vertical-timeline.js',
            ],
            options: {
                uglify: false,
                rev: false, // use hash for file revision
                map:false
            }
        },
        'assets/js/main':{
            scripts: [
                //'./src/assets/js/skel.min.js',
                //'./src/assets/js/util.js',
                //'//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js',
				_BASE_PATH +'assets/js/main.js',
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