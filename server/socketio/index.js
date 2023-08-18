const {
	joinRoom,
	leaveRoom,
	disconnect,
} = require('../controller-socket/socket-room');
const {
	createElement,
	clearCanvas,
	undoElement,
	redoElement,
} = require('../controller-socket/socket-canvas');
const { createMessage } = require('../controller-socket/socket-chat');

module.exports = (io) => {
	function getActiveUsers(roomId) {
		const room = io.sockets.adapter.rooms.get(roomId);
		if (room) {
			const users = [];
			for (const socketId of room) {
				const socket = io.sockets.sockets.get(socketId);
				users.push(socket.userData);
			}
			return users;
		} else {
			return [];
		}
	}

	io.on('connection', (socket) => {
		console.log('A user connected');

		socket.on('room:join', (data, cb) => joinRoom(data, cb, socket));
		socket.on('room:leave', (data, cb) => leaveRoom(data, cb, socket));

		socket.on('canvas:draw', (data, cb) => createElement(data, cb, socket));
		socket.on('canvas:clear', (data, cb) => clearCanvas(data, cb, socket));
		socket.on('canvas:undo', (data, cb) => undoElement(data, cb, socket));
		socket.on('canvas:redo', (data, cb) => redoElement(data, cb, socket));

		socket.on('chat:message', (data, cb) => createMessage(data, cb, socket));

		socket.on('disconnect', () => disconnect(socket));

		// socket.on('disconnect', () => {
		// 	console.log('A user disconnected');
		// });
		socket.getActiveUsers = getActiveUsers;
	});
};
