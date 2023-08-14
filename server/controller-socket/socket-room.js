const mongoose = require('mongoose');
const User = require('../models/user');
const Room = require('../models/room');
const jwt = require('jsonwebtoken');
const uuuidv4 = require('uuid').v4;
const joinRoom = async (data, cb, socket) => {
	const { roomId, token, guestUser } = data;
	if (!mongoose.Types.ObjectId.isValid(roomId)) {
		cb({ msg: 'Invalid Room ID', success: false });
		return;
	}

	try {
		const room = await Room.findById(roomId);
		if (!room) {
			cb({ msg: `Room not found with room ID ${roomId}`, success: false });
			return;
		}

		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				const userId = decoded.userId;
				const user = await User.findById(userId).select('-password');
				if (!user) {
					cb({ msg: `User not found with user ID ${userId}`, success: false });
					return;
				}

				const userInRoom = room.users.find((u) => u.userId == userId);
				if (!userInRoom) {
					room.users.push({ userId, name: user.name });
					user.rooms.push({ roomId: room._id, name: room.name });
				}

				socket.userId = userId;
				socket.userName = user.name;
				socket.isGuest = false;

				await user.save();
				await room.save();
			} catch (error) {
				cb({ msg: 'Invalid Token', success: false });
				console.log(error);
				return;
			}
		} else if (guestUser) {
			socket.userName = guestUser.name;
			socket.userId = guestUser.userId;
			socket.isGuest = true;
		} else {
			//generate random name
			const randomName = `Guest ${Math.floor(Math.random() * 100000)}`;
			socket.userName = randomName;
			socket.userId = uuuidv4();
			socket.isGuest = true;
		}

		socket.roomId = roomId;
		socket.join(roomId);
		console.log(
			`${socket.id} joined room: ${data.roomId} ${room._id} ${
				socket.userId ? `signed in as ${socket.userName}` : 'not signed in'
			}`
		);
		socket.broadcast.to(roomId).emit('room:userJoined', {
			userId: socket?.userId || null,
			name: socket.userName,
		});
		const guestUsers = socket.getGuestUsers(roomId);
		cb({
			msg: `Successfully joined room ${room.name}`,
			success: true,
			data: {
				roomId: room._id,
				name: room.name,
				users: [...room.users, ...guestUsers],
				elements: room.elements,
				messages: room.chat,
				userName: socket.userName,
				curUser: {
					userId: socket.userId,
					name: socket.userName,
					isGuest: socket.isGuest,
				},
			},
		});
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error joining room', success: false });
	}
};

const leaveRoom = async (data, cb, socket) => {
	const { roomId, userName } = socket; // Include userName from socket context

	if (!mongoose.Types.ObjectId.isValid(roomId)) {
		cb({ msg: 'Invalid Room ID', success: false });
		return;
	}

	try {
		socket.leave(roomId);
		console.log(`${socket.id} left room: ${roomId}`);
		socket.broadcast.to(roomId).emit('room:userLeft', {
			userId: socket?.userId || null,
			userName: userName, // Use the userName from socket context
		});
		cb({ msg: 'Room Left', success: true });
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error leaving room', success: false });
	}
};
const disconnect = (socket) => {
	console.log(`${socket.id} disconnected`);
	const { roomId, userId, userName } = socket;
	if (roomId) {
		socket.leave(roomId);
		socket.broadcast.to(roomId).emit('room:userLeft', {
			userId: userId || null,
			userName: userName || null,
		});
	}
};

module.exports = { joinRoom, leaveRoom, disconnect };
