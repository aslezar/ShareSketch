const User = require('../models/user');
const Room = require('../models/room');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

// const createRoom = async (data, cb, socket) => {
// 	//give
// 	//data = {userId}

// 	//get
// 	//two response: sucuess true with roomid else false with msg

// 	const { userId, roomName } = data;
// 	if (!mongoose.Types.ObjectId.isValid(userId)) {
// 		cb({ msg: 'Invalid User ID', success: false });
// 		return;
// 	}

// 	try {
// 		const user = await User.findById(userId).select('-password');
// 		if (!user) {
// 			cb({ msg: `User not found ${userId}`, success: false });
// 			return;
// 		}
// 		//create new Room
// 		const room = await Room.create({
// 			name: roomName,
// 			users: [{ userId: user._id, name: user.name, admin: true }],
// 		});
// 		if (!room) {
// 			cb({ msg: 'Error creating room', success: false });
// 			return;
// 		}
// 		user.myRooms.push({ roomId: room._id, name: room.name });
// 		await user.save();
// 		await room.save();

// 		cb({
// 			msg: `Successfully created room ${room.name}`,
// 			success: true,
// 			data: { roomId: room._id },
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		cb({ msg: 'Server: Error creating room', success: false });
// 	}
// };
const getRooms = async (req, res) => {
	const user = await User.findById(req.user.userId);
	if (!user) {
		throw new UnauthenticatedError('User Not Found');
	}
	res.status(StatusCodes.OK).json({
		data: {
			myRooms: user.myRooms,
			otherRooms: user.rooms,
		},
		success: true,
		msg: 'Data Fetched Successfully',
	});
};

const createRoom = async (req, res) => {
	const { userId } = req.user;
	const { roomName } = req.body;
	if (!roomName) {
		throw new BadRequestError('Room Name is required');
	}
	const user = await User.findById(userId).select('-password');
	if (!user) {
		throw new UnauthenticatedError('User Not Found');
	}
	const room = await Room.create({
		name: roomName,
		users: [{ userId: user._id, name: user.name, admin: true }],
	});
	if (!room) {
		throw new BadRequestError('Error creating room');
	}
	user.myRooms.push({ roomId: room._id, name: room.name });
	await user.save();
	await room.save();
	res.status(StatusCodes.CREATED).json({
		success: true,
		msg: `Successfully created room ${room.name}`,
		data: { roomId: room._id },
	});
};

const updateUser = async (userId, key, value) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new UnauthenticatedError('User Not Found');
	}
	if (key === 'name') {
		for (let i = 0; i < user.rooms.length; i++) {
			const room = await Room.findById(user.rooms[i].roomId);
			if (!room) {
				continue;
			}
			for (let j = 0; j < room.users.length; j++) {
				if (room.users[j].userId.toString() === userId.toString()) {
					room.users[j].name = value;
					break;
				}
			}
			await room.save();
		}
	}
	user[key] = value;
	await user.save();
};

const updateName = async (req, res) => {
	const { userId } = req.user;
	const { name } = req.body;
	if (!name) {
		throw new BadRequestError('Name is required');
	}

	await updateUser(userId, 'name', name);
	res.status(StatusCodes.OK).json({
		data: { name },
		success: true,
		msg: 'Name Updated Successfully',
	});
};
const updateBio = async (req, res) => {
	const { userId } = req.user;
	const { bio } = req.body;
	if (!bio) {
		throw new BadRequestError('Bio is required');
	}
	if (bio.length > 150) {
		throw new BadRequestError('Bio should be less than 150 characters');
	}
	await updateUser(userId, 'bio', bio);
	res.status(StatusCodes.OK).json({
		data: { bio },
		success: true,
		msg: 'Bio Updated Successfully',
	});
};
const updateImage = async (req, res) => {
	const { userId } = req.user;
	if (!req.file) {
		throw new BadRequestError('Image is required');
	}

	const profileImage = {
		data: req.file.buffer,
		contentType: req.file.mimetype,
	};

	await updateUser(userId, 'profileImage', profileImage);

	res.status(StatusCodes.OK).json({
		success: true,
		msg: 'Image Updated Successfully',
	});
};

module.exports = {
	getRooms,
	createRoom,
	updateName,
	updateBio,
	updateImage,
};
