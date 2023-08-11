import axios from 'axios';
import config from '../../config';

const URL =
	process.env.NODE_ENV === 'production' ? '/api' : config.serverAPIURL;
const API = axios.create({ baseURL: URL });

export const signIn = (data) => API.post('/auth/signin', data);
export const signUp = (data) => API.post('/auth/signup', data);
export const signinToken = (token) => API.post('/auth/signin/token', { token });
export const signOut = () => API.post('/auth/signout');

// axios
// 	.get('/user?ID=12345')
// 	.then(function (response) {
// 		// handle success
// 		console.log(response);
// 	})
// 	.catch(function (error) {
// 		// handle error
// 		console.log(error);
// 	})
// 	.finally(function () {
// 		// always executed
// 	});
