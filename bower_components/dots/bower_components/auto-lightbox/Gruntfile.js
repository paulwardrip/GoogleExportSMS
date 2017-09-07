module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        uglify: {
            lightbox: {
                files: {
                    'auto-lightbox.min.js': ['auto-lightbox.js']
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