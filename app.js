var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.POST || 8000;

server.listen(port,function() {
	console.log("The chatting room is running at port: " + port);
});

app.use(express.static(__dirname + '/public'));

var usersNumber = 0;

io.on('connection',function(socket) {

	var addUser = false;
	
	socket.on('new message',function(data) {
		socket.broadcast.emit('new message',{
			userName: socket.userName,
			message: data
		});
	});

	socket.on('add user',function(userName) {
		if(addUser) return;
		socket.userName = userName;
		usersNumber++;
		addUser=true;
		socket.emit('login',{
			userName: socket.userName,
			usersNumber:usersNumber
		});
		socket.broadcast.emit('new user join',{
			userName:socket.userName,
			usersNumber:usersNumber
		});
	});

	socket.on('disconnect',function() {
		if(addUser) {
			usersNumber--;
			socket.broadcast.emit('user left',{
				userName:socket.userName,
				usersNumber:usersNumber
			});
		}
	});
});