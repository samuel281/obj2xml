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

    function getAttrs(attrs) {
        var xml = '';
        for (var name in attrs) {
            if (xml.length > 0) xml = +' ';
            xml += util.format("%s=\"%s\"", name, attrs[name]);
        }
        return xml;
    }

    function getxml(obj) {
        var xml = '';
        for (var prop in obj) {
            var content = '';
            var attrs = ''

            if (obj[prop] != null && obj[prop] != undefined && obj[prop].hasOwnProperty) {
                if (obj[prop].hasOwnProperty('@')) attrs = getAttrs(obj[prop]['@']);
                if (prop == '@') continue;

                if (obj[prop].hasOwnProperty('#')) content = obj[prop]['#'];
                if (prop == '#') continue;
            }

            switch (typeof obj[prop]) {
                case 'object':
                    if (obj[prop] instanceof Array) {
                        for (var e in obj[prop]) {
                            content += '<' + prop + '>' + getxml(obj[prop][e]) + '</' + prop + '>';
                        }
                    } else {
                        content += getxml(obj[prop]);
                    }
                    break;
                default:
                    content += obj[prop];
            }

            if (content.length == 0) return '<' + prop + '/>';

            if (typeof obj != 'object' || obj[prop] instanceof Array) {
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

        if (options) {
            if (options.version) mv = options.version;
            if (options.encoding) me = options.encoding;
        }

        var xml = "";
        if (!options.disableMeta) xml += util.format("<?xml version='%s' encoding='%s'?>", mv, me);
        xml += getxml(obj);

        return xml;
    }

    module.exports.convert = obj2xml;


})(typeof exports === 'undefined' ? this['js2xml'] = {} : exports)