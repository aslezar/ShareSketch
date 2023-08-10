// FabricCanvas.js (or any other component)

import React, { useEffect, useRef } from 'react';
import { fabric } from './fabric.js';

const FabricCanvas = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = new fabric.Canvas(canvasRef.current);

		// Add your Fabric.js code here
		// For example, you can create and add shapes to the canvas
		const rect = new fabric.Rect({
			width: 100,
			height: 100,
			fill: 'red',
			left: 50,
			top: 50,
		});
		canvas.add(rect);

		// Clean up Fabric.js objects when component unmounts
		return () => {
			canvas.dispose();
		};
	}, []);

	return <canvas ref={canvasRef} />;
};

export default FabricCanvas;
