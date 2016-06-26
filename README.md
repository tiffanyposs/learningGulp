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

This plugin will minify your css:

```
$ npm install gulp-minify-css@1.2.2 --save-dev

```

You can implement it simply by calling `minifyCss()` in a pipe

```
var minifyCss = require('gulp-minify-css');

// Styles
gulp.task('styles', function() {
  console.log('starting styles task');

  return gulp.src(['public/css/reset.css', CSS_PATH])
  		.pipe(concat('styles.css'))
  		.pipe(minifyCss())
  		.pipe(gulp.dest(DIST_PATH))
  		.pipe(livereload());
});

```

###Adding Styles Watch

Now to your watch task, you can add the css files to the mix by simply adding another folder to watch, and a task to run.

```
gulp.watch(CSS_PATH, ['styles']);

```

###Autoprefixer

This will add all the browswer prefixes automatically to your css code.

```
$ npm install gulp-autoprefixer@3.1.0 --save-dev

```

Require it in your gulpfile

```
var autoprefixer = require('gulp-autoprefixer');

```

Now you can simply call the autoprefixer within your styles task before you concatinate it.

```
...

  return gulp.src(['public/css/reset.css', CSS_PATH])
  		.pipe(autoprefixer())
  		.pipe(concat('styles.css'))
  		.pipe(minifyCss())
  		.pipe(gulp.dest(DIST_PATH))
  		.pipe(livereload());
...

```

You can also add custom browswers if you're only supporting certain ones

```
.pipe(autoprefixer({
    browsers: ['last 2 versions', 'ie 8']
 }))

```

###Errors & gulp-plumber

If you have an error, for example, in your css, it may crash your *gulp watch*. You need a way to handle errors so it doesn't crash your system

First install the plugin

```
$ npm install gulp-plumber@1.0.1 --save-dev

```
You can require the plugin:

```
var plumber = require('gulp-plumber');

```
You can add this to the *styles* task at the top of the pipe chain

* run plumber function and pass it an anonymous function with a param thats the error
* log the error
* `this.emit('end')` means stop running the tasks so it doesn't crash

```
...
.pipe(plumber( function(err) { 
  	console.log('Styles Task Error:');
  	console.log(err);
  	this.emit('end');
}))
...

```

###Gulp-Sourcemaps

Sourcemap allows you to provide a [sourcemap](http://blog.teamtreehouse.com/introduction-source-maps) for your compressed css and js files. This comes in useful when you are trying to debug in the console. Instead of the source being your compressed file line 1, this will give you the original source.

```
$ npm install gulp-sourcemaps@1.6.0 --save-dev

```

Require the plugin

```
var sourcemaps = require('gulp-sourcemaps');

```

* Now our style task should look something like this. You call `sourcemaps.init()` to get a read of what the files looked like before changes
* Then later after you make your changes you write `sourcemaps.write()` to write the sourcemap to the file.

```
gulp.task('styles', function() {
  console.log('starting styles task');

  return gulp.src(['public/css/reset.css', CSS_PATH])
  		.pipe(plumber( function(err) { 
  			console.log('Styles Task Error:');
  			console.log(err);
  			this.emit('end');
  		}))
  		.pipe(sourcemaps.init())
  		.pipe(autoprefixer())
  		.pipe(concat('styles.css'))
  		.pipe(minifyCss())
  		.pipe(sourcemaps.write())
  		.pipe(gulp.dest(DIST_PATH))
  		.pipe(livereload());
});

```

Now you can debug thing easier in the console.


###Gulp-Sass

This plugin will allow you to compile and compress SCSS and SASS files using Gulp

```
$ npm install gulp-sass@2.1.1 --save-dev

```
Require the plugin:

```
var sass = require('gulp-sass');

```


Create a new folder in the route of the `public` folder `scss`. Within that create a file named `sassStyles.scss`, then within that create another folder named `reset` with a file named `_basic-reset.scss`


`sass.Styles.scss`

```
@import "./reset/basic-reset";

$grey: #f7f7f7;

body {
	background-color: $grey;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 100vh;
}

img {
	margin-bottom: 3rem;

}

h1, p {
	font-family: Helvectica, Arial, sans-serif;
	font-weight: 300;
	margin-bottom: 1.5rem;
}

```

`_basic-reset.scss`

```
* {
	margin: 0;
	padding: 0;
}

```


Now in our `gulpfile.js` we can add a `sassStyles` task which is similar to our styles.

* We change the `.src` to be the root sass file (we don't need to add the other scss files because they are already imported through the root scss file)
* We removed `concat` and `minify` because the sass plugin already takes care of it
* We add a pipe after autoprefixer that calls `sass`
* We pass in compressed because we want it compressed

```

// Styles With Sass
gulp.task('sassStyles', function() {
  console.log('starting styles task');

  return gulp.src('public/scss/sassStyles.scss')
      .pipe(plumber( function(err) { 
        console.log('Styles Task Error:');
        console.log(err);
        this.emit('end');
      }))
      .pipe(sourcemaps.init())
      .pipe(autoprefixer())
      .pipe(sass({
        outputStyle: 'compressed'
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST_PATH))
      .pipe(livereload());
});


```

To the watch task we now add

```
gulp.watch('public/scss/**/*.scss', ['sassStyles'])

```

Now sass and scss will compile an compress.