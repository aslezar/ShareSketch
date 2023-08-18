const mongoose = require('mongoose');
const User = require('../models/user');
const Room = require('../models/room');
const jwt = require('jsonwebtoken');
const uuuidv4 = require('uuid').v4;
const _ = require('lodash');

const rooms = new Map();

// setInterval(() => {
// 	console.log('Rooms:', rooms.size);
// }, 5000);

async function getRoom(roomId) {
	if (!rooms.has(roomId)) {
		const room = await Room.findById(roomId);
		if (!room) {
			throw new Error(`Room not found with room ID ${roomId}`);
			// cb({ msg: `Room not found with room ID ${roomId}`, success: false });
			// return;
		}

		const updateRoom = _.debounce(async () => {
			try {
				await room.save();
				console.log('Room changes saved:', roomId);
			} catch (error) {
				console.error('Error saving Room changes:', error);
			}
		}, 5000);

		rooms.set(roomId, { room, updateRoom });
	}

	return rooms.get(roomId);
}

const joinRoom = async (data, cb, socket) => {
	try {
		const { roomId, token, guestUser } = data;
		if (!mongoose.Types.ObjectId.isValid(roomId)) {
			cb({ msg: 'Invalid Room ID', success: false });
			return;
		}

		socket.room = await getRoom(roomId);
		const room = socket.room.room;

		// to get room id
		// socket.room.room._id;
		// to get bounce fn
		// socket.room.updateRoom
		// to get room instance
		// socket.room.room;

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

					await user.save();
					socket.room.updateRoom();
				}

				socket.userData = {
					userId: user._id,
					name: user.name,
					isGuest: false,
					isAdmin: userInRoom.admin === true,
				};
			} catch (error) {
				cb({ msg: 'Invalid Token', success: false });
				console.log(error);
				return;
			}
		} else if (guestUser) {
			socket.userData = {
				userId: guestUser.userId,
				name: guestUser.name,
				isGuest: true,
				isAdmin: false,
			};
		} else {
			const randomName = `Guest ${Math.floor(Math.random() * 100000)}`;
			socket.userData = {
				userId: uuuidv4(),
				name: randomName,
				isGuest: true,
				isAdmin: false,
			};
		}

		socket.join(room._id);
		socket.broadcast.to(room._id).emit('room:userJoined', socket.userData);

		console.log(
			`${socket.id} joined room: ${roomId}, name: ${socket.userData.name}`
		);

		const activeUsers = socket.getActiveUsers(room._id);
		const users = room.users.map((u) => ({
			userId: u.userId,
			name: u.name,
			isAdmin: u.admin === true,
			isGuest: false,
		}));

		cb({
			msg: `Successfully joined room ${room.name}`,
			success: true,
			data: {
				roomId: room._id,
				name: room.name,
				users: users,
				userActive: activeUsers,
				elements: room.elements,
				messages: room.chat,
				curUser: socket.userData,
			},
		});
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error joining room', success: false });
	}
	// console.log('joinRoom', rooms);
};

const leaveRoom = async (data, cb, socket) => {
	try {
		const { userData } = socket;

		if (!socket.room) return;
		const { room, updateRoom } = socket.room;

		socket.leave(room._id);

		if (socket.getActiveUsers(room._id).length === 0) {
			console.log('hello3');
			rooms.delete(room._id.toString());
		} else {
			console.log('hello4');
			socket.broadcast.to(room._id).emit('room:userLeft', userData);
		}
		cb({ msg: 'Room Left', success: true });

		console.log(`${socket.id} left room: ${room._id}`);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error leaving room', success: false });
	}
};
const disconnect = (socket) => {
	try {
		console.log(`${socket.id} disconnected`);

		if (!socket.room) return;
		const { userData } = socket;
		const { room, updateRoom } = socket.room;

		socket.leave(room._id);

		if (socket.getActiveUsers(room._id).length === 0) {
			console.log('hello1');
			rooms.delete(room._id.toString());
		} else {
			console.log('hello2');
			socket.broadcast.to(room._id).emit('room:userLeft', userData);
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = { joinRoom, leaveRoom, disconnect };
