import React, { useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as api from '../api/index.js';
import reducer from './userReducer.jsx';
import { socket } from '../socket';
import setCSSValues from '../utils/setCSS.js';

const AppContext = React.createContext();
export const userInitialState = {
	signedIn: false,
	userId: '',
	name: '',
	email: '',
	bio: '',
	profileImage: '',
	token: '',
};

const AppProvider = ({ children }) => {
	const [user, dispatch] = useReducer(reducer, userInitialState);
	// const [roomId, setRoomId] = React.useState(''); //roomId is used to join room
	const [colorMode, setColorMode] = React.useState('light'); //dark, light

	const initialFromLocalStorage = async (tokenValue) => {
		api.handler(
			api.signinToken,
			(data) => {
				signIn(data);
			},
			tokenValue,
			(error) => {
				localStorage.removeItem('token');
			}
		);
	};

	useEffect(() => {
		setCSSValues(colorMode);
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

	//update functions
	const updateUser = (newUser) => {
		dispatch({ type: 'UPDATE_USER', payload: newUser });
	};
	const signIn = ({ userId, name, token, email, bio, profileImage }) => {
		// console.log('signing in');
		if (!userId || !name || !token || !email) {
			console.error('Error Signing in, invalid data');
			return false;
		}
		dispatch({
			type: 'SIGN_IN',
			payload: { userId, name, token, email, bio, profileImage },
		});
		return true;
	};
	const signOut = async () => {
		if (socket.connected) socket.disconnect();
		const res = await api.signOut();
		dispatch({ type: 'SIGN_OUT' });
	};
	// const updateRoomId = (newRoomId) => {
	// 	setRoomId(newRoomId);
	// };
	const toggleColorMode = () => {
		toast.info('pagal bnaya bda mza aaya 😂');
		setTimeout(() => {
			toast.info('rhta h abhi ye');
		}, 2000);
		setColorMode((prevMode) => {
			if (prevMode === 'dark') setCSSValues('light');
			else setCSSValues('dark');
			return prevMode === 'dark' ? 'light' : 'dark';
		});
	};

	return (
		<AppContext.Provider
			value={{
				socket,
				userId: user.userId,
				name: user.name,
				email: user.email,
				profileImage: user.profileImage,
				bio: user.bio,
				colorMode,
				isSignedIn: user.signedIn,
				token: user.token,
				toggleColorMode,
				signIn,
				signOut,
				updateUser,
				// getRoomId,
				// updateRoomId,
			}}>
			{children}
		</AppContext.Provider>
	);
};
const useGlobalContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
