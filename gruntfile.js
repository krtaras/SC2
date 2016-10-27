module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * SoundCloudPlayer v<%= pkg.version %>\n' +
            ' * Copyright 2015-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
            
     //Clean release folder
     clean: {
       contents: 'release/'
     },
     
     copy: {
        view: {
          expand: true,
          cwd: 'src/extension/app/view/',
          src: '**',
          dest: 'release/extension/app/view/',
        },
        lib: {
          expand: true,
          cwd: 'src/extension/lib/',
          src: '**',
          dest: 'release/extension/lib/',
        },
        font: {
          expand: true,
          cwd: 'src/extension/style/font/',
          src: '**',
          dest: 'release/extension/app/style/font/',
        },
        icons: {
          expand: true,
          cwd: 'src/icons/',
          src: '**',
          dest: 'release/extension/icons/',
        },
        files: {
          files: [
            {cwd: 'src/extension/app/', src: 'app.js', dest: 'release/extension/app/', expand: true},
            {cwd: 'src/', src: 'popup.html', dest: 'release/', expand: true},
            {cwd: 'src/', src: 'background.html', dest: 'release/', expand: true},
            {cwd: 'src/', src: 'manifest.json', dest: 'release/', expand: true},
            {cwd: 'src/', src: 'redirect.html', dest: 'release/', expand: true},
            {cwd: 'src/', src: 'window_mode.html', dest: 'release/', expand: true}
          ]
        }
     },
     
     less: {
        development: {
            options: {
                paths: ["assets/css"]
            },
            files: {"src/extension/style/theme.css": "src/extension/style/theme.less"}
        },
       /* production: {
            options: {
                paths: ["assets/css"],
                cleancss: true
            },
            files: {"src/extension/style/theme.css": "src/extension/style/theme.less"}
        }*/
     },
     
     concat: {
        options: {
            banner: '<%= banner %>',
            stripBanners: false
        },
        background: {
          src: [
            'src/extension/app/background/background.js',
            'src/extension/app/background/apiHelper.js',
            'src/extension/app/background/player.js',
            'src/extension/app/background/playerHelper.js',
            'src/extension/app/background/scHelper.js',
            'src/extension/app/background/init.js',
          ],
          dest: 'release/extension/app/js/background.js'
        },
        controllers: {
          src: [
            'src/extension/app/controller/homeTabController.js',
            'src/extension/app/controller/itemsController.js',
            'src/extension/app/controller/loginController.js',
            'src/extension/app/controller/playerController.js',
            'src/extension/app/controller/playListTabController.js',
            'src/extension/app/controller/settingsTabController.js',
            'src/extension/app/controller/stateController.js',
            'src/extension/app/controller/tracksTabController.js',
          ],
          dest: 'release/extension/app/js/controllers.js'
        },
        styles : {
           src: [
             'src/extension/style/materialize-icons.css',
             'src/extension/style/theme.css',
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
        },
        attrchange: {
            files: {
              'release/extension/lib/attrchange.js': 'release/extension/lib/attrchange.js'
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
  
  grunt.registerTask('build', ['clean','copy', 'less', 'concat']);
  grunt.registerTask('release', ['build', 'uglify', 'cssmin']);
};