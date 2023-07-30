import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

//Styles
import './global.css';

//Router
import { BrowserRouter } from 'react-router-dom';

//Toast
import { ToastContainer } from 'react-toastify';

//Global Context
import { AppProvider } from '../context';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AppProvider>
			<BrowserRouter>
				<ToastContainer
					position='top-center'
					theme='dark'
					autoClose={2500}
				/>
				<App />
			</BrowserRouter>
		</AppProvider>
	</React.StrictMode>
);
