import { Routes, Route } from 'react-router-dom';

//Styles
import style from './global.module.scss';

//Components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

//Pages
import Homepage from './Pages/HomePage';
import WhiteBoard from './Pages/WhiteBoard';
import DashBooard from './Pages/DashBoard';
import ErrorPage from './Pages/ErrorPage';
function App() {
	return (
		<div className={style.app}>
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
					path='/dashboard'
					element={<DashBooard />}
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
