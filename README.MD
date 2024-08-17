# distignore

A gulp filter that removes files matching the contents of .distignore.  Use with gulp.src()  .distignore is a Wordpress ignore file that ensures releases do not contain unneccessary files.

If the .distignore file is not present then no files will be filtered.


## Installation

    npm i distignore --save-dev


## Usage

    const gulp = require( 'gulp' );

    const distIgnore = require( "gulp-distignore" );

    async function copyFiles() 
    {    
        gulp.src( "**" )
            .pipe( distIgnore( ) )
            .pipe( gulp.dest( "dist" ) );
    }

    gulp.task( 'copy', copyFiles );



## Options

Options can be passed to distignore by including an object as a parameter

    .
    .
    .pipe( distIgnore( { dir : 'src' } ) )
    .
    .

### _dir_ 
Specifies the directory to load the .distignore file from.  defaults to the working directory if this is not passed


#### I would consider this an early beta so use at your own risk
    