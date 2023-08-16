function setCSSValues(mode) {
	switch (mode) {
		// /--themeColor: #f0f0f0;
		// --themeInverseColor: #000;
		// --textColor2: #fff;
		// --textColor3: #ccc;
		// --canvasColor: #141414;
		case 'dark': {
			document.documentElement.style.setProperty('--themeColor', '#000');
			document.documentElement.style.setProperty('--textColor2', '#fff');
			document.documentElement.style.setProperty('--textColor3', '#ccc');
			document.documentElement.style.setProperty('--themeInverseColor', '#fff');
			document.documentElement.style.setProperty('--canvasColor', '#141414');
			break;
		}
		case 'light':
			document.documentElement.style.setProperty('--themeColor', '#fff');
			document.documentElement.style.setProperty('--textColor2', '#000');
			document.documentElement.style.setProperty('--textColor3', '#333');
			document.documentElement.style.setProperty('--themeInverseColor', '#000');
			document.documentElement.style.setProperty('--canvasColor', '#ddd');
			break;
		default:
			console.log('invalid color mode');
	}
}
export default setCSSValues;
