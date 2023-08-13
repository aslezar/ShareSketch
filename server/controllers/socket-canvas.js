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
		await room.save();
		socket.broadcast.to(data.roomId).emit('canvas:draw', data.element);
		cb({ msg: 'Server: Element created', success: true });
		console.log(`User ${socket.id} drew on room ${data.roomId}`);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error creating element', success: false });
	}
};

const clearCanvas = async (data, cb, socket) => {
	try {
		const { roomId, userId } = data;
		if (!mongoose.Types.ObjectId.isValid(roomId)) {
			cb({ msg: 'Server:Invalid Room ID', success: false });
			return;
		}
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			cb({ msg: 'Server:Invalid User ID', success: false });
			return;
		}
		const room = await Room.findById(roomId);
		// const room = Room.findOneAndUpdate(
		// 	{ _id: roomId },
		// 	{ elements: [] },
		// 	{
		// 		new: true,
		// 		upsert: false,
		// 	}
		// );
		if (!room) {
			cb({
				message: `Room not found with room ID ${roomid}`,
				success: false,
			});
			return;
		}
		room.elements = [];
		await room.save();
		socket.broadcast.to(data.roomId).emit('canvas:clear');
		cb({ msg: 'Server: Canvas Cleared', success: true });
		console.log(`User ${socket.id} cleared canvas on room ${data.roomId}`);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error clearing canvas', success: false });
	}
};

const undoElement = async (data, cb, socket) => {
	try {
		const { roomId, userId, elementId } = data;
		if (!mongoose.Types.ObjectId.isValid(roomId)) {
			cb({ msg: 'Server:Invalid Room ID', success: false });
			return;
		}
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			cb({ msg: 'Server:Invalid User ID', success: false });
			return;
		}
		if (!elementId) {
			cb({ msg: 'Server:Invalid Element ID', success: false });
			return;
		}
		const room = await Room.findById(roomId);
		// const room = Room.findOneAndUpdate(filter, update, {
		// 	new: true,
		// 	upsert: false,
		// });
		if (!room) {
			cb({
				message: `Room not found with room ID ${roomid}`,
				success: false,
			});
			return;
		}
		room.elements = room.elements.filter(
			(element) => element.elementId !== elementId
		);
		await room.save();
		socket.broadcast.to(data.roomId).emit('canvas:undo', elementId);
		cb({ msg: 'Server: Element undo', success: true });
		console.log(`User ${socket.id} undid element on room ${data.roomId}`);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error undoing element', success: false });
	}
};

const redoElement = async (data, cb, socket) => {
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
		room.elements.push(element);
		await room.save();
		socket.broadcast.to(data.roomId).emit('canvas:draw', data.element);
		cb({ msg: 'Server: Element Redo', success: true });
		console.log(`User ${socket.id} redid element on room ${data.roomId}`);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error redoing element', success: false });
	}
};

module.exports = {
	createElement,
	clearCanvas,
	undoElement,
	redoElement,
};
