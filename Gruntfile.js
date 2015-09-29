module.exports = function(grunt){

    grunt.initConfig({
        jshint: {
            dist: {
                options: {
                    // enable additional checks:
                    curly: true,
                    newcap: true,

                    // disable default checks:
                    boss: true, // allows us to do for loops like: for (var i=0, item; item=items[i]; i++) {
                    expr: true, // allows us to do fn calls in one-line expressions like: x === 1 && show(x);
                },
                src: [
                    'template_helpers.js'
                ]
            }
        },

        jasmine: {
            src: [
                'template_helpers.js',
            ],
            options: {
                vendor: [
                    'bower_components/handlebars/handlebars.min.js',
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/duckduckgo-utils/util.js',
                    'build/templates-answerbar.js'
                ],
                specs: [
                    'test/*.js'
                ]
            }
        },

        handlebars: {
            compile: {
                src: './bower_components/duckduckgo-answerbar-templates/**/*.handlebars',
                dest: "./build/templates-answerbar.js",
                options: {
                    namespace: "DDG.templates",
                    processName: function(filepath) {
                        var parts = filepath.split('/');
                        return parts[parts.length - 1].replace('.handlebars','');
                    },
                    processContent: function(content, filepath) {
                        content = content.replace(/\n\s+|\n/g,'');

                        return content;
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    grunt.registerTask("test", "Lint and test", ["jshint", "handlebars", "jasmine"]);

};
