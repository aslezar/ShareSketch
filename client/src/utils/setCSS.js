function setCSSValues(mode) {
	switch (mode) {
		case 'dark': {
			// 	--primary1: #ddd;
			// --primary2: #fff;
			// --primary3: #ccc;

			// --invert1: #444;
			// --invert2: #000;
			// --invert3: #333;
			document.body.style.backgroundColor = '#fff';
			document.documentElement.style.setProperty('--primary1', '#ddd');
			document.documentElement.style.setProperty('--primary2', '#fff');
			document.documentElement.style.setProperty('--primary3', '#ccc');
			document.documentElement.style.setProperty('--invert1', '#444');
			document.documentElement.style.setProperty('--invert2', '#000');
			document.documentElement.style.setProperty('--invert3', '#333');
			break;
		}
		case 'light':
			document.body.style.backgroundColor = '#000';
			document.documentElement.style.setProperty('--primary1', '#444');
			document.documentElement.style.setProperty('--primary2', '#000');
			document.documentElement.style.setProperty('--primary3', '#333');
			document.documentElement.style.setProperty('--invert1', '#ddd');
			document.documentElement.style.setProperty('--invert2', '#fff');
			document.documentElement.style.setProperty('--invert3', '#ccc');

			break;
		default:
			console.log('invalid color mode');
	}
}
export default setCSSValues;
