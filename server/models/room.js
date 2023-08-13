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
		name: { type: String },
		chat: [chatMessageSchema],
		elements: [],
		users: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				name: String,
			},
		],
		admin: {
			userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			name: String,
		},
	},
	{ timestamps: true }
);

module.exports = new mongoose.model('Room', RoomSchema);
