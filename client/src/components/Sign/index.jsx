import React from 'react';
import Signin from '../Signin';
import Signup from '../Signup';
import PopUp from '../PopUp';
import Style from './sign.module.css';
import { useGlobalContext } from '../../context';

const Sign = ({ closeSign }) => {
	const [isSignin, setIsSignin] = React.useState('signin');

	const { isSignedIn } = useGlobalContext();
	if (isSignedIn === true) closeSign();

	const toogleSignIn = (value) => {
		setIsSignin(value);
	};

	if (isSignin === 'signup')
		return (
			<PopUp closeSign={closeSign}>
				<Signup
					toogleSignIn={toogleSignIn}
					closeSign={closeSign}
				/>
			</PopUp>
		);
	else if (isSignin === 'signin')
		return (
			<PopUp closeSign={closeSign}>
				<Signin
					toogleSignIn={toogleSignIn}
					closeSign={closeSign}
				/>
			</PopUp>
		);
	return <div className={Style.sign}>Error</div>;
};

export default Sign;
