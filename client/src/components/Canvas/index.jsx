import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { toast } from 'react-toastify';
import Style from './canvas.module.css';

const Canvas = ({ ctx, elements, toolbox, addElement }) => {
	const [isDrawing, setIsDrawing] = useState(false);

	const [curElement, setCurElement] = useState({});

	const canvasRef = useRef(null);
	const canvasDivRef = useRef(null);
	const scaleRef = useRef(null);

	const draw = (ctx, element) => {
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
			default:
				console.error(
					`Error Occured unknown tool value in draw ${element.tool}`
				);
				break;
		}
	};
	const drawAll = () => {
		clearAll();
		elements.forEach((element) => {
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
		drawAll();
	}, [elements]);

	useEffect(() => {
		drawAll();
		if (curElement.tool) draw(ctx, curElement);
	}, [curElement]);

	//Helper function
	const getCoordinatedFromEvent = (e) => {
		// console.log(e);
		const { offsetX, offsetY } = e.nativeEvent;
		const x = offsetX * scaleRef.current;
		const y = offsetY * scaleRef.current;
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
		setCurElement({});
	};

	return (
		<div
			className={Style.canvasDiv}
			ref={canvasDivRef}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}>
			<canvas ref={canvasRef} />
		</div>
	);
};

export default Canvas;
