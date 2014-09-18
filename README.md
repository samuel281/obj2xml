obj2xml
=======

javascript object to xml converter
which is compatible with xml2js (https://github.com/Leonidas-from-XIV/node-xml2js)

# installation:

	$ npm install obj2xml

# usage:

	var js2xml = require('obj2xml');

	//object
	var xml = js2xml.convert(object);

	//json string
	var xml = js2xml.convert(JSON.parse(json));

# obj2xml in browser!

    $ bower install obj2xml --save

Load the script file in your application

    <script type="text/javascript" src="bower_components/obj2xml/lib/obj2xml.js"></script>

the script would expose a `js2xml` object

    //object
    var xml = js2xml.convert(object);

    //json string
    var xml = js2xml.convert(JSON.parse(json));