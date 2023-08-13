import { userInitialState } from '.';
const reducer = (state, action) => {
	try {
		if (action.type === 'SIGN_IN') {
			localStorage.setItem('token', JSON.stringify(action.payload.token));
			const dataUrl = `data:${action.payload.profileImage.contentType};base64,${action.payload.profileImage.base64Image}`;
			return {
				signedIn: true,
				userId: action.payload.userId,
				name: action.payload.name,
				email: action.payload.email,
				bio: action.payload.bio,
				profileImage: dataUrl,
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
			if (action.payload.profileImage) {
				const dataUrl = `data:${action.payload.profileImage.contentType};base64,${action.payload.profileImage.base64Image}`;
				action.payload.profileImage = dataUrl;
			}
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
