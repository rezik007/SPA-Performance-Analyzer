var gulp = require('gulp'), babel = require('gulp-babel'), serverLive = require('gulp-server-livereload'),
    browserify = require('browserify'), fs = require('fs'), express = require('express'),
    bodyParser = require('body-parser'), mkdirp = require('mkdirp'), gulpsync = require('gulp-sync')(gulp),
    uglify = require('gulp-uglify'), pump = require('pump'), app = express(), port = process.env.PORT || 3000, postResponse;

gulp.task('buildFolder', function() {
    mkdirp('./widget/build', function(err) {
        if (err) {console.error(err)} else {console.log('"build/" folder created!')}
    });
});
gulp.task('copyBuild', function() {
    gulp.src('./widget/build/widget.js')
        .pipe(gulp.dest('./website/'));
})
gulp.task('compress', function(cb) {
    pump([
        gulp.src('./widget/build/widget.js'),
        uglify(),
        gulp.dest('./widget/build')
    ], cb);
});
gulp.task('babel', function() {
    gulp.src('./widget/dev/js/widget.js')
        .pipe(babel({
            presets: [ 'es2015' ]
        }))
        .on('error', function(e) {
            console.log('>>> ERROR', e);
            // emit here
            this.emit('end');
        })
        .pipe(gulp.dest('./widget/build'))
});
gulp.task('browserify', function() {
    return browserify('./widget/build/widget.js')
        .transform('babelify', {presets: [ 'es2015' ]})
        .bundle()
        .pipe(fs.createWriteStream('./widget/build/widget.js'));
});
gulp.task('build', gulpsync.sync(['buildFolder','babel', 'browserify', 'compress', 'copyBuild']));
gulp.task('dev', gulpsync.sync(['buildFolder','babel', 'browserify', 'copyBuild']), function() {
    gulp.src(['./website/', 'widget/build/'])
        .pipe(serverLive({
            livereload: true,
            directoryListing: false,
            open: true
        }));
    gulp.watch('./widget/dev/js/widget.js', gulpsync.sync(['babel', 'browserify', 'copyBuild']));
    // fake-backend start
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.post('/tracker/view', function(req, res) {
        postResponse = generateID().toString();
        res.send(postResponse);
        console.log('Request:', req.body);
        console.log('Response:', postResponse);
    });
    app.listen(port);
    console.log('Backend API runs on port ' + port);
});
//simulation of API response with unique user ID
function generateID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
