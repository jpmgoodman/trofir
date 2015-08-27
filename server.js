// modules =================================================
var http		   = require('http');
var express        = require('express');
var app            = express();
var server		   = http.createServer(app);
var io			   = require('socket.io')(server);
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================

// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// models ==================================================

// routes ==================================================

app.use('/api', require('./app/routes/routes'));
app.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});
app.get('/experiments', function(req, res) {
	res.sendfile('./public/course-experimental.html');
});
app.get('*', function(req,res) {
	res.sendfile('./public/404.html');
});

// socket io stuff ==================================================
io.on('connection', function (socket) {
	// user joined chatroom
	socket.on('add-user', function(socket) {
		console.log('a user connected to the chatroom')
	});
	// user left chatroom
	socket.on('disconnect', function(socket) {
		console.log('a user left the chatroom');
	});

	// got a chat message
	socket.on('chat message', function(msgObj){
		console.log('got message ' + msgObj.content);
		console.log('at time ' + msgObj.time);
		io.emit('chat message', msgObj);
	});
});


// start app ===============================================
server.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
