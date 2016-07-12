var gulp        = require( "gulp" );
var babelify    = require( "babelify" );
var browserify  = require( "browserify" );
var connect     = require( "gulp-connect" );
var pug         = require( "gulp-pug" );
var cleanCSS    = require( "gulp-clean-css" );
var compass     = require( "gulp-compass" );
var source      = require( "vinyl-source-stream" );
var buffer      = require( "vinyl-buffer" );
var del         = require( "del" );
var runSequence = require( "run-sequence" );

function onError( error ) {
    console.log( error );
    this.emit( "end" );
}

gulp.task( "scripts", function() {

    var bundler = browserify( "javascript/main.js", {
            debug: true
        } )
        .transform( babelify, {} )
        .on( "error", onError );

    return bundler.bundle()
        .on( "error", onError )
        .pipe( source( "main.js" ) )
        .pipe( buffer() )
        .pipe( gulp.dest( "public/javascripts/" ) );
} );

gulp.task( "connect", function() {
    return connect.server( {
        root: "public"
    } );
} );

gulp.task( "assets", function() {
    return gulp.src( [ "assets/**/*", "!assets/.gitkeep" ] )
        .pipe( gulp.dest( "public" ) );
} );

gulp.task( "pug", function() {
    return gulp.src( "pug/*.pug" )
        .pipe( pug() )
        .pipe( gulp.dest( "public" ) );
} );

gulp.task( "watch", function() {
    gulp.watch( "javascript/**/*.js", [ "scripts" ] );
    gulp.watch( "pug/**/*.pug", [ "pug" ] );
    gulp.watch( "scss/**/*.scss", [ "scss" ] );
    gulp.watch( "assets/**", [ "assets" ] );
} );

gulp.task( "scss", function() {
    return gulp.src( "scss/*.scss" )
        .pipe( compass( {
            css: "public/stylesheets",
            sass: "scss"
        } ) )
        .on( "error", onError )
        .pipe( cleanCSS() )
        .pipe( gulp.dest( "public/stylesheets" ) );
} );

gulp.task( "clean", function() {
    return del( [ "public" ] );
} );

gulp.task( "default", ( callback ) => runSequence( "clean", [ "scripts", "pug", "scss", "watch", "assets", "connect" ], callback ) );
gulp.task( "build", ( callback ) => runSequence( "clean", [ "pug", "scss", "assets" ], callback ) );
