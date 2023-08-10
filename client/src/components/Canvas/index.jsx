import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Toolbox from '../Toolbox';
import Chat from '../Chat';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../../context';

const defaultToolbox = {
	tool: 'pencil',
	strokeStyle: 'black',
	lineWidth: 5,
	fillStyle: null,
};

const FabricCanvas = ({ socket }) => {
	const [toolbox, setToolbox] = useState(defaultToolbox);

	const [isDrawing, setIsDrawing] = useState(false);
	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);
	const [curElement, setCurElement] = useState({});

	const [isConnected, setIsConnected] = useState(false); //For socket.io connection status

	const canvasRef = useRef(null);
	const canvasDivRef = useRef(null);
	const scaleRef = useRef(null);
	const ctx = useRef(null);

	const roomId = useGlobalContext().getRoomId();

	const draw = (ctx, element) => {
		switch (element.tool) {
			case 'pencil':
				ctx.current.beginPath();
				ctx.current.moveTo(element.path[0][0], element.path[0][1]);
				element.path.forEach((point) => {
					ctx.current.lineTo(point[0], point[1]);
				});
				ctx.current.stroke();
				break;
			case 'line':
				ctx.current.moveTo(element.x, element.y);
				ctx.current.lineTo(element.x2, element.y2);
				ctx.current.stroke();
				break;
			case 'rectangle':
				element.fillStyle &&
					ctx.current.fillRect(
						element.x,
						element.y,
						element.width,
						element.height
					);
				ctx.current.strokeRect(
					element.x,
					element.y,
					element.width,
					element.height
				);
				break;
			case 'circle':
				const center = {
					x: (element.x + element.x2) / 2,
					y: (element.y + element.y2) / 2,
				};
				const radius =
					Math.sqrt(
						Math.pow(element.x - element.x2, 2) +
							Math.pow(element.y - element.y2, 2)
					) / 2;

				ctx.current.beginPath();
				ctx.current.arc(center.x, center.y, radius, 0, 2 * Math.PI);
				element.fillStyle && ctx.current.fill();
				ctx.current.stroke();
				break;
		}
	};
	const drawAll = () => {
		clearAll();
		elements.forEach((element) => {
			ctx.current.strokeStyle = element.strokeStyle;
			ctx.current.lineWidth = element.lineWidth;
			ctx.current.fillStyle = element.fillStyle;
			draw(ctx, element);
		});
	};
	const clearAll = () => {
		ctx.current.clearRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
	};

	useEffect(() => {
		// Destructure the refs to improve readability
		const div = canvasDivRef.current;
		const canvas = canvasRef.current;
		ctx.current = canvas.getContext('2d');

		// Define constants for better organization and readability
		const resolution = 1024;
		const ratio = 1.5;

		function setSize() {
			// Calculate dimensions based on the viewport
			const height = window.innerHeight * 0.8;
			const width = height * ratio;

			const scaleFactor = resolution / height;
			scaleRef.current = scaleFactor;

			// Update styles and canvas dimensions
			div.style.width = `${width}px`;
			div.style.height = `${height}px`;

			canvas.height = resolution;
			canvas.width = resolution * ratio;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;

			ctx.current.strokeStyle = toolbox.strokeStyle;
			ctx.current.lineWidth = toolbox.lineWidth;
			ctx.current.fillStyle = toolbox.fillStyle;

			// Calculate the scale factor for high-resolution displays
			// ctx.current.scale(scaleFactor, scaleFactor);
		}

		// Initial setup
		setSize();
		window.addEventListener('resize', setSize);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener('resize', setSize);
		};
	}, []);

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

	useEffect(() => {
		drawAll();
	}, [elements]);

	useEffect(() => {
		drawAll();
		draw(ctx, curElement);
	}, [curElement]);

	const getCoordinatedFromEvent = (e) => {
		// console.log(e);
		const { offsetX, offsetY } = e.nativeEvent;
		const x = offsetX * scaleRef.current;
		const y = offsetY * scaleRef.current;
		return [x, y];
	};
	const handleMouseDown = (e) => {
		const [x, y] = getCoordinatedFromEvent(e);

		const element = {
			...toolbox,
			x,
			y,
		};

		switch (toolbox.tool) {
			case 'pencil':
				setCurElement({ ...element, path: [[x, y]] });
				// setElements((prevState) => [
				// 	...prevState,
				// 	{
				// 		...element,
				// 		path: [[x, y]],
				// 	},
				// ]);
				break;
			case 'circle':
				setCurElement({ ...element, x2: x, y2: y });
				// setElements((prevState) => [
				// 	...prevState,
				// 	{
				// 		...element,
				// 		x2: x,
				// 		y2: y,
				// 	},
				// ]);
				break;
			default:
				setCurElement({ ...element, width: 0, height: 0 });
				// setElements((prevState) => [
				// 	...prevState,
				// 	{
				// 		...element,
				// 		width: 0,
				// 		height: 0,
				// 	},
				// ]);
				break;
		}
		setIsDrawing(true);
	};
	const handleMouseMove = (e) => {
		if (!isDrawing) return;
		const [x, y] = getCoordinatedFromEvent(e);
		switch (toolbox.tool) {
			case 'pencil':
				setCurElement((prevState) => {
					return {
						...prevState,
						path: [...prevState.path, [x, y]],
					};
				});

				// setElements((prevState) => {
				// 	const index = prevState.length - 1;
				// 	const path = prevState[index].path;
				// 	path.push([x, y]);
				// 	return [
				// 		...prevState.slice(0, index),
				// 		{
				// 			...prevState[index],
				// 			path,
				// 		},
				// 	];
				// });
				break;
			case 'line':
				setCurElement((prevState) => {
					return {
						...prevState,
						x2: x,
						y2: y,
					};
				});
				// setElements((prevState) => {
				// 	const index = prevState.length - 1;
				// 	return [
				// 		...prevState.slice(0, index),
				// 		{
				// 			...prevState[index],
				// 			x2: x,
				// 			y2: y,
				// 		},
				// 	];
				// });
				break;
			case 'rectangle':
				setCurElement((prevState) => {
					const width = x - prevState.x;
					const height = y - prevState.y;
					return {
						...prevState,
						width,
						height,
					};
				});
				// setElements((prevState) => {
				// 	const index = prevState.length - 1;
				// 	const width = x - prevState[index].x;
				// 	const height = y - prevState[index].y;
				// 	return [
				// 		...prevState.slice(0, index),
				// 		{
				// 			...prevState[index],
				// 			width,
				// 			height,
				// 		},
				// 	];
				// });
				break;
			case 'circle':
				setCurElement((prevState) => {
					const width = x - prevState.x;
					const height = y - prevState.y;
					return {
						...prevState,
						x2: x,
						y2: y,
					};
				});
				// setElements((prevState) => {
				// 	const index = prevState.length - 1;
				// 	return [
				// 		...prevState.slice(0, index),
				// 		{
				// 			...prevState[index],
				// 			x2: x,
				// 			y2: y,
				// 		},
				// 	];
				// });
				break;
			default:
				console.log(`Error Occured unknown tool value ${element.tool}`);
		}
	};
	const handleMouseUp = (e) => {
		setIsDrawing(false);
		setElements((prevState) => [...prevState, curElement]);
		socket.emit('canvas:draw', { roomId, curElement });
		setCurElement({});
	};
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

	return (
		<div
			className='container'
			style={{ display: 'flex' }}>
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

			<div
				className='canvas'
				ref={canvasDivRef}
				style={{
					border: 'solid black 2px',
					marginLeft: '10vw',
					marginTop: '10vh',
				}}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}>
				<canvas ref={canvasRef} />
			</div>
			<Chat
				socket={socket}
				isConnected={isConnected}
			/>
		</div>
	);
};

export default FabricCanvas;
