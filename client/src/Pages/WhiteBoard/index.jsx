import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';

//Components
import Toolbox from '../../components/Toolbox';
import Canvas from '../../components/Canvas';
import CanvasUpper from '../../components/CanvasUpper';
import Chat from '../../components/Chat';

//Styles
import style from './style.module.scss';

const WhiteBoard = () => {
	// console.log('whiteboard');
	const [toolbox, setToolbox] = useState(defaultToolbox);
	const [orientation, setOrientation] = useState('landscape'); //landscape or portrait

	//RoomInfo
	const [roomName, setRoomName] = useState('');
	const [roomUsers, setRoomUsers] = useState([]); // [{userId,name}

	const [curUser, setCurUser] = useState(''); //name of the user

	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);

	const [messages, setMessages] = useState([]);

	const [isConnected, setIsConnected] = useState(false); //Is socketio is connected to any room, room name is provided in the url and in global Context

	const canvasRef = useRef(null);

	const roomId = useParams().roomId;

	const {
		isSignedIn,
		socket,
		userId,
		name: userName,
		token,
	} = useGlobalContext();

	const navigate = useNavigate();

	const handleOrientation = (event) => {
		// if (event.target.screen.orientation.angle === 90) {
		// 	setOrientation('landscape');
		// } else {
		// 	setOrientation('portrait');

		// 	toast.info('Please use landscape mode.', {
		// 		toastId: 'orientation',
		// 	});
		// }
		try {
			switch (screen.orientation.type) {
				case 'landscape-primary':
				case 'landscape-secondary':
					setOrientation('landscape');
					// console.log('That looks good.');
					try {
						document.documentElement.requestFullscreen();
					} catch (error) {
						console.log(error);
					}
					break;
				case 'portrait-secondary':
				case 'portrait-primary':
					setOrientation('portrait');
					// toast.info('Please use landscape mode.', {
					// 	toastId: 'orientation',
					// });
					break;
				default:
					console.log("The orientation API isn't supported in this browser :(");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		screen.orientation
			.lock('landscape')
			.then(() => {
				console.log('Orientation is locked to landscape');
			})
			.catch((error) => {
				console.log(error);
			});
		handleOrientation();
		screen.orientation.addEventListener('change', handleOrientation);
		return () => {
			screen.orientation.removeEventListener('change', handleOrientation);
			screen.orientation.unlock();
		};
	}, []);

	useEffect(() => {
		// console.log('hello from whiteboard');
		function joinRoom() {
			// console.log(token, isSignedIn);
			if (!isSignedIn) {
				if (localStorage.getItem('token')) {
					return;
				}
			}
			toast.info('Joining room...', {
				toastId: 'join',
			});
			const guestUser = JSON.parse(localStorage.getItem('guestUser'));
			socket.emit('room:join', { roomId, token, guestUser }, (response) => {
				if (response.success) {
					toast.dismiss('join');
					toast.success(response.msg),
						{
							toastId: 'join',
						};

					const {
						roomId,
						name,
						users,
						userActive,
						elements,
						messages,
						curUser,
					} = response.data;

					// console.log(users);
					// console.log(userActive);

					const userMap = new Map(); // Map to store user IDs and their status
					// Process userActive array first
					for (const user of userActive) {
						userMap.set(user.userId, { ...user, isOnline: true });
					}
					// Process users array
					for (const user of users) {
						if (!userMap.has(user.userId)) {
							userMap.set(user.userId, { ...user, isOnline: false });
						}
					}
					// Convert the userMap values (objects) back to an array
					const resultUsers = Array.from(userMap.values());
					// console.log(resultUsers);

					// console.log(response.data);
					setRoomName(name);
					setRoomUsers(resultUsers);
					setElements(elements);
					setMessages(messages);
					setCurUser(curUser);
					setIsConnected(true);

					if (curUser.isGuest) {
						localStorage.setItem('guestUser', JSON.stringify(curUser));
					}
				} else {
					console.log(response);
					toast.error(response.msg);
					navigate('/');
				}
			});
		}

		function onConnect() {
			if (roomId) {
				joinRoom();
			} else {
				socket.disconnect();
				toast.error('No room name provided');
			}
		}

		function onDisconnect() {
			setIsConnected(false);
			toast.error('Server disconnected.');
		}
		function userJoin(user) {
			//if roomusers conatin users with id from user than chagne status to online else add it to array list
			console.log(user);
			if (user.isGuest) {
				setRoomUsers((prevUsers) => [
					...prevUsers,
					{ ...user, isOnline: true },
				]);
			} else {
				const newUsers = roomUsers.filter((roomUser) => {
					roomUser.userId !== user.userId;
				});
				setRoomUsers([...newUsers, { ...user, isOnline: true }]);
			}
			// setRoomUsers((prevUsers) => [...prevUsers, user]);
			toast.info(`${user.name} joined the room`);
		}
		function userLeft(user) {
			console.log(user);
			const newUsers = roomUsers
				.map((roomUser) => {
					if (roomUser.userId === user.userId) {
						if (!user.isGuest) return { ...roomUser, isOnline: false };
						else return null;
					}
					return roomUser;
				})
				.filter((item) => item !== null);
			console.log(newUsers);
			setRoomUsers(newUsers);
			toast.info(`${user.name} left the room`);
		}

		function canvasDraw(newElements) {
			// console.log('canvas Draw event received', newElements);
			setElements((previous) => [...previous, newElements]);
		}
		function clrCanvas() {
			setElements([]);
			setHistory([]);
		}
		function undoCanvas(id) {
			setElements((prevElements) => {
				const newElements = prevElements.filter(
					(element) => element.elementId !== id
				);
				return newElements;
			});
		}
		function onMessage(msg) {
			// Update the messages state with the new message
			setMessages((prevMessages) => [...prevMessages, msg]);
		}
		function onError(error) {
			toast.error('Error: ' + error);
			console.log(error);
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		//room:userJoined
		socket.on('room:userJoined', userJoin);
		socket.on('room:userLeft', userLeft);

		socket.on('canvas:draw', canvasDraw);
		socket.on('canvas:clear', clrCanvas);
		socket.on('canvas:undo', undoCanvas);

		socket.on('chat:message', onMessage);

		socket.on('error', onError);

		socket.connect();

		return () => {
			socket.off('connect');
			socket.off('disconnect');

			socket.off('room:userJoined');
			socket.off('room:userLeft');

			socket.off('canvas:draw');
			socket.off('canvas:clear');
			socket.off('canvas:undo');

			socket.off('chat:message');

			socket.off('error');

			socket.emit('room:leave', null, (response) => {
				if (!response.success) {
					toast.info(response.msg);
				}
			});
			socket.disconnect();
		};
	}, [roomId, isSignedIn]);

	const handleUndo = () => {
		// console.log('undo');
		if (isSignedIn === false)
			return toast.error('You must be signed in to edit canvas', {
				toastId: 'signIntoedit',
			});
		if (elements.length === 0) return;
		const lastElement = elements[elements.length - 1];
		setHistory((prevState) => [...prevState, lastElement]); // add last element from elements
		setElements((prevState) => prevState.slice(0, prevState.length - 1)); // remove last element from elements
		socket.emit(
			'canvas:undo',
			{ elementId: lastElement.elementId },
			(response) => {
				if (!response.success) {
					toast.error(response.msg);
				}
			}
		);
	};
	const handleRedo = () => {
		// console.log('redo');
		if (isSignedIn === false)
			return toast.error('You must be signed in to edit canvas', {
				toastId: 'signIntoedit',
			});
		if (history.length === 0) return;
		const lastElement = history[history.length - 1];
		setElements((prevState) => [...prevState, lastElement]); // add last element from history
		setHistory((prevState) => prevState.slice(0, prevState.length - 1)); // remove last element from history
		socket.emit(
			'canvas:redo',
			{
				element: lastElement,
			},
			(response) => {
				if (!response.success) {
					toast.error(response.msg);
				}
			}
		);
	};
	const clearCanvas = () => {
		if (isSignedIn === false)
			return toast.error('You must be signed in to edit canvas', {
				toastId: 'signIntoedit',
			});
		//confirm if user want to clear canvas
		// if (!window.confirm('Are you sure you want to clear canvas?')) return;
		setElements([]);
		setHistory([]);
		socket.emit('canvas:clear', null, (response) => {
			if (!response.success) {
				toast.error(response.msg);
			}
		});
	};
	const toogleConnection = () => {
		if (isConnected === true) {
			socket.disconnect();
		} else {
			toast.info('Connecting to server...');
			socket.connect();
		}
	};

	function undoCanvas(id) {
		setElements((prevElements) => {
			const newElements = prevElements.filter(
				(element) => element.elementId !== id
			);
			return newElements;
		});
	}
	const addElement = (ele) => {
		if (isSignedIn === false)
			return toast.error('You must be signed in to draw', {
				toastId: 'signIntoedit',
			});
		// const elementId = uuidv4();
		// console.log(elementId);
		const element = { elementId: uuidv4(), ...ele };
		setElements((previous) => [...previous, element]);
		socket.emit('canvas:draw', { element }, (response) => {
			if (!response.success) {
				toast.error(response.msg);
				undoCanvas(element.elementId);
			}
		});
	};

	const sendMessage = (message) => {
		if (!isSignedIn)
			return toast.error(
				'You must be signed in to send messages',
				{
					toastId: 'signIntoedit',
				},
				{
					toastId: 'signIntoedit',
				}
			);
		setMessages((previous) => [...previous, { userId, userName, message }]);
		socket.emit(
			'chat:message',
			{ roomId, userId, userName, message },
			(response) => {
				if (!response.success) {
					toast.error(response.msg);
				}
			}
		);
	};

	if (orientation === 'portrait') {
		return (
			<div
				id={style.orientationMessage}
				className={style.container}>
				<p>Please rotate your device to landscape mode to view this page.</p>
			</div>
		);
	}
	return (
		<div className={style.container}>
			<Toolbox
				isConnected={isConnected}
				toogleConnection={toogleConnection}
				elements={elements}
				history={history}
				handleUndo={handleUndo}
				handleRedo={handleRedo}
				clearCanvas={clearCanvas}
				toolbox={toolbox}
				setToolbox={setToolbox}
				roomId={roomId}
				roomName={roomName}
				roomUsers={roomUsers}
				curUser={curUser}
			/>

			<Canvas
				elements={elements}
				canvasRef={canvasRef}
			/>
			<CanvasUpper
				canvasRef={canvasRef}
				toolbox={toolbox}
				addElement={addElement}
			/>
			<Chat
				isConnected={isConnected}
				messages={messages}
				sendMessage={sendMessage}
			/>
		</div>
	);
};

const defaultToolbox = {
	tool: 'pencil',
	strokeStyle: 'black',
	lineWidth: 5,
	fillStyle: null,
};

export default WhiteBoard;
