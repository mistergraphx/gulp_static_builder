/* # Static Builder

## Node

Node 7 - documentation
https://nodejs.org/dist/latest-v7.x/docs/api/

## Sources

Exemple de génération de pages avec gulp
http://silvenon.com/simple-layouting-with-gulp/

Utilisation avancée de gulp pour générer des sites statiques,
avec une tache pour générer un nouveau post depuis la CLI
https://autumnlansing.com/articles/static-site-generators

Un générateur de sites staiques  :
https://www.npmjs.com/package/gulp-static-site
https://github.com/wires/gulp-static-site/blob/master/index.js

Construction de l'index/summary et de l'arboressence pour générer le menu de navigation
https://www.npmjs.com/package/archy
https://github.com/wires/gulp-filetree

Un plugin gulp de génération de hierarchies et construction de menus
https://www.npmjs.com/package/gulp-nav

Idem , utilise [Forestry](https://github.com/iamcdonald/forestry) une librairie spécifique a la gestion d'arbo
https://www.npmjs.com/package/gulp-file-tree


http://stackoverflow.com/questions/32810072/gulp-front-matter-markdown-through-nunjucks


## Nunjuks

Explcations sur la résolution des path lors de la template inherance avec nunjuks
http://stackoverflow.com/questions/35725543/a-gulp-workflow-with-markdown-and-nunjucks

https://gist.github.com/kerryhatcher/1382950af52f3082ecdc668bba5aa11b

@todo - Envisager un workflow de publication auto avec travis-ci et prose sur Github pages
        http://putaindecode.io/fr/articles/ci/travis-ci/
        Exemple de génération de site static et edition/publication sur Github Pages
        http://blog.crushingpennies.com/a-static-site-generator-with-gulp-proseio-and-travis-ci.html


@todo - html min - compression du html
@todo - imagemin/image_resize - optimisation des images client auto

*/

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
//https://www.npmjs.com/package/gulp-plumber
var plumber = require('gulp-plumber');
// Templating
// Nunjuks wrapper for gulp : https://www.npmjs.com/package/gulp-nunjucks-render
// https://www.npmjs.com/package/nunjucks
// https://mozilla.github.io/nunjucks/
var nunjucks = require('nunjucks');
// Html minification
// https://www.npmjs.com/package/gulp-htmlmin
var htmlmin = require('gulp-htmlmin');

// https://www.npmjs.com/package/gulp-data
var data = require('gulp-data');
// Gulp-wrap permet d'assembler les data et les templates en appliquant au final render
// Utilise consolidate, ce qui peut fausser la definitions des path
// https://www.npmjs.com/package/consolidate
// https://www.npmjs.com/package/gulp-wrap
var wrap = require('gulp-wrap');
// https://www.npmjs.com/package/gulp-gray-matter
// https://www.npmjs.com/package/gray-matter#options
// On utilise gray-matter et non le plugin gulp
var matter = require('gray-matter');

// Markdown wrappers
// https://www.npmjs.com/package/nunjucks-markdown
// https://www.npmjs.com/package/gulp-marked [deprecated] cd gulp-markdown
// On utilise marked directement
var marked = require('marked');

// Navigation builder
// https://www.npmjs.com/package/gulp-nav
var nav= require('gulp-nav');

// https://www.npmjs.com/package/gulp-bundle-assets
var bundle = require('gulp-bundle-assets');
    // include
    // https://github.com/robrich/gulp-if
    // https://www.npmjs.com/package/lazypipe
    //var lazypipe = require('lazypipe');

// https://www.npmjs.com/package/gulp-sass
// https://github.com/sass/node-sass#options
var sass = require('gulp-sass');
// https://www.npmjs.com/package/gulp-autoprefixer
var autoprefixer = require('gulp-autoprefixer');
// https://www.npmjs.com/package/gulp-merge-media-queries
var mergeMediaQueries = require('gulp-merge-media-queries');

// Sourcemapping
// https://www.npmjs.com/package/gulp-sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// Sitemap
// https://www.npmjs.com/package/gulp-sitemap
// https://www.sitemaps.org/fr/protocol.html
var sitemap = require('gulp-sitemap');

// Utils
var rename = require("gulp-rename");
var spy = require("through2-spy");
var assignIn = require('lodash.assignin');
var _if = require('gulp-if');

// Node
// https://nodejs.org/docs/latest/api/path.html#path_path_basename_path_ext
var path = require('path');
// https://nodejs.org/docs/latest/api/fs.html
var fs = require('fs');

// Get args from command line
// https://www.npmjs.com/package/minimist
var argv = require('minimist')(process.argv.slice(2));

// Povide styleTransformation pipes used in the bundle config
// called with `global.styleTransforms`
// example: https://github.com/dowjones/gulp-bundle-assets/tree/master/examples/custom-transforms
// unused due to sass config not available in config.js
// global.stylesTransforms = require('./stylesTransforms.js');

/*

init de la configuration globale par default
chargement de la config du projet en cours
surcharge de la configuration par defaut par celle du projet

*/

// Base PROJECTS folder
_PROJECTS_PATH = "./PROJECTS/";

