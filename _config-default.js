

// Set the NODE_ENV when calling your gulp task
var prodLikeEnvs = ['production', 'staging'];


module.exports = {
    environement: 'development', // development|production
    buildDir: 'build/',
    dataDir: 'datas/',
    pageDir: 'pages/',
  	scssDir: 'assets/_scss/',
  	cssDir: 'assets/css/',
  	jsDir: 'assets/js/',
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
    mergeMediaQueries: {
      log: false,
      externals: false
    },
    autoprefixer:{
        browsers: ['last 2 versions'],
        cascade: false
    },
    nunjuks:{
        defaultTemplateDir: '',
        searchPaths: [],
        templateExt: '.twig',
    },
    bundleResults:{
        dest: '',
        // précéder le path de l'url de prod pour que les chemins soit correct
        // y compris quand on parcours l'arborescence des pages
        pathPrefix: '/',
        fileName: 'bundle.results'
    },
    bundle: {

    },
    copy: [

    ]
};
