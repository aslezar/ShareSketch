import React, { useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as api from '../api/index.js';
import reducer from './userReducer.jsx';
const AppContext = React.createContext();
const userInitialState = {
	signedIn: 'false',
	token: '',
	name: 'Raman',
	id: '',
	permissions: [], //view, edit, delete
	colorMode: 'dark', //dark, light
	roomId: 'hello',
};

const AppProvider = ({ children }) => {
	const [user, dispatch] = useReducer(reducer, userInitialState);

	useEffect(() => {
		const token = JSON.parse(localStorage.getItem('token')) || null;
		try {
			if (token) {
				const { name, token, permissions } = api.signInFromToken(token);
			}
			dispatch({
				type: 'SIGN_IN',
				payload: { name, token, permissions },
			});
		} catch (error) {
			toast.error(error?.data?.msg || error);
		}
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
		return user.id;
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
	const setColorMode = (newmode) => {
		dispatch({ type: 'SET_COLOR_MODE', payload: newmode });
	};
	const signIn = ({ name, token, permissions }) => {
		if (!name || !token || !permissions) return console.log('Error Code : 1');
		dispatch({
			type: 'SIGN_IN',
			payload: { name, token, permissions, signedIn },
		});
	};
	const signOut = () => {
		dispatch({ type: 'SIGN_OUT' });
	};
	const updateRoomId = (newRoomId) => {
		dispatch({ type: 'UPDATE_ROOM_ID', payload: newRoomId });
	};
	const updateId = (newId) => {
		dispatch({ type: 'UPDATE_ID', payload: newId });
	};

	return (
		<AppContext.Provider
			value={{
				getUserName,
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
				setColorMode,
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
