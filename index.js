var _ = require( 'underscore' );
var convert = require( 'html2hscript' );

_.templateSettings = {
    escape: /\{\{-([\s\S]+?)\}\}/g,
    evaluate: /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g
};

module.exports = function ( template ) {
    template = template.replace(/(\{\{[\-=]?)([\s\S]+?)(\}\})/g, function( i, fBr, arg, sBr ) { return fBr + arg.replace( /\s+/g, '' ).replace(/elseif/g, 'else if') + sBr;  } );
    var hs = convert( template );
    var tplFn = _.template( hs.replace( /\r?\n|\r|\t+|\s{2,}/g, '' ).replace(/\"SVGAttributeHook\(([^\)]+)\)\"/g, function( i, f ) { return 'SVGAttributeHook(' + f + ')'; }) );
    return 'module.exports = ' + tplFn.source;
};