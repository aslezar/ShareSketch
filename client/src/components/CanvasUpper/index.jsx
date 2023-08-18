import React, { useEffect, useRef, useState } from 'react';

import drawCanvas from '../../utils/drawCanvas';

const CanvasUpper = ({ canvasRef, toolbox, addElement }) => {
	// console.log('canvas upper');
	const [isDrawing, setIsDrawing] = useState(false);

	const [curElement, setCurElement] = useState({});

	const canvasUpperRef = useRef(null);
	const scaleRef = useRef(null);

	useEffect(() => {
		// Destructure the refs to improve readability
		const canvas = canvasUpperRef.current;

		function setSize() {
			scaleRef.current =
				canvasRef.current.height / parseInt(canvasRef.current.style.height);

			canvas.width = canvasRef.current.width;
			canvas.height = canvasRef.current.height;

			canvas.style.width = canvasRef.current.style.width;
			canvas.style.height = canvasRef.current.style.height;

			canvas.style.position = 'fixed';
			canvas.style.top = canvasRef.current.offsetTop + 'px';
			canvas.style.left = canvasRef.current.offsetLeft + 'px';
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
		if (curElement.tool) {
			drawCanvas.clearCanvas(canvasUpperRef.current);
			drawCanvas.drawElement(canvasUpperRef.current, curElement);
		}
	}, [curElement]);

	//Helper function
	const getCoordinatedFromEvent = (e) => {
		const { clientX, clientY } = e;
		const rect = canvasUpperRef.current.getBoundingClientRect();
		const x = (clientX - rect.left) * scaleRef.current;
		const y = (clientY - rect.top) * scaleRef.current;
		return [x, y];
	};

	//Handle mouse events
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
				break;
			case 'circle':
				setCurElement({ ...element, x2: x, y2: y });
				break;
			default:
				setCurElement({ ...element, width: 0, height: 0 });
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
				break;
			case 'line':
				setCurElement((prevState) => {
					return {
						...prevState,
						x2: x,
						y2: y,
					};
				});
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
				break;
			default:
				console.error(`Error Occured unknown tool value ${element.tool}`);
		}
	};
	const handleMouseUp = (e) => {
		setIsDrawing(false);
		addElement(curElement);
		drawCanvas.clearCanvas(canvasUpperRef.current);
		setCurElement({});
	};

	return (
		<canvas
			ref={canvasUpperRef}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			onTouchStart={handleMouseDown}
			onTouchEnd={handleMouseUp}
			onTouchMove={handleMouseMove}
		/>
	);
};

export default CanvasUpper;
