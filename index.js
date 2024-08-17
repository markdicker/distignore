"use strict";

const es = require('event-stream');
const { minimatch } = require('minimatch');
const fs = require( "fs" );
const path = require( 'path' );

module.exports = function( opt = {} )
{

  if ( opt !== undefined && opt.dir !== undefined )
    var cwd = path.resolve( opt.dir );
  else
    var cwd = process.cwd();

  console.log( cwd );

  var Ignores = [];

  try {
    var content = fs.readFileSync( path.join( cwd, '.distignore' ), { encoding: 'utf8', flag: 'r' });
    
    // console.log( content );

    var Ignores = content.split("\n");
  }
  catch( e )
  {
    var Ignores = [];
  }    

  // console.log( Ignores );

  return es.map(function (file, cb)
  {
    var i, skip = false;

    for ( i = 0; i < Ignores.length; i++ ) 
    {
      // If line is blank or a comment then ignore it.
      if ( '' == Ignores[i] || Ignores[i][0] == '#' )
        continue;
      
      // console.log( path.join( path.dirname( file.path ),Ignores[i] ) );
      // console.log( path.join( cwd, Ignores[i] ), file.path, minimatch( path.join( path.dirname( file.path ),Ignores[i] ), file.path , { partial: true, matchBase: true } ) );
      
      // console.log( path.resolve( path.join( ( cwd, Ignores[i] ) )));

      // console.log( file.path, path.join( cwd,Ignores[i] ),minimatch( file.path, path.join( cwd,Ignores[i] ), { partial: true, matchBase: true } ) );

      var match = path.join( cwd, Ignores[i] );

      try {
        // minimatch failes to match patterns that end in a folder and a file within that folder
        // So we add a "*" if the pattern is a folder 
        //
        // e.g path/folder/file should match path/folder

        var stat = fs.statSync( match );
    
        if ( stat.isDirectory() )
            match = path.join( match, "**" );

      }
      catch( err ) {
          // Any failure is ignored
      }


      if ( minimatch( file.path, match, { partial: true, matchBase: true } ) ) 
      {
        skip = true;
        break;
      }
    }

    if (skip) 
    {
      // console.log( "Skip ", file.path );
      return cb(); // Ignore this one
    } 
    else 
    {
      // console.log( "Copy ", file.path );
      return cb(null, file);
    }
    
  });

}

