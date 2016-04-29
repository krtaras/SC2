module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * SoundCloudPlayer v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2015-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',
            
     //Clean release folder
     clean: {
       contents: 'release/'
     },
     
     copy: {
        view: {
          expand: true,
          cwd: 'trunk/extension/app/view/',
          src: '**',
          dest: 'release/extension/app/view/',
        },
        lib: {
          expand: true,
          cwd: 'trunk/extension/lib/',
          src: '**',
          dest: 'release/extension/lib/',
        },
        font: {
          expand: true,
          cwd: 'trunk/extension/style/font/',
          src: '**',
          dest: 'release/extension/app/style/font/',
        },
        icons: {
          expand: true,
          cwd: 'trunk/icons/',
          src: '**',
          dest: 'release/extension/icons/',
        },
        files: {
          files: [
            {cwd: 'trunk/extension/app/', src: 'app.js', dest: 'release/extension/app/', expand: true},
            {cwd: 'trunk/', src: 'popup.html', dest: 'release/', expand: true},
            {cwd: 'trunk/', src: 'background.html', dest: 'release/', expand: true},
            {cwd: 'trunk/', src: 'manifest.json', dest: 'release/', expand: true}
          ]
        }
     },
     
     less: {
        development: {
            options: {
                paths: ["assets/css"]
            },
            files: {"trunk/extension/style/theme.css": "trunk/extension/style/theme.less"}
        },
        production: {
            options: {
                paths: ["assets/css"],
                cleancss: true
            },
            files: {"trunk/extension/style/theme.css": "trunk/extension/style/theme.less"}
        }
     },
     
     concat: {
        options: {
            banner: '<%= banner %>',
            stripBanners: false
        },
        background: {
          src: [
            'trunk/extension/app/background/apiHelper.js',
            'trunk/extension/app/background/player.js',
            'trunk/extension/app/background/playerHelper.js',
            'trunk/extension/app/background/scHelper.js',
            'trunk/extension/app/background/init.js',
          ],
          dest: 'release/extension/app/js/background.js'
        },
        controllers: {
          src: [
            'trunk/extension/app/controller/homeTabController.js',
            'trunk/extension/app/controller/itemsController.js',
            'trunk/extension/app/controller/loginController.js',
            'trunk/extension/app/controller/playerController.js',
            'trunk/extension/app/controller/playListTabController.js',
            'trunk/extension/app/controller/settingsTabController.js',
            'trunk/extension/app/controller/stateController.js',
            'trunk/extension/app/controller/tracksTabController.js',
          ],
          dest: 'release/extension/app/js/controllers.js'
        },
        styles : {
           src: [
             'trunk/extension/style/materialize-icons.css',
             'trunk/extension/style/theme.css',
           ],
           dest: 'release/extension/app/style/style.css'
        }
     },
     
     uglify: {
        app: {
            files: {
              'release/extension/app/app.js': 'release/extension/app/app.js'
            }
        },
        background: {
            files: {
              'release/extension/app/js/background.js': 'release/extension/app/js/background.js'
            }
        },
        controllers: {
            files: {
              'release/extension/app/js/controllers.js': 'release/extension/app/js/controllers.js'
            }
        },
        soundcloud: {
            files: {
              'release/extension/lib/soundmanager2.js': 'release/extension/lib/soundmanager2.js'
            }
        }
     },
     
     cssmin: {
        options: {
            shorthandCompacting: false,
            roundingPrecision: -1
        },
        target: {
            files: {
              'release/extension/app/style/style.css': 'release/extension/app/style/style.css'
            }
        }
    }
     
  });
  
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);
  
  grunt.registerTask('build', ['clean','copy', 'concat', 'less']);
  grunt.registerTask('release', ['build', 'uglify', 'cssmin']);
};