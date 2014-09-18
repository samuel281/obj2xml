(function(exports) {
    var util;
    if (typeof require == "undefined") {
        util = {
            format: function() {
                var tpl = arguments[0];
                var i = 1;

                while (/%s/.test(tpl)) {
                    tpl = tpl.replace("%s", arguments[i++]);
                }

                return tpl;
            }
        };
    } else {
        util = require('util');
    }

    function formatXml(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        xml.split('\r\n').forEach(function(node, index) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }

    function getAttrs(attrs) {
        var xml = '';
        for (var name in attrs) {
            if (xml.length > 0) xml += ' ';
            xml += util.format("%s=\"%s\"", name, attrs[name]);
        }
        return xml;
    }

    function getxml(obj) {
        var xml = '';
        for (var prop in obj) {
            var content = '';
            var attrs = '';
            var val = obj[prop];

            if (typeof obj == "string") {
            	return obj;
            }

            if (val != null && val != undefined && val.hasOwnProperty) {
                if (val.hasOwnProperty('$')) {
                	attrs = getAttrs(val['$']);
                }
                if (prop == '$') continue;

                if (val.hasOwnProperty('#')) content = val['#'];
                if (prop == '#') continue;
            }

            switch (typeof val) {
                case 'object':
                    if (val instanceof Array) {
                        for (var e in val) {
                        	var iattrs = getAttrs(val[e]['$']);
                        	var stag = (iattrs.length > 0) ? util.format("<%s %s>", prop, iattrs) : util.format("<%s>", prop);
                        	var etag = '</' + prop + '>';
                            content += (stag + getxml(val[e]) + etag);
                        }
                    } else {
                        content += getxml(val);
                    }
                    break;
                default:
                    content += val;
            }

            if (content.length == 0) return '<' + prop + '/>';

            if (typeof obj != 'object' || val instanceof Array) {
                xml += content;
            } else {
                var stag = (attrs.length > 0) ? util.format("<%s %s>", prop, attrs) : util.format("<%s>", prop);
                var etag = '</' + prop + '>';
                xml += stag + content + etag;
            }
        }
        return xml;
    }

    function obj2xml(obj, options) {
        var mv = '1.0';
        var me = 'utf-8';
        if (!options) {
        	options = {};
        }

        if (options.version) mv = options.version;
        if (options.encoding) me = options.encoding;

        var xml = "";
        if (!options.disableMeta) {
        	xml += util.format("<?xml version='%s' encoding='%s'?>", mv, me);
        }
        xml += getxml(obj);

        if (options.pretty) {
        	xml = formatXml(xml);
        }

        return xml;
    }

    exports.convert = obj2xml;


})(typeof exports === 'undefined' ? this['js2xml'] = {} : exports)