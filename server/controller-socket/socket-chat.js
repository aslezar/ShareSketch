const mongoose = require('mongoose');
const Room = require('../models/room');

const createMessage = async (data, cb, socket) => {
	try {
		const { message } = data;
		const { userId, userName, roomId } = socket;
		if (socket.isGuest) {
			cb({ msg: 'You must be login to chat, Server', success: false });
			return;
		}
		if (!mongoose.Types.ObjectId.isValid(roomId)) {
			cb({ msg: 'Invalid Room ID', success: false });
			return;
		}
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			cb({ msg: 'Invalid User ID', success: false });
			return;
		}
		if (!userName) {
			cb({ msg: 'Invalid User Name', success: false });
			return;
		}
		if (message === '') {
			cb({ msg: 'Empty Message', success: false });
			return;
		}
		const room = await Room.findById(data.roomId);
		if (!room) {
			cb({
				message: `Room not found with room ID ${roomid}`,
				success: false,
			});
			return;
		}
		room.chat.push({ userId, userName, message });
		room.save();

		socket.broadcast
			.to(data.roomId)
			.emit('chat:message', { userId, userName, message });
		cb({ msg: 'Server: Message created', success: true });
		console.log(
			`User ${userName} sent message on room ${data.roomId} with message ${data.message}`
		);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error creating message', success: false });
	}
};
module.exports = {
	createMessage,
};
