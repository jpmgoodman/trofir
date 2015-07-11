var express = require('express');
var app = express();
var optPort = process.argv[2];
var listenPort;

app.use(express.static(__dirname + '/public'));

if (optPort)
	listenPort = optPort;
else
	listenPort = 80;

app.listen(listenPort);
console.log('Server running on port ' + listenPort);
