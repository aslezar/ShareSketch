const reducer = (state, action) => {
	try {
		if (action.type === 'SIGN_IN') {
			localStorage.setItem('token', JSON.stringify(action.payload.token));
			return {
				...state,
				signedIn: true,
				userId: action.payload.userId,
				token: action.payload.token,
				name: action.payload.name,
				email: action.payload.email,
			};
		}
		if (action.type === 'SIGN_OUT') {
			localStorage.removeItem('token');
			return {
				...state,
				signedIn: false,
				userId: null,
				token: null,
				name: null,
				email: null,
				permissions: [],
			};
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
		if (action.type === 'TOGGLE_COLOR_MODE') {
			return {
				...state,
				colorMode: state.colorMode === 'dark' ? 'light' : 'dark',
			};
		}
		if (action.type === 'UPDATE_ROOM_ID') {
			return { ...state, roomId: action.payload };
		}
		if (action.type === 'UPDATE_ID') {
			return { ...state, userId: action.payload };
		}
	} catch (error) {
		console.log(error);
	}
	throw new Error('No matching action type');
};

const userInitialState = {
	signedIn: false,
	userId: '',
	name: '',
	email: '',
	token: '',
	colorMode: 'dark', //dark, light
	roomId: '',
	// permissions: [], //view, edit, delete
};
export default reducer;
