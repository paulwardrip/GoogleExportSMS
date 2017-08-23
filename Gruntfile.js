module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8765,
                    base: '.',
                    keepalive: true
                }
            }
        }
    });
};