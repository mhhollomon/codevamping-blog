function ip() {
    console.log(`ip = ${process.env.IP}`);
    if (process.env.IP) {
        return process.env.IP;
    } else {
        return '127.0.0.1';
    }
}

function find_hugo() {
    if (process.env.GITHUB_ACTIONS == 'true') {
        return '/home/runner/hugobin/hugo';
    } else {
        return 'hugo';
    }

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
                executable : find_hugo()
            }
        },


        //
        // Tell grunt-contrib-connect to serve on the loop back.
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

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('edit', ['connect', 'watch']);
    grunt.registerTask('dev', [ 'hugo:dev' ]);
    grunt.registerTask('default', ['hugo:dist']);
};
