// Desc: Socket controller for chat
const createMessage = async (data, cb, socket) => {
	try {
		const { message } = data;
		const { userId, name: userName, isGuest } = socket.userData;
		const { room, updateRoom } = socket.room;
		if (isGuest) {
			cb({ msg: 'You must be login to chat, Server', success: false });
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

		room.chat.push({ userId, userName, message });
		updateRoom();

		socket.broadcast
			.to(room._id)
			.emit('chat:message', { userId, userName, message });

		cb({ msg: 'Server: Message created', success: true });

		console.log(
			`User ${userName} sent message on room ${room._id} with message ${message}`
		);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error creating message', success: false });
	}
};
module.exports = {
	createMessage,
};
