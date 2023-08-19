const createElement = async (data, cb, socket) => {
	try {
		const { element } = data;
		const { userData } = socket;
		const { room, updateRoom } = socket.room;
		if (userData.isGuest) {
			cb({ msg: 'You must be login to Draw, Server', success: false });
			return;
		}
		if (!element) {
			cb({ msg: 'Server:Invalid Element', success: false });
			return;
		}

		room.elements.push(element);
		updateRoom();

		socket.broadcast.to(room._id).emit('canvas:draw', element);
		cb({ msg: 'Server: Element created', success: true });

		console.log(
			`User ${socket.id} drew on room ${room._id},name: ${userData.name}`
		);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error creating element', success: false });
	}
};

const clearCanvas = async (data, cb, socket) => {
	try {
		const { userData } = socket;
		const { room, updateRoom } = socket.room;
		if (userData.isGuest) {
			cb({ msg: 'You must be login to clear Canvas, Server', success: false });
			return;
		}

		room.elements = [];
		updateRoom();

		socket.broadcast.to(room._id).emit('canvas:clear', userData.name);
		cb({ msg: 'Server: Canvas Cleared', success: true });

		console.log(
			`User ${socket.id} cleared canvas on room ${room._id},name:${userData.name}`
		);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error clearing canvas', success: false });
	}
};

const undoElement = async (data, cb, socket) => {
	try {
		const { elementId } = data;
		const { userData } = socket;
		const { room, updateRoom } = socket.room;
		if (updateRoom.isGuest) {
			cb({ msg: 'You must be login to Undo, Server', success: false });
			return;
		}
		if (!elementId) {
			cb({ msg: 'Server:Invalid Element ID', success: false });
			return;
		}

		room.elements = room.elements.filter(
			(element) => element.elementId !== elementId
		);
		updateRoom();

		socket.broadcast.to(room._id).emit('canvas:undo', elementId);
		cb({ msg: 'Server: Element undo', success: true });

		console.log(
			`User ${socket.id} undid element on room ${room._id},name:${userData.name}`
		);
	} catch (error) {
		console.log(error);
		cb({ msg: 'Server: Error undoing element', success: false });
	}
};

const redoElement = async (data, cb, socket) => {
	try {
		const { element } = data;
		const { userData } = socket;
		const { room, updateRoom } = socket.room;
		if (userData.isGuest) {
			cb({ msg: 'You must be login to redo, Server', success: false });
			return;
		}
		if (!element) {
			cb({ msg: 'Server:Invalid Element', success: false });
			return;
		}

		room.elements.push(element);
		updateRoom();

		socket.broadcast.to(room._id).emit('canvas:draw', element);
		cb({ msg: 'Server: Element Redo', success: true });

		console.log(
			`User ${socket.id} redid element on room ${room._id},name:${userData.name}`
		);
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
