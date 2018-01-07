
            
// Set the NODE_ENV when calling your gulp task
var prodLikeEnvs = ['production', 'staging'];

var _BASE_PATH = _PROJECTS_PATH + 'app/';
module.exports = {
	basePath: _BASE_PATH,
	assetsPath: _BASE_PATH + 'assets/',
    buildDir: _BASE_PATH + 'build/',
    dataDir: _BASE_PATH + 'datas/',
    pageDir: _BASE_PATH + 'pages/',
	scssDir: _BASE_PATH + 'assets/_scss/',
	cssDir: _BASE_PATH + 'assets/css/',
	jsDir: _BASE_PATH + 'assets/js/',
    markedConfig: {
        gfm: true, // Enable GitHub flavored markdown.
        tables: true, // Enable GFM tables. This option requires the gfm option to be true.
        breaks: false, // Enable GFM line breaks. This option requires the gfm option to be true.
        pedantic: false,
        sanitize: false, // Sanitize the output. Ignore any HTML that has been input.
        smartLists: true,
        smartypants: false // Use "smart" typograhic punctuation for things like quotes and dashes.
    },
    frontmatterConfig: {
        language:'yaml',
        delimiters:'---' // Default
    },
    sass: { // https://github.com/sass/node-sass#options
        outputStyle: 'nested', // nested, expanded, compact, compressed
        includePaths: []
    },
    autoprefixer:{
        browsers: ['last 2 versions'],
        cascade: false
    },
    nunjuks:{
        defaultTemplateDir: _BASE_PATH +'templates/',
        searchPaths: [_BASE_PATH +'templates/'],
        templateExt: '.twig',
    },
    bundleResults:{
        dest: _BASE_PATH + 'build/',
        // précéder le path de l'url de prod pour que les chemins soit correct
        // y compris quand on parcours l'arborescence des pages
        pathPrefix: '/', 
        fileName: 'bundle.results'
    },
    copy: [
        {
            src: [
                _BASE_PATH + 'images/**/*.{jpg,png}',
                _BASE_PATH + 'assets/fonts/**/*.{eot,svg,ttf,woff,woff2,otf}'
            ],
            base: _BASE_PATH,
            watch:true
        }
    ]
};