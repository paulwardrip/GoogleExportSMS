module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        concat: {
            dots: {
                files: {
                    'dist/dots.js': [
                        "bower_components/auto-lightbox/auto-lightbox.js",
                        "bower_components/centerize/centerize.js",
                        "src/dots.js"
                    ]
                }
            }
        },

        uglify: {
            dots: {
                files: {
                    'dist/dots.min.js': ['dist/dots.js']
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