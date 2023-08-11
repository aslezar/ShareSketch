const {
	createRoom,
	joinRoom,
	leaveRoom,
} = require('../controllers/socket-room');
const { createElement } = require('../controllers/socket-canvas');
const { createMessage } = require('../controllers/socket-chat');

module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log('A user connected');

		//middleware to be added to authenticate user

		socket.on('createRoom', (data, cb) => createRoom(data, cb, socket));
		socket.on('joinRoom', (data, cb) => joinRoom(data, cb, socket));
		socket.on('leaveRoom', (data, cb) => leaveRoom(data, cb, socket));
		socket.on('canvas:draw', (data, cb) => createElement(data, cb, socket));
		socket.on('chat:message', (data, cb) => createMessage(data, cb, socket));

		socket.on('disconnect', () => {
			console.log('A user disconnected');
		});
	});
};
