import { useState } from 'react';

//Socket
import io from 'socket.io-client';

//Components
import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Footer from './components/Footer';
import Canvas from './components/Canvas';

//Config
import config from '../config';

const connectionOptions = {
	forceNew: true,
	reconnectionAttempts: 'Infinity',
	timeout: 10000,
	transports: ['websocket'],
};

const socket = io(config.socketURL, connectionOptions);

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
