var gulp       = require( "gulp" );
var babel      = require( "gulp-babel" );
var sourcemaps = require( "gulp-sourcemaps" );
var connect    = require( "gulp-connect" );
var jade       = require( "gulp-jade" );
var concat     = require( "gulp-concat" );
var sass       = require( "gulp-sass" );
var minifyCSS  = require( "gulp-minify-css" );

gulp.task( "scripts", function() {
    gulp.src( "javascript/main.js" )
        .pipe( sourcemaps.init() )
        .pipe( babel() )
        .pipe( concat( "main.js" ) )
        .pipe( sourcemaps.write( "." ) )
        .pipe( gulp.dest( "public/javascripts" ) );
} );

gulp.task( "connect", function() {
    connect.server( {
        root: "public"
    } );
} );

gulp.task( "assets", function() {
    gulp.src( [ "assets/**/*", "!assets/.gitkeep" ] )
        .pipe( gulp.dest( "public" ) );
} );

gulp.task( "jade", function() {
    gulp.src( "jade/*.jade" )
        .pipe( jade() )
        .pipe( gulp.dest( "public" ) );
} );

gulp.task( "watch", function() {
    gulp.watch( "javascripts/**/*.js", [ "scripts" ] );
    gulp.watch( "jade/**/*.jade", [ "jade" ] );
    gulp.watch( "scss/**/*.scss", [ "scss" ] );
    gulp.watch( "assets/**", [ "assets" ] );
} );

gulp.task( "scss", function() {
    gulp.src( "scss/*.scss" )
        .pipe( sass().on( "error", sass.logError ) )
        .pipe( minifyCSS() )
        .pipe( gulp.dest( "./public/stylesheets" ) );
} );

gulp.task( "default", [ "scripts", "jade", "scss", "watch", "connect" ] );