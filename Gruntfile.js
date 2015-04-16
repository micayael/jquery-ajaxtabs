module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {

            default: ['<%= pkg.name %>-<%= pkg.version %>.min.js']
        },
        jsbeautifier: {
            files: ['Gruntfile.js', '<%= pkg.name %>.js']
        },
        jshint: {
            options: {
                globals: {
                    jQuery: true
                }
            },
            files: ['Gruntfile.js', '<%= pkg.name %>.js']
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                },
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
                    'homepage: <%= pkg.homepage %> - ' +
                    '<%= pkg.description %> */\n',
                mangle: true,
                report: 'gzip'
            },
            dist: {
                src: '<%= pkg.name %>.js',
                dest: '<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'clean',
        'jsbeautifier',
        'jshint',
        'uglify'
    ]);

};
