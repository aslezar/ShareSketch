function setCSSValues(mode) {
	switch (mode) {
		case 'dark': {
			document.documentElement.style.setProperty('--icon-color', '#fff');
			document.documentElement.style.setProperty('--clr-primary', '#fff');
			// document.documentElement.style.setProperty(
			// 	'--social-icons-color',
			// 	'#1a1a1a'
			// );
			// document.documentElement.style.setProperty(
			// 	'--social-icons-hover-color',
			// 	'#1a1a1a'
			// );
			break;
		}
		case 'light':
			document.documentElement.style.setProperty('--icon-color', '#000');
			document.documentElement.style.setProperty('--clr-primary', '#000');
			// document.documentElement.style.setProperty(
			// 	'--social-icons-color',
			// 	'#1a1a1a'
			// );
			// document.documentElement.style.setProperty(
			// 	'--social-icons-hover-color',
			// 	'#1a1a1a'
			// );

			break;
		default:
			console.log('invalid color mode');
	}
}
export default setCSSValues;
