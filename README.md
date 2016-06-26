##Automate Web Development With Gulp JS

Notes from Udemy course:

[Automate Web Development With Gulp JS](https://www.udemy.com/learn-gulp/learn/v4/overview)

###Installing Node

Globally:

```
$ sudo npm install gulp -g

```

Within project:

```
$ npm install gulp --save

```

* `--save` adds it to you package.json file, so when you upload it to Github you can not push the node_modules folder. To install dependencies, you can just run `npm install`

###Gulpfile

Create a file `gulpfile.js` in your root folder, there should also be a `public` folder within that.

####Basic Set-Up

You first need to require gulp, then to set up a simple task you can run `gulp.task` with the first argument being the task name and second being the callback function. Most projects will have styles, scripts, and image tasks

```
var gulp = require('gulp');

// Styles
gulp.task('styles', function() {
  console.log('starting styles task');
});

// Scripts
gulp.task('scripts', function() {
	console.log('starting scripts task');
});

// Images
gulp.task('images', function() {
	console.log('starting images task');
});

```
Once you save you can run the task in terminal

```
$ gulp styles

```
The output might be something like this:

```
[20:38:47] Using gulpfile ~/Desktop/3-1-gulp-website/gulpfile.js
[20:38:47] Starting 'styles'...
starting styles task
[20:38:47] Finished 'styles' after 170 μs

```

####Default

You can also add a `default` task that will run whenever you just run `$ gulp`

```
gulp.task('default', function() {
	console.log('Starting Default Task');
});

```


###Gulp-uglify

[Gulp-Uglify](https://www.npmjs.com/package/gulp-uglify)

This plugin saves js files as smaller files.

You can install the plugin as a dev dependency with the `--save-dev`, this will create a devDependencies section in the `package.json` file. You can go ahead and move gulp to the dev dependencies as well since it won't be needed for the production website.

```
$ npm install --save-dev gulp-uglify

```

Once you have it installed you need to add it to your project:

```
var uglify = require('gulp-uglify');

```
Once you have added it you can use it inside of your task. Below we:

* return a source, this is the folder of scripts you want to minify, you can you a wildcard * to target all js files
* `.pipe` makes a new chained next step, and it ugifies the files
* `gulp.dest` chooses a destination folder to save them in.

```
gulp.task('scripts', function() {
	console.log('starting scripts task');

	return gulp.src('public/scripts/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('public/dist'));
		
});


```

###Static-Server

[Static Server](https://www.npmjs.com/package/static-server)

```
$ npm install static-server@2.0.0 --save

```

Then you can make a `server.js` file in the root folder to make a simple server:

```
var StaticServer = require('static-server');

var server = new StaticServer({
	rootPath: './public/',
	port: 3000
});

server.start(function() {
	console.log( 'Server Started on port ' + server.port );
});

```

Now run:

```
$ node server.js

```

Now you can view the website on `localhost:3000`



###Watch

You can watch files in Gulp to see if they change.

First we are going to create a variable to hold our pathname since we are reusing it. This will target any js files within scripts or any sub folders of scripts.

```
var SCRIPTS_PATH = 'public/scripts/**/*.js';

```

Consider the watch task below, naming it watch is convention so stick to it. First we *require* the server file we write, this will automatically boot up our server when we start watching our project. Then we add a `gulp.watch` method. We first pass it the files we want it to watch, secondly we pass it an array gulp task to run.

Below we are booting up the server then watching all the files within the `public/scripts` folder (and sub folders). Whenever they are modified, the *scripts* gulp task will run auto updating the minified js files. 

```
gulp.task('watch', function() {
	console.log('Starting Watch Task');
	require('./server.js');
	gulp.watch(SCRIPTS_PATH, ['scripts']);
});

```

To start the watch (and the server):

```
$ gulp watch

```


###Live Reload

Live reload will auto refresh your webpage. When you add it to the watch task within Gulp it's really powerful

To install the node_module:


```
$ npm install gulp-livereload@3.8.1 --save-dev

```

Then in you gulpfile, you have to require the module:

```
var livereload = require('gulp-livereload');

```

Once you've required it, you need to add the `livereload.listen` method after the server starts but before the watch starts.

```
gulp.task('watch', function() {
	console.log('Starting Watch Task');
	require('./server.js');
	livereload.listen();
	gulp.watch(SCRIPTS_PATH, ['scripts']);
});

```

Next, you need to add it to the individual tasks. See below how it's added as a `pipe`, and we pass in the livereload function call.

```
gulp.task('scripts', function() {
	console.log('starting scripts task');

	return gulp.src(SCRIPTS_PATH)
		.pipe(uglify())
		.pipe(gulp.dest('public/dist'))
		.pipe(livereload());
		
});

```


Lastly you need to do one of two things. You need to download a livereload plugin on chorme that will be the client for the live reload, or you can add the following script tag to you *.html* file(s)

```
  <script src="http://localhost:35729/livereload.js"></script>

```


Now you can reboot the watch task in terminal. Now every time you save a script file the browser will automatically refresh.


###Gulp-Concat

This plugin will concatinate all of you css files into one.

Install your plugin:

```
$ npm install gulp-contat@2.6.0 --save-dev

```

Require it in you `gulpfile.js`:

```
var concat = require('gulp-concat');

```


Now you can create some css files within a new folder `css` within the `public` folder. Like the Scripts task, you can add similar logic for the CSS files.

* Create CSS variable for paths
* Return the content from those css files
* *concat* them into a file named `styles.css`
* put them into the `./public/dist` folder
* reload the page


```
var DIST_PATH = 'public/dist';
var CSS_PATH = 'public/css/**/*.css';

// Styles
gulp.task('styles', function() {
  console.log('starting styles task');

  return gulp.src(CSS_PATH)
  		.pipe(concat('styles.css'))
  		.pipe(gulp.dest(DIST_PATH))
  		.pipe(livereload());
});

```

Now you can run:

```
$ gulp styles

```

Now you will see that gulp made one css file for you, but what if you want to control the order of the css files within the one main one. You can pass an array of filenames to the `.src` method that will put them in the order you pass. Below it will load the `reset.css` file first, then will load everything else (excluding `reset.css`)

```

var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';

gulp.task('styles', function() {
  console.log('starting styles task');

  return gulp.src(['public/css/reset.css', CSS_PATH])
  		.pipe(concat('styles.css'))
  		.pipe(gulp.dest(DIST_PATH))
  		.pipe(livereload());
});

```

Now  you can just add the one css file to your `index.html`

```
  <link rel="stylesheet" href="./dist/styles.css">

```


###Gulp-Minify-Css


```
$ npm install gulp-minify-css@1.2.2 --save-dev

```