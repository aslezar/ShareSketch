import React from 'react';
import Signin from '../Signin';
import Signup from '../Signup';
import Style from './sign.module.css';
import { useGlobalContext } from '../../context';

import { GrFormClose } from 'react-icons/gr';

const Sign = ({ closeSign }) => {
	const [isSignin, setIsSignin] = React.useState('signin');

	const isSignedIn = useGlobalContext().isSignedIn();
	if (isSignedIn === true) closeSign();

	const toogleSignIn = (value) => {
		setIsSignin(value);
	};

	if (isSignin === 'signup')
		return (
			<StyleSign closeSign={closeSign}>
				<Signup
					toogleSignIn={toogleSignIn}
					closeSign={closeSign}
				/>
			</StyleSign>
		);
	else if (isSignin === 'signin')
		return (
			<StyleSign closeSign={closeSign}>
				<Signin
					toogleSignIn={toogleSignIn}
					closeSign={closeSign}
				/>
			</StyleSign>
		);
	return <div className={Style.sign}>Error</div>;
};

const StyleSign = ({ closeSign, children }) => {
	return (
		<div className={Style.sign}>
			<GrFormClose
				onClick={closeSign}
				className={Style.close}
			/>
			{children}
		</div>
	);
};

export default Sign;
