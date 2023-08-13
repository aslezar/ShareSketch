const mongoose = require('mongoose');
const User = require('../models/user');
const Room = require('../models/room');

const createRoom = async (data, cb, socket) => {
	//give
	//data = {userId}

	//get
	//two response: sucuess true with roomid else false with msg

	const { userId, roomName } = data;
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
		//create new Room
		const room = await Room.create({
			name: roomName,
			admin: { userId: user._id, name: user.name },
			users: [{ userId: user._id, name: user.name }],
		});
		if (!room) {
			cb({ msg: 'Error creating room', success: false });
			return;
		}
		user.myRooms.push({ roomId: room._id, name: room.name });
		await user.save();
		await room.save();

		cb({
			msg: `Successfully created room ${room.name}`,
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
		cb({ msg: 'Invalid Room ID', success: false });
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
			const userInRoom = room.users.find((user) => user.userId == userId);
			if (!userInRoom) {
				room.users.push({ userId, name: user.name });
				user.rooms.push({ roomId: room._id, name: room.name });
			}
			await user.save();
			await room.save();
		}

		socket.join(roomId);
		console.log(`${socket.id} joined room: ${data.roomId} ${room._id}`);
		socket.broadcast.to(roomId).emit('userJoined', socket.id);
		cb({
			msg: `Successfully joined room ${room.name}`,
			success: true,
			data: {
				roomId: room._id,
				name: room.name,
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
