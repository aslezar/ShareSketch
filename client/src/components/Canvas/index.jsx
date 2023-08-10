import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';

const FabricCanvas = ({ socket }) => {
	const [tool, setTool] = useState('pencil');
	const [color, setColor] = useState('black');
	const [lineWidth, setLineWidth] = useState(5);
	const [fillStyle, setfillStyle] = useState(null);

	const [isDrawing, setIsDrawing] = useState(false);
	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);

	const canvasRef = useRef(null);
	const canvasDivRef = useRef(null);
	const scaleRef = useRef(null);
	const ctx = useRef(null);

	const drawAll = () => {
		elements.forEach((element) => {
			ctx.current.strokeStyle = element.strokeStyle;
			ctx.current.lineWidth = element.lineWidth;
			ctx.current.fillStyle = element.fillStyle;
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
		});
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

			// Calculate the scale factor for high-resolution displays
			// ctx.current.scale(scaleFactor, scaleFactor);
		}

		// Initial setup
		setSize();
		window.addEventListener('resize', setSize);

		// Set up canvas context properties

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener('resize', setSize);
		};
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (elements.length > 0) {
			ctx.current.clearRect(
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height
			);
		}
		drawAll();
	}, [elements]);
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
			tool,
			x,
			y,
			strokeStyle: color,
			lineWidth: lineWidth,
			fillStyle: fillStyle,
		};

		switch (tool) {
			case 'pencil':
				setElements((prevState) => [
					...prevState,
					{
						...element,
						path: [[x, y]],
					},
				]);
				break;
			case 'circle':
				setElements((prevState) => [
					...prevState,
					{
						...element,
						x2: x,
						y2: y,
					},
				]);
				break;
			default:
				setElements((prevState) => [
					...prevState,
					{
						...element,
						width: 0,
						height: 0,
					},
				]);
				break;
		}
		setIsDrawing(true);
	};
	const handleMouseMove = (e) => {
		if (!isDrawing) return;
		const [x, y] = getCoordinatedFromEvent(e);
		switch (tool) {
			case 'pencil':
				setElements((prevState) => {
					const index = prevState.length - 1;
					const path = prevState[index].path;
					path.push([x, y]);
					return [
						...prevState.slice(0, index),
						{
							...prevState[index],
							path,
						},
					];
				});
				break;
			case 'line':
				setElements((prevState) => {
					const index = prevState.length - 1;
					return [
						...prevState.slice(0, index),
						{
							...prevState[index],
							x2: x,
							y2: y,
						},
					];
				});
				break;
			case 'rectangle':
				setElements((prevState) => {
					const index = prevState.length - 1;
					const width = x - prevState[index].x;
					const height = y - prevState[index].y;
					return [
						...prevState.slice(0, index),
						{
							...prevState[index],
							width,
							height,
						},
					];
				});
				break;
			case 'circle':
				setElements((prevState) => {
					const index = prevState.length - 1;
					return [
						...prevState.slice(0, index),
						{
							...prevState[index],
							x2: x,
							y2: y,
						},
					];
				});
				break;
			default:
				console.log(`Error Occured unknown tool value ${element.tool}`);
		}
	};
	const handleMouseUp = (e) => {
		setIsDrawing(false);
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
		ctx.current.clearRect(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
		setElements([]);
		setHistory([]);
	};

	return (
		<div
			className='container'
			style={{ display: 'flex' }}>
			<div
				className='toolbox'
				style={{
					border: 'solid red 2px',
					minWidth: '200px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-evenly',
				}}>
				<div className='tool'>
					<label htmlFor='tool'>Tool: </label>
					<select
						name='tool'
						id='tool'
						onChange={(e) => setTool(e.target.value)}>
						<option value='pencil'>Pencil</option>
						<option value='line'>Line</option>
						<option value='rectangle'>Rectangle</option>
						<option value='circle'>Circle</option>
					</select>
				</div>
				<div
					className='lineWidth'
					style={{ display: 'flex', flexDirection: 'column' }}>
					<label htmlFor='lineWidth'>Line Width</label>
					<input
						type='number'
						value={lineWidth}
						min={1}
						max={100}
						style={{ width: '50px' }}
						name={'lineWidth'}
						onChange={(e) => {
							let value = parseInt(e.target.value);
							if (value > 100) value = 100;
							else if (value < 1) value = 1;
							setLineWidth(value);
						}}
					/>
					<input
						type='range'
						min={1}
						max={100}
						value={lineWidth}
						name='lineWidth'
						onChange={(e) => setLineWidth(e.target.value)}
					/>
				</div>
				<div
					className='color'
					style={{ display: 'flex', justifyContent: 'space-evenly' }}>
					<label htmlFor='color'>Color:</label>
					<input
						type='color'
						onChange={(e) => setColor(e.target.value)}
					/>
				</div>
				<div
					className='fillStyle'
					style={{ display: 'flex', justifyContent: 'space-evenly' }}>
					<label htmlFor='fillStyle'>Fill Color:</label>
					<input
						type='color'
						onChange={(e) => setfillStyle(e.target.value)}
					/>
				</div>
				<button
					type='button'
					disabled={elements.length < 1}
					onClick={handleUndo}>
					Undo
				</button>
				<button
					type='button'
					disabled={history.length < 1}
					onClick={handleRedo}>
					Redo
				</button>
				<button
					type='button'
					disabled={elements.length < 1}
					onClick={clearCanvas}>
					Clear Canvas
				</button>
			</div>

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
		</div>
	);
};

export default FabricCanvas;
