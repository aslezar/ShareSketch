const drawElement = (canvas, element) => {
	// console.log('drawing ele', element);
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = element.strokeStyle;
	ctx.lineWidth = element.lineWidth;
	ctx.fillStyle = element.fillStyle;
	switch (element.tool) {
		case 'pencil':
			ctx.beginPath();
			ctx.moveTo(element.path[0][0], element.path[0][1]);
			element.path.forEach((point) => {
				ctx.lineTo(point[0], point[1]);
			});
			ctx.stroke();
			break;
		case 'line':
			ctx.beginPath();
			ctx.moveTo(element.x, element.y);
			ctx.lineTo(element.x2, element.y2);
			ctx.stroke();
			break;
		case 'rectangle':
			element.fillStyle &&
				ctx.fillRect(element.x, element.y, element.width, element.height);
			ctx.strokeRect(element.x, element.y, element.width, element.height);
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

			ctx.beginPath();
			ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
			element.fillStyle && ctx.fill();
			ctx.stroke();
			break;
		default:
			console.error(`Error Occured unknown tool value in draw ${element.tool}`);
			break;
	}
};
const clearCanvas = (canvas) => {
	canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};
const drawAllElement = (canvas, elements) => {
	elements.forEach((element) => {
		drawElement(canvas, element);
	});
};

export default { drawElement, drawAllElement, clearCanvas };
