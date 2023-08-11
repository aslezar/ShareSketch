import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

//Components
import Navbar from './components/Navbar';

//Pages
import Homepage from './Pages/HomePage';
import WhiteBoard from './Pages/WhiteBoard';
import ErrorPage from './Pages/ErrorPage';
function App() {
	return (
		<div className='App'>
			<Navbar />
			<Routes>
				<Route
					path='/'
					element={<Homepage />}
				/>
				<Route
					path='/room/:roomId'
					element={<WhiteBoard />}
				/>
				<Route
					path='/*'
					element={<ErrorPage />}
				/>
			</Routes>
		</div>
	);
}

export default App;
