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

	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);

	const [messages, setMessages] = useState([]);

	const [isConnected, setIsConnected] = useState(false); //Is socketio is connected to any room, room name is provided in the url and in global Context

	const canvasRef = useRef(null);

	const roomId = useParams().roomId;

	// const roomId2 = useGlobalContext().getRoomId();
	const isSignedIn = useGlobalContext().isSignedIn();
	const socket = useGlobalContext().socket;
	const userId = useGlobalContext().getUserId();
	const userName = useGlobalContext().getUserName();

	const navigate = useNavigate();

	useEffect(() => {
		function joinRoom() {
			socket.emit('joinRoom', { roomId, userId }, (response) => {
				if (response.success) {
					toast.success(response.msg);
					console.log(response.data);
					setElements(response.data.elements);
					setMessages(response.data.messages);
					setIsConnected(true);
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

		socket.on('canvas:draw', canvasDraw);
		socket.on('canvas:clear', clrCanvas);
		socket.on('canvas:undo', undoCanvas);

		socket.on('chat:message', onMessage);

		socket.on('error', onError);

		if (!socket.connected) socket.connect();
		else onConnect();

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('canvas:draw', canvasDraw);
			socket.off('canvas:clear', clrCanvas);
			socket.off('canvas:undo', undoCanvas);
			socket.off('chat:message', onMessage);
			socket.off('error', onError);
			socket.emit('leaveRoom', { roomId, userId }, (response) => {
				if (response.success) {
					toast.info(response.msg);
				} else {
					toast.error(response.msg);
				}
			});
			socket.disconnect();
		};
	}, []);

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
			{ roomId, userId, elementId: lastElement.elementId },
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
				roomId,
				userId,
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
		socket.emit('canvas:clear', { roomId, userId }, (response) => {
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

	const addElement = (ele) => {
		if (isSignedIn === false)
			return toast.error('You must be signed in to draw');
		const elementId = uuidv4();
		console.log(elementId);
		const element = { elementId, ...ele };
		setElements((previous) => [...previous, element]);
		socket.emit('canvas:draw', { roomId, userId, element }, (response) => {
			if (!response.success) {
				toast.error(response.msg);
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
