var gulp = require('gulp');
var gulp = require('gulp');
gulp.task('build', function() {
	gulp.task('js', function () {
		return gulp.src('js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('build'));
	});
});