// Default configuration
var _config = require('./_config-default');

/** # Project Loader

Chargement du fichier de config passé en argument de la commande.

`gulp task --project=project_name`

@requires       minimist
@see            https://www.npmjs.com/package/minimist
@see            https://github.com/gulpjs/gulp/blob/master/docs/recipes/using-external-config-file.md
@see            http://istrategylabs.com/2015/02/swept-up-in-the-stream-5-ways-isl-used-gulp-to-improve-our-process/
*/
var project = require(_PROJECTS_PATH + argv.project + '/app.js');


var config = assignIn(_config, project);

function getEnv(config){
  if(config.environement == 'production'){
    return process.env.NODE_ENV = 'production';
  }else {
    return process.env.NODE_ENV = 'development';
  }
};


// App config
// necessaire pour la sitemap générée
var appConfig = getJSONDataFile(config.dataDir + 'app.json');

/* Nunjuks loader

 On cree un loader pour l'héritages des templates
 soit relatif au premier niveau du template demandé
 et non a la racine du projet

 https://mozilla.github.io/nunjucks/fr/api.html#filesystemloader

FileSystemLoader([searchPaths], [opts])
*/
var loader = new nunjucks.FileSystemLoader(config.nunjuks.searchPaths);

function getJSONDataFile(filePath){
    if(fs.existsSync(filePath))
        return JSON.parse(fs.readFileSync(filePath));
    else
        console.log('No file found for :' + filePath);
}

/* Building an index of elements : pages,post

Ré-écris les url pour quelles soitent relatives a la racine du site static et non au projet

https://medium.com/@bushwazi/super-simple-static-site-generation-with-node-jade-gulp-and-json-9ded83508fa6#.hvt5p0bqm
https://github.com/Bushwazi/static-site-generation-with-jade-gulp/blob/master/_src/gulpfile.js

@param baseDir - racine du sossier de travail qui est surpprimée de l'url pour qu'elle soit relative à l'index
@param objectType - Non utilisé page, post

*/
var fsRecurs = require('fs-readdir-recursive');
var util = require('util');

var summaryJSON = {} ;

function buildIndex(baseDir, objectType){
    var counter = 0 ;
    files = fsRecurs(baseDir);
    files.map(function(url,ind,arr){
        //current = fs.readFileSync(pageDir + url, 'utf-8')
        file = matter.read(baseDir + url);

        //url =  path.dirname(file.path).replace(config.pageDir, '') + path.basename(file.path,'.md') + '.html';
        // slice enlève le dernier / présent dans
        url = path.dirname(file.path).replace(baseDir.slice(0,-1), '') + '/'+ path.basename(file.path,'.md') + '.html';
        //console.log(url);

       summaryJSON[objectType + '-' + counter] = {
            'path': file.path,
            'url': url,
            'title': file.data.title,
            'description': file.data.description
        };

        counter++;
    });

    return  summaryJSON;
}

gulp.task('set-env', function(){
   return console.log('Environement = ' + getEnv(config));
});

