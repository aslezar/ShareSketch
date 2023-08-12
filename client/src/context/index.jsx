import React, { useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as api from '../api/index.js';
import reducer from './userReducer.jsx';
import { socket } from '../socket';

const AppContext = React.createContext();
const userInitialState = {
	signedIn: false,
	userId: '',
	name: '',
	email: '',
	token: '',
	colorMode: 'dark', //dark, light
	roomId: '64d659886727614d5eae9dd1',
	// permissions: [], //view, edit, delete
};

const AppProvider = ({ children }) => {
	const [user, dispatch] = useReducer(reducer, userInitialState);
	// const [isLoading, setIsLoading] = useState(false);

	const initialFromLocalStorage = async (tokenValue) => {
		try {
			const res = await api.signinToken(tokenValue);
			const { userId, name, email, token } = res.data.data;
			if (!userId || !name || !email || !token)
				throw new Error('Invalid token');
			console.log(res.data);
			dispatch({
				type: 'SIGN_IN',
				payload: { userId, name, email, token },
			});
		} catch (error) {
			localStorage.removeItem('token');
			console.log(error);
			toast.error(error?.data?.msg);
		}
	};

	useEffect(() => {
		const token = JSON.parse(localStorage.getItem('token')) || null;
		if (token) initialFromLocalStorage(token);
	}, []);

	useEffect(() => {
		socket.on('connect', () => {
			console.log('socket connected');
		});
		socket.on('disconnect', () => {
			console.log('socket disconnected');
		});
		return () => {
			socket.off('connect');
			socket.off('disconnect');
		};
	}, []);

	//get functions
	const getUserName = () => {
		return user.name;
	};
	const getUserToken = () => {
		return user.token;
	};
	const canRead = () => {
		return user.permissions.includes('read');
	};
	const canEdit = () => {
		return user.permissions.includes('edit');
	};
	const canDelete = () => {
		return user.permissions.includes('delete');
	};
	const getUserPermissions = () => {
		return user.permissions;
	};
	const getColorMode = () => {
		return user.colorMode;
	};
	const isSignedIn = () => {
		return user.signedIn;
	};
	const getRoomId = () => {
		return user.roomId;
	};
	const getUserId = () => {
		return user.userId;
	};

	//update functions
	const updateToken = (newtoken) => {
		dispatch({ type: 'UPDATE_TOKEN', payload: newtoken });
	};
	const updateName = (newname) => {
		dispatch({ type: 'UPDATE_NAME', payload: newname });
	};
	const addPermission = (newpermission) => {
		dispatch({ type: 'ADD_PERMISSION', payload: newpermission });
	};
	const removePermission = (newpermission) => {
		dispatch({ type: 'REMOVE_PERMISSION', payload: newpermission });
	};
	const clearPermissions = () => {
		dispatch({ type: 'CLEAR_PERMISSIONS' });
	};
	const toggleColorMode = () => {
		dispatch({ type: 'TOGGLE_COLOR_MODE' });
	};
	const signIn = ({ userId, name, token, email }) => {
		if (!userId || !name || !token || !email)
			return console.log('Error Code : 1');
		dispatch({
			type: 'SIGN_IN',
			payload: { userId, name, token, email },
		});
	};
	const signOut = async () => {
		if (socket.connected) socket.disconnect();
		const res = await api.signOut();
		dispatch({ type: 'SIGN_OUT' });
	};
	const updateRoomId = (newRoomId) => {
		dispatch({ type: 'UPDATE_ROOM_ID', payload: newRoomId });
	};
	const getUserEmail = () => {
		return user.email;
	};

	return (
		<AppContext.Provider
			value={{
				socket,
				getUserName,
				getUserEmail,
				getUserToken,
				canRead,
				canEdit,
				canDelete,
				getUserPermissions,
				getColorMode,
				isSignedIn,
				updateToken,
				updateName,
				addPermission,
				removePermission,
				clearPermissions,
				toggleColorMode,
				signIn,
				signOut,
				getRoomId,
				updateRoomId,
				getUserId,
			}}>
			{children}
		</AppContext.Provider>
	);
};
const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
