const mongoose = require('mongoose');
const User = require('../models/user');
const Room = require('../models/room');

const createRoom = async (data, cb, socket) => {
	//give
	//data = {userId}

	//get
	//two response: sucuess true with roomid else false with msg

	const { userId } = data;
	if (!mongoose.Types.ObjectId.isValid(userId)) {
		cb({ msg: 'Invalid User ID', success: false });
		return;
	}

	try {
		const user = await User.findById(userId).select('-password');
		if (!user) {
			cb({ msg: `User not found ${userId}`, success: false });
			return;
		}
		const room = await new Room({
			users: [userId],
			admin: userId,
		});
		if (!room) {
			cb({ msg: 'Error creating room', success: false });
			return;
		}
		user.myRooms.push(room._id);
		await user.save();
		await room.save();

		cb({
			msg: 'Successfully created room',
			success: true,
			data: { roomId: room._id },
		});
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error creating room', success: false });
	}
};
const joinRoom = async (data, cb, socket) => {
	//give
	//data = {roomId, userId}
	//get
	//two response: sucuess true with data else false with msg

	const { roomId, userId } = data;
	if (!mongoose.Types.ObjectId.isValid(roomId)) {
		cb({ msg: 'Invalid Room ID2', success: false });
		return;
	}

	try {
		const room = await Room.findById(roomId);
		if (!room) {
			cb({
				msg: `Room not found with room ID ${roomId}`,
				success: false,
			});
			return;
		}
		if (userId) {
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				cb({ msg: 'Invalid User ID', success: false });
				return;
			}
			const user = await User.findById(userId).select('-password');
			if (!user) {
				cb({
					msg: `User not found with user ID ${userId}`,
					success: false,
				});
				return;
			}
			room.users.push(userId);
			user.rooms.push(room._id);
			await user.save();
			await room.save();
		}

		socket.join(roomId);
		console.log(`${socket.id} joined room: ${data.roomId}`);
		socket.broadcast.to(roomId).emit('userJoined', socket.id);
		cb({
			msg: 'Successfully joined room',
			success: true,
			data: {
				roomId: room._id,
				users: room.users,
				admin: room.admin,
				elements: room.elements,
				messages: room.chat,
			},
		});
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error joining room', success: false });
	}
};

const leaveRoom = async (data, cb, socket) => {
	const { roomId, userId } = data;
	if (!mongoose.Types.ObjectId.isValid(roomId)) {
		cb({ msg: 'Invalid Room ID2', success: false });
		return;
	}

	try {
		if (userId) {
			if (!mongoose.Types.ObjectId.isValid(userId)) {
				cb({ msg: 'Invalid User ID', success: false });
				return;
			}
			const user = await User.findById(userId).select('-password');
			if (!user) {
				cb({
					msg: `User not found with user ID ${userId}`,
					success: false,
				});
				const room = await Room.findById(roomId);
				if (!room) {
					cb({
						msg: `Room not found with room ID ${roomId}`,
						success: false,
					});
					return;
				}
				room.users = room.users.filter((id) => id !== userId);
				user.rooms = user.rooms.filter((id) => id !== roomId);
				await user.save();
				await room.save();
			}
		}
		socket.leave(roomId);
		console.log(`${socket.id} left room: ${roomId}`);
		cb({ msg: 'Room Left', success: true });
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error leaving room', success: false });
	}
};

module.exports = { createRoom, joinRoom, leaveRoom };
