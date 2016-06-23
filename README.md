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

