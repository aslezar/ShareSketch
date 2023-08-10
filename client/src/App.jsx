import { useState } from 'react';

//Socket
import { socket } from './socket';

//Components
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import Canvas from './components/Canvas';

function App() {
	return (
		<div className='App'>
			{/* <Navbar /> */}
			{/* <Homepage /> */}
			<Canvas socket={socket} />
			{/* <Footer /> */}
		</div>
	);
}

export default App;
