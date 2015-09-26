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
app.get('*', function(req,res) {
	res.sendfile('./public/index.html');
});

// socket io stuff ==================================================
io.on('connection', function (socket) {
	console.log('new connection');

	socket.on('add-user', function(room) {
		socket.join(room);
	});

	socket.on('disconnect', function(room) {
		socket.leave(room);
	});

	socket.on('chat message', function(msgObj, room){
		socket.broadcast.to(room).emit('chat message', msgObj); // send to all except sender
	});

	socket.on('user-typing-start', function(username, userID, room) {
		socket.broadcast.to(room).emit('user-typing-start', username, userID);
	});

	socket.on('user-typing-end', function(username, userID, room) {
		socket.broadcast.to(room).emit('user-typing-end', username, userID);
	})

	socket.on('remove user', function(room) {
		console.log('got remove user');
		socket.leave(room);
		socket.disconnect();
	});
});


// start app ===============================================
server.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
