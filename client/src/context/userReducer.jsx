import profileImage from '../assets/profileImage.png';
import { userInitialState } from '.';
const reducer = (state, action) => {
	try {
		if (action.type === 'SIGN_IN') {
			localStorage.setItem('token', JSON.stringify(action.payload.token));
			const imageURL = action.payload.profileImage
				? `data:${action.payload.profileImage.contentType};base64,${action.payload.profileImage.base64Image}`
				: profileImage;
			return {
				signedIn: true,
				userId: action.payload.userId,
				name: action.payload.name,
				email: action.payload.email,
				bio: action.payload.bio,
				profileImage: imageURL,
				token: action.payload.token,
			};
		}
		if (action.type === 'SIGN_OUT') {
			localStorage.removeItem('token');
			return {
				...userInitialState,
			};
		}
		if (action.type === 'UPDATE_USER') {
			return {
				...state,
				...action.payload,
			};
		}
	} catch (error) {
		console.log(error);
	}
	throw new Error('No matching action type');
};
export default reducer;
