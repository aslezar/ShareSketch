import axios from 'axios';
import config from '../../config';

const URL =
	process.env.NODE_ENV === 'production' ? '/api' : config.serverAPIURL;
const API = axios.create({ baseURL: URL });

export const signIn = (data) => API.post('/auth/signin', data);
export const signUp = (data) => API.post('/auth/signup', data);
export const signinToken = (token) => API.post('/auth/signin/token', { token });
export const signOut = () => API.post('/auth/signout');

export const isRoomIdValid = (roomId) => API.post('/room/isValid', { roomId });

export const getRooms = () => {
	const token = JSON.parse(localStorage.getItem('token')) || null;

	return API.get('/user/getrooms', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
export const updateName = (name) => {
	const token = JSON.parse(localStorage.getItem('token')) || null;
	return API.patch(
		'/user/updatename',
		{ name },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
};
export const updateBio = (bio) => {
	const token = JSON.parse(localStorage.getItem('token')) || null;
	return API.patch(
		'/user/updatebio',
		{ bio },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
};
export const updateImage = (profileImage) => {
	const token = JSON.parse(localStorage.getItem('token')) || null;
	const formData = new FormData();
	formData.append('profileImage', profileImage);
	return API.patch('/user/updateimage', formData, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'multipart/form-data',
		},
	});
};

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
