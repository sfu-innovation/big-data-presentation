var
	express = require('express'),
	app = express.createServer(),
	io = require('socket.io').listen(app);

//Deck broadcast
io.sockets.on('connection', function (socket) {
	socket.on('deck.change', function(data) {
		io.sockets.emit('deck.change', data)
	})
});

//Start up Express
app.use(express.static(__dirname+"/public"));

//Listen on arbitrary port and address
app.listen(7565, 0, function() {
	var address = this.address();
	console.log(address.address+":"+address.port);
});
