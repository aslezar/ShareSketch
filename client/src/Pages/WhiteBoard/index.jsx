import { useState, useRef, useEffect } from 'react';
import Toolbox from '../../components/Toolbox';
import Canvas from '../../components/Canvas';
import Chat from '../../components/Chat';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../../context';

//Styles
import Style from './whiteboard.module.css';

const WhiteBoard = ({ socket }) => {
	const [toolbox, setToolbox] = useState(defaultToolbox);

	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);

	const [isConnected, setIsConnected] = useState(false); //For socket.io connection status

	const ctx = useRef(null);

	const roomId = useGlobalContext().getRoomId();

	useEffect(() => {
		function joinRoom() {
			socket.emit('joinRoom', roomId, (response) => {
				if (response.success) {
					toast.success(response.message);
					setIsConnected(true);
				} else {
					toast.error(response.message);
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
			toast.error('Server disconnected...');
		}

		function canvasDraw(newElements) {
			console.log('canvas Draw event received', newElements);
			setElements((previous) => [...previous, newElements]);
			// setElements((previous) => [...previous, newElements]);
		}

		function onError(error) {
			toast.error('Error: ' + error);
			console.log(error);
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('canvas:draw', canvasDraw);
		socket.on('error', onError);

		socket.connect();

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('canvas:draw', canvasDraw);
			socket.off('error', onError);
			socket.emit('leaveRoom', roomId);
			socket.disconnect();
		};
	}, []);

	const handleUndo = () => {
		// console.log('undo');
		if (elements.length === 0) return;
		setHistory((prevState) => [...prevState, elements[elements.length - 1]]); // add last element from elements
		setElements((prevState) => prevState.slice(0, prevState.length - 1)); // remove last element from elements
	};
	const handleRedo = () => {
		// console.log('redo');
		if (history.length === 0) return;
		setElements((prevState) => [...prevState, history[history.length - 1]]); // add last element from history
		setHistory((prevState) => prevState.slice(0, prevState.length - 1)); // remove last element from history
	};
	const clearCanvas = () => {
		setElements([]);
		setHistory([]);
	};
	const toogleConnection = () => {
		if (isConnected === true) socket.disconnect();
		else socket.connect();
	};

	const addElement = (element) => {
		setElements((previous) => [...previous, element]);
		socket.emit('canvas:draw', { roomId, element });
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
				ctx={ctx}
				elements={elements}
				toolbox={toolbox}
				addElement={addElement}
			/>
			<Chat
				socket={socket}
				isConnected={isConnected}
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
