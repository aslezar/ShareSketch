const mongoose = require('mongoose');
const Room = require('../models/room');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const room = require('../models/room');

const isRoomIdValid = async (req, res) => {
	const { roomId } = req.body;
	console.log(roomId);
	if (mongoose.Types.ObjectId.isValid(roomId)) {
		const room = await Room.findById(roomId);
		if (room) {
			res.status(StatusCodes.OK).json({
				success: true,
				msg: 'Room Exist',
			});
		} else {
			res.status(StatusCodes.NOT_FOUND).json({
				success: false,
				msg: 'Room Not Found',
			});
		}
	} else {
		res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			msg: 'Invalid Room Id',
		});
	}
};
module.exports = {
	// createRoom,
	// getRoom,
	// getRooms,
	// updateRoom,
	// deleteRoom,
	isRoomIdValid,
};
