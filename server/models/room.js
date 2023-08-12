const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
	{
		userId: mongoose.Schema.Types.ObjectId,
		userName: String,
		message: String,
	},
	{ timestamps: true }
);

const RoomSchema = new mongoose.Schema(
	{
		chat: [chatMessageSchema],
		elements: [],
		users: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
			unique: true,
		},
		admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
);

module.exports = new mongoose.model('Room', RoomSchema);
