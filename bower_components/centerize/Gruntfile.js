module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        uglify: {
            lightbox: {
                files: {
                    'centerize.min.js': ['centerize.js']
                }
            }
        },

        watch: {
            scripts: {
                files: '**/*.js',
                tasks: ['uglify']
            }
        }
    });
};