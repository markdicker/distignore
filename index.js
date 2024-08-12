"use strict";

const es = require('event-stream');
const { minimatch } = require('minimatch');
const fs = require( "fs" );
const path = require( 'path' );


module.exports = function(opt)
{

  var cwd = process.cwd();

  // console.log( cwd );

  var Ignores = [];

  try {
    var content = fs.readFileSync( path.join( cwd, '.distignore' ), { encoding: 'utf8', flag: 'r' });
    
    // console.log( content );

    var Ignores = content.split("\n");
  }
  catch( e )
  {
  }    

  // console.log( Ignores );

  return es.map(function (file, cb)
  {
    var i, skip = false;

    for ( i = 0; i < Ignores.length; i++ ) 
    {

      if ( '' == Ignores[i] )
        continue;
      
      // console.log( path.join( path.dirname( file.path ),Ignores[i] ) );
      // console.log( path.join( cwd, Ignores[i] ), file.path, minimatch( path.join( path.dirname( file.path ),Ignores[i] ), file.path , { partial: true, matchBase: true } ) );
      
      if ( minimatch( path.join( cwd,Ignores[i] ), file.path , { partial: true, matchBase: true } ) ) 
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

