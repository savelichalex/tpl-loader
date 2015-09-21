var _ = require( 'underscore' );
var convert = require( 'html2hscript' );

_.templateSettings = {
    escape: /\{\{-([\s\S]+?)\}\}/g,
    evaluate: /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g
};

module.exports = function ( template ) {
    var callback = this.async();
    template = template.replace( /\r?\n+|\r|\t+/g, '' ).replace(/\s{2,}/g, ' ').replace(/(\{\{[\-=]?)([\s\S]+?)(\}\})/g, function( i, fBr, arg, sBr ) { return fBr + arg.replace( /\s+/g, '' ).replace(/elseif/g, 'else if') + sBr;  } );
    convert( template, function ( err, hs ) {
        if ( err ) {
            return callback( err );
        }
        var tplFn = _.template( hs.replace( /\r?\n+|\r|\t+|\s{2,}/g, '' ).replace(/\s{2,}/g, ' ').replace(/\"SVGAttributeHook\(([^\)]+)\)\"/g, function( i, f ) { return 'SVGAttributeHook(' + f + ')'; }) );
        callback( null, 'module.exports = ' + tplFn.source );
    } )
};