import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

//Styles
import './global.css';
import 'react-toastify/dist/ReactToastify.css';

//Router
import { BrowserRouter } from 'react-router-dom';

//Toast
import { ToastContainer } from 'react-toastify';

//Global Context
import { AppProvider } from './context';

ReactDOM.createRoot(document.getElementById('root')).render(
	<AppProvider>
		<BrowserRouter>
			<ToastContainer
				autoClose={2500}
				limit={3}
				position='top-center'
				theme='dark'
			/>
			<App />
		</BrowserRouter>
	</AppProvider>
);
