module.exports = (io) => {
	// console.log(io);
	io.on('connection', (socket) => {
		console.log(`A user connected ${socket.id}`);

		socket.on('chat message', (msg) => {
			// Broadcast the message to all connected clients
			io.emit('chat message', msg);
		});

		socket.on('disconnect', () => {
			console.log('A user disconnected');
		});
	});
};
