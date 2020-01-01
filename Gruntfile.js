function ip() {
    if (process.env.IP) {
        return process.env.IP;
    } else {
        return '127.0.0.1';
    }
}

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //
        // stuff we'll need both for hugo and
        // for grunt-contrib-connect
        //
        hn : {
            hostname: ip(),
            port: 1313
        },

        //
        // Set up for the hugo action
        //
        hugo : {
            options : {
                hostname: '<%= hn.hostname %>',
                port: '<%= hn.port%>',
            }
        },


        //
        // Tell grunt-contrib-connect to serve on the loop back.
        //
        connect: {
            codevamping: {
                options: {
                    hostname: '<%= hn.hostname %>',
                    port: '<%= hn.port%>',
                    protocol: 'http',
                    base: 'build/dev',
                    livereload: true
                }
            }
        },

        //
        // Tell grunt-contrib-watch what to watch
        watch: {
            options: {
                atBegin: true,
                livereload: true
            },
            hugo: {
                files: ['site/**'],
                tasks: 'hugo:dev'
            }
        }
    });

    // custom hugo task
    // Run hugo to build into the sudirectory of build
    grunt.registerTask('hugo', function(target) {
        done = this.async();

        // by default, find hugo via the path
        let options = this.options({ executable : 'hugo' } );
        console.log(options);
        args = ['--source=site', `--destination=../build/${target}`];
        if (target == 'dev') {
            args.push(`--baseUrl=http://${options.hostname}:${options.port}`);
            args.push('--buildDrafts=true');
            args.push('--buildFuture=true');
        } else {
            args.push('--minify');
        }
        hugo = require('child_process').spawn(options.executable, args, { stdio: 'inherit'});

        hugo.on('close', () => { done(true); });
        hugo.on('error', (err) => { console.error(err); done(false); });
    });

    //
    // Load tasks from plugins
    //
    let plugins = [ 
        'grunt-contrib-watch',
        'grunt-contrib-connect'
    ];
    for (plugin in plugins) {
        grunt.loadNpmTasks(plugins[plugin]);
    }

    //
    // Define toplevel tasks
    //
    grunt.registerTask('edit',    ['connect', 'watch']);
    grunt.registerTask('dev',     ['hugo:dev']);
    grunt.registerTask('default', ['hugo:dist']);
};