// Info and function in a VinylStream : https://www.npmjs.com/package/gulp-tap/
// UnUsed : debug and test only
gulp.task('test', function(){
    return gulp.src('src/pages/**/*.md')
        .pipe(data(function(file){
            var data = {};
            //var xtra = {}
            if (file.data) {
              data = assignIn(file.data, data);
              // or just data = file.data if you don't care to merge. Up to you.
            }
            // Any additional data file for this file
            // https://www.npmjs.com/package/glob pour tester si les fichiersxtra sont {json,yaml}
            // voir http://stackoverflow.com/questions/20679495/using-a-wildcard-glob-minimatch-in-an-fs-readfile-inside-express-app
            // attention on attrape pour tout les fichiers du meme nom meme dans toute l'arbo
            if(fs.existsSync(config.dataDir + path.basename(file.path,'.md') + '.json'))
                data.xtra = JSON.parse(fs.readFileSync(config.dataDir + path.basename(file.path,'.md') + '.json'));

            else
                console.log('No Json file found for :' + file.path);

            // Extract/split file datas  extrac content|frontmatter
            var fileData = matter.read(file.path);
            // merge xtra + frontmatter
            data.frontmater = assignIn(fileData.data, data.xtra);

            // Nunjuk.config pour les partials utilisées dans le content
            var env = nunjucks.configure(config.templateDir);

            // On applique le rendu nunjuk (data , partials)
            // au content et on traite le markdown
            data.content = md(env.renderString(String(fileData.content),data.frontmater));


            console.log(data.content);
            return data;
        }))
        //.pipe(matter.read(data.file.buffer))
        .pipe(spy.obj(function(file) {
            console.log(file.data);
        }));

});
// Nunjuk.config pour les partials utilisées dans le content
// var templateEngine = nunjucks.configure(config.templateDir);
gulp.task('generate', function () {
    return gulp.src(config.pageDir + '**/*.md')
        .pipe(data(function(file) {
            var data = {};
            var xtra = {};
            if (file.data) {
              data = assignIn(file.data, data);
              // or just data = file.data if you don't care to merge. Up to you.
            }
            // Y'a t'il un fichier json de datas supplémentaires a fournir
            if(fs.existsSync(config.dataDir + path.basename(file.path,'.md') + '.json')) {
                data.datas = JSON.parse(fs.readFileSync(config.dataDir + path.basename(file.path,'.md') + '.json'));
            }
            else {
                data.datas = null;
                console.log('No Json file found for :' + file.path);
            }
            // injecter les settings/datas disponibles ensuites dans les templates
            // assets, locals,
            data = assignIn(data, {
                assets: getJSONDataFile(config.dataDir + config.bundleResults.fileName + '.json'),
                app : getJSONDataFile(config.dataDir + 'app.json'),
                summary: buildIndex(config.pageDir,'page')
            });
            // On extrait et sépare entete/contenu
            // Extract/split file datas  extrac content|frontmatter
            var frontmatter = matter.read(file.path);


            // Les datas du frontmatter doivent êtres accessibles
            // au premier niveau de file.data pour être correctements utilisées par gulp-wrap, gulp-nav
            // et être propagées dans l'héritage des templates
            data = assignIn(data,frontmatter.data);
            // merge xtra + frontmatter
            // data = assignIn(data.environement, frontmatter.data);

            // Nunjuk.config pour les partials utilisées dans le content
            nunjucks.configure(config.templateDir);
            var compile = new nunjucks.Environment();

            // On traite les data avec nunjuks.renderString
            // On applique le rendu nunjuk (data , partials) au content
            // on utilise gulp-wrap pour mettre a jour file.content
            file.contents = new Buffer(compile.renderString(frontmatter.content.toString(), data));

            marked.setOptions({
                highlight: function (code) {
                    return require('highlight.js').highlightAuto(code).value;
                }
            });

            marked(file.contents.toString(), config.markedConfig, function(err,data){
                file.contents = new Buffer(data);
            });

            return data;
        }))
        .pipe(spy.obj(function(file) {
            console.log('-------------------------');
            console.log(file.data);
        }))
        // Navigation construct
        .pipe(nav())
        // wrap
        .pipe(wrap(function(data) {
                        if(fs.existsSync(config.nunjuks.defaultTemplateDir + data.layout + config.nunjuks.templateExt)) {
                            var template = fs.readFileSync(config.nunjuks.defaultTemplateDir + data.layout + config.nunjuks.templateExt).toString();
                            return template;
                        }else {
                            return fs.readFileSync(config.nunjuks.defaultTemplateDir + 'page' + config.nunjuks.templateExt).toString();
                        }
                    },
                    function(file){
                        //file.data = assignIn(file.data,{
                        //    navigation: file.data.nav
                        //});
                        //console.log(file.data);
                        return file.data;
                    },{// Options : https://github.com/tj/consolidate.js/blob/master/lib/consolidate.js#L1118
                        engine: 'nunjucks',
                        nunjucksEnv: '',
                        loader: loader // @see loader
                    }
        ))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(_if(function(){
            if(getEnv(config) == 'production')
              return true;
          },htmlmin({
            // https://github.com/kangax/html-minifier
            collapseWhitespace: true
          })
        ))
    .pipe(gulp.dest(config.buildDir))
    .on('end', reload);
});

gulp.task('styles', function(){
    //console.log(config.bundle.main.options.transforms);
    return gulp.src(config.scssDir+'*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass(config.sass))
        //.pipe(autoprefixer(config.autoprefixer))
        //.pipe(mergeMediaQueries(config.mergeMediaQueries))
        .pipe(sourcemaps.write('./', {
  				//includeContent: false,
  				sourceRoot: '../../../assets/_scss',
  				destPath: config.buildDir + config.bundleResults.pathPrefix ,
  				//sourceMappingURLprefix: project.bundleConfig.dest + 'assets/css'
			  }))
    .pipe(gulp.dest(config.cssDir))
    .pipe(reload({ stream: true }));
});

gulp.task('bundle', function(){
    //console.log(config.bundle.main.options.transforms);
    return gulp.src(_PROJECTS_PATH + argv.project + '/theme.js') // no config object but file required
        .pipe(bundle())
        .pipe(bundle.results({
            dest: config.dataDir,
            pathPrefix: config.bundleResults.pathPrefix,
            fileName: config.bundleResults.fileName,
        }))
    .pipe(gulp.dest(config.buildDir + config.bundleResults.pathPrefix));
});


gulp.task('sitemap', function(){
    return gulp.src(config.buildDir + '/**/*.html')
        .pipe(sitemap({
            siteUrl: appConfig.url
        }))
        .pipe(gulp.dest(config.buildDir));
});

gulp.task('default',['styles','bundle','generate','sitemap'],function(){
    browserSync.init({
        server: config.buildDir
    });

    gulp.watch(config.scssDir + '**/*.scss',['styles']);
    gulp.watch(config.basePath +'**/*.{json,twig,md}',['generate','sitemap']);
    gulp.watch(config.basePath + 'theme.js',['bundle']);
    gulp.watch(config.assetsPath + '**/*.{css,js}',['bundle']);

});
