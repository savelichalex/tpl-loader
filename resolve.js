var _ = require( 'underscore' );
var convert = require( 'html2hscript' );
var fs = require( 'fs' );
var path = require( 'path' );

_.templateSettings = {
    escape: /\{\{-([\s\S]+?)\}\}/g,
    evaluate: /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g
};

if( typeof window === 'undefined' ) {
    require.extensions['.tpl'] = function(module, filename){
        var template = fs.readFileSync(filename, 'utf-8');
        template = template.replace(/\r?\n+|\r|\t+/g, '').replace(/\s{2,}/g, ' ').replace(/(\{\{[\-=]?)([\s\S]+?)(\}\})/g,
            function(i, fBr, arg, sBr){ return fBr + arg.replace(/\s+/g, '').replace(/elseif/g, 'else if') + sBr; });
        convert(template, function(err, hs){
            if (err) {
                return callback(err);
            }
            var tplFn = _.template(hs.replace(/\r?\n+|\r|\t+|\s{2,}/g, '').replace(/\s{2,}/g, ' ').replace(/\"SVGAttributeHook\(([^\)]+)\)\"/g,
                function(i, f){ return 'SVGAttributeHook(' + f + ')'; }));
            module._compile('module.exports = ' + tplFn.source, filename);
        })
    };
}