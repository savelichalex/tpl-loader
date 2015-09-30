var through = require('through');
var _ = require( 'underscore' );
var convert = require( 'html2hscript' );

_.templateSettings = {
    escape: /\{\{-([\s\S]+?)\}\}/g,
    evaluate: /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g
};

function Templatify( file ) {

    var data = '';

    if( /\.tpl$/.test( file ) === false ) {
        return through();
    } else {
        return through( write, end );
    }

    function write ( buf ) {
        data += buf;
    }

    function end () {
        compile( file, data, function (error, result) {
            if( error ) stream.emit( 'error', error );
            else stream.queue( result );
            stream.queue( null );
        } );
    }

}

function compile ( file, template, callback ) {
    var template = template.replace( /\r?\n+|\r|\t+/g, '' ).replace(/\s{2,}/g, ' ').replace(/(\{\{[\-=]?)([\s\S]+?)(\}\})/g, function( i, fBr, arg, sBr ) { return fBr + arg.replace( /\s+/g, '' ).replace(/elseif/g, 'else if') + sBr;  } );
    convert( template, function ( err, hs ) {
        if ( err ) {
            return callback( err );
        }
        var tplFn = _.template( hs.replace( /\r?\n+|\r|\t+|\s{2,}/g, '' ).replace(/\s{2,}/g, ' ').replace(/\"SVGAttributeHook\(([^\)]+)\)\"/g, function( i, f ) { return 'SVGAttributeHook(' + f + ')'; }) );
        callback( null, 'module.exports = ' + tplFn.source );
    } );
}

Templatify.compile = compile;

module.exports = Templatify;