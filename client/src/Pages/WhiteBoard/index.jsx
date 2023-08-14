import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Navigate, useParams } from 'react-router-dom';

//Components
import Toolbox from '../../components/Toolbox';
import Canvas from '../../components/Canvas';
import CanvasUpper from '../../components/CanvasUpper';
import Chat from '../../components/Chat';

//Styles
import Style from './whiteboard.module.css';

const WhiteBoard = () => {
	const [toolbox, setToolbox] = useState(defaultToolbox);

	//RoomInfo
	const [roomName, setRoomName] = useState('');
	const [roomUsers, setRoomUsers] = useState([]); // [{userId,name}
	const [roomAdmin, setRoomAdmin] = useState(''); //userId

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

	useEffect(() => {
		function joinRoom() {
			toast.info('Joining room...');
			const guestUser = JSON.parse(localStorage.getItem('guestUser'));
			console.log(token);
			socket.emit('room:join', { roomId, token, guestUser }, (response) => {
				if (response.success) {
					toast.success(response.msg);
					// console.log(response.data);
					setRoomName(response.data.name);
					setRoomUsers(response.data.users);
					setRoomAdmin(response.data.admin);

					setElements(response.data.elements);
					setMessages(response.data.messages);

					setIsConnected(true);

					setCurUser(response.data.curUser);

					if (response.data.curUser.isGuest) {
						localStorage.setItem(
							'guestUser',
							JSON.stringify(response.data.curUser)
						);
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
			setRoomUsers((prevUsers) => [...prevUsers, user]);
			toast.info(`${user.name} joined the room`);
		}
		function userLeft(user) {
			setRoomUsers((prevUsers) => {
				if (user.userId)
					return prevUsers.filter(
						(prevUser) => prevUser.userId !== user.userId
					);
				else {
					return prevUsers.filter(
						(prevUser) => prevUser.userName !== user.userName
					);
				}
			});
			toast.info(`${user.userName} left the room`);
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
			return toast.error('You must be signed in to edit canvas');
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
			return toast.error('You must be signed in to edit canvas');
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
			return toast.error('You must be signed in to edit canvas');
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
			toast.info('Disconnecting from server...');
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
			return toast.error('You must be signed in to draw');
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
			return toast.error('You must be signed in to send messages');
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

	return (
		<div className={Style.container}>
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
				roomAdmin={roomAdmin}
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
