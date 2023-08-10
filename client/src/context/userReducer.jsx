const reducer = (state, action) => {
	if (action.type === 'SIGN_IN') {
		localStorage.setItem('token', JSON.stringify(action.payload.token));
		return {
			signedIn: true,
			token: action.payload.token,
			name: action.payload.name,
			permissions: action.payload.permissions,
		};
	}
	if (action.type === 'SIGN_OUT') {
		localStorage.removeItem('token');
		return userInitialState;
	}
	if (action.type === 'UPDATE_TOKEN') {
		localStorage.setItem('token', JSON.stringify(action.payload));
		return { ...state, token: action.payload };
	}
	if (action.type === 'UPDATE_NAME') {
		return { ...state, name: action.payload };
	}
	if (action.type === 'ADD_PERMISSION') {
		return {
			...state,
			permissions: [...state.permissions, action.payload],
		};
	}
	if (action.type === 'REMOVE_PERMISSION') {
		return {
			...state,
			permissions: state.permissions.filter(
				(permission) => permission !== action.payload
			),
		};
	}
	if (action.type === 'CLEAR_PERMISSIONS') {
		return { ...state, permissions: [] };
	}
	if (action.type === 'SET_COLOR_MODE') {
		return { ...state, colorMode: action.payload };
	}
	if (action.type === 'UPDATE_ROOM_ID') {
		return { ...state, roomId: action.payload };
	}
	if (action.type === 'UPDATE_ID') {
		return { ...state, id: action.payload };
	}
	throw new Error('No matching action type');
};
export default reducer;
