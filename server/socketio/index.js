module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log('A user connected');

		// Handle joining a room
		socket.on('joinRoom', (roomId, callback) => {
			console.log(`${socket.id} joined room: ${roomId}`);
			socket.join(roomId);
			const response = { message: 'Successfully joined room', success: true };
			callback(response);
		});

		// Handle leaving a room
		socket.on('leaveRoom', (roomId) => {
			console.log(`${socket.id} left room: ${roomId}`);
			socket.leave(roomId);
			console.log(`User left room: ${roomId}`);
		});

		socket.on('canvas:draw', (data) => {
			console.log(`User ${socket.id} drew on room ${data.roomId}`);
			console.log(data);
			socket.broadcast.to(data.roomId).emit('canvas:draw', data.curElement);
		});
		socket.on('chat:message', (data) => {
			console.log(
				`User ${socket.id} sent message on room ${data.roomId} with message ${data.message}`
			);
			socket.broadcast
				.to(data.roomId)
				.emit('chat:message', { user: data.user, message: data.message });
		});

		// Handle disconnect
		socket.on('disconnect', () => {
			console.log('A user disconnected');
		});
	});
};
