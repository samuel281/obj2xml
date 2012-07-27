var util = require('util');

function getAttrs(attrs){
	var xml = '';
	for(var name in attrs){
	     if(xml.length > 0) xml =+ ' ';
	     xml += util.format("%s=\"%s\"",name, attrs[name]);
	}
	return xml;
}

function getxml(obj){
	var xml = '';
	for(var prop in obj){
		var content = '';
		var attrs = ''

		if (obj[prop] != null && obj[prop] != undefined && obj[prop].hasOwnProperty) {
			if (obj[prop].hasOwnProperty('@')) attrs = getAttrs(obj[prop]['@']);
			if (prop == '@') continue;

			if (obj[prop].hasOwnProperty('#')) 	content = obj[prop]['#'];
			if (prop == '#') continue;
		}

		switch( typeof obj[prop] ){
			case 'object':
				content += getxml(obj[prop]);
				break;
			default:
				content += obj[prop];
		}

		if(content.length == 0) return '<'+ prop +'/>';
		if(obj instanceof Array) {
			xml += content;
		}
		else{
			var stag = (attrs.length > 0) ? util.format("<%s %s>", prop, attrs) : util.format("<%s>", prop);
			var etag = '</' + prop + '>';
			xml += stag + content + etag;
		}
	}
	return xml;
}

function obj2xml(obj, options){
	var mv = '1.0';
	var me = 'utf-8';

	if(options){
	     if(options.version) mv = options.version;
	     if(options.encoding) me = options.encoding;
	}

	var meta = util.format("<?xml version='%s' encoding='%s'?>", mv, me);
	return meta + getxml(obj);
}

module.exports.convert = obj2xml;

