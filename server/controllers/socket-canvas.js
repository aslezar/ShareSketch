const mongoose = require('mongoose');
const Room = require('../models/room');

const createElement = async (data, cb, socket) => {
	try {
		const { roomId, userId, element } = data;
		if (!mongoose.Types.ObjectId.isValid(roomId)) {
			cb({ msg: 'Server:Invalid Room ID', success: false });
			return;
		}
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			cb({ msg: 'Server:Invalid User ID', success: false });
			return;
		}
		if (!element) {
			cb({ msg: 'Server:Invalid Element', success: false });
			return;
		}
		const room = await Room.findById(roomId);
		if (!room) {
			cb({
				message: `Room not found with room ID ${roomid}`,
				success: false,
			});
			return;
		}
		room.elements.push(data.element);
		room.save();
		socket.broadcast.to(data.roomId).emit('canvas:draw', data.element);
		cb({ msg: 'Server: Element created', success: true });
		console.log(`User ${socket.id} drew on room ${data.roomId}`);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error creating element', success: false });
	}
};
module.exports = {
	createElement,
};
