import React, { useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { toast } from 'react-toastify';
import * as api from '../../api/index.js';
import Style from './signin.module.css';
import { useGlobalContext } from '../../context';

//Components
import Button from '../Button';

const Signin = ({ toogleSignIn, closeSign }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { signIn } = useGlobalContext();

	const handleDemoLogin = () => {
		setEmail('temp@temp.com');
		setPassword('temp@temp.com');
	};

	const validEmail = (email) => {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[?)([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;
		return re.test(email);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email === '' && password === '') {
			toast.error('Please enter email and password');
			return;
		} else if (email === '') {
			toast.error('Please enter email');
			return;
		} else if (password === '') {
			toast.error('Please enter password');
			return;
		} else if (validEmail(email) === false) {
			toast.error('Please enter a valid email');
			return;
		}
		try {
			const res = await api.signIn({ email, password });
			if (res.data.success) {
				if (signIn(res.data.data)) {
					toast.success(res.data.msg);
					closeSign();
				} else {
					toast.error('Error signing in');
					return;
				}
			} else {
				toast.error(res.data.msg);
			}
			// console.log(data);
		} catch (error) {
			// console.log(error);
			console.log(error);
			toast.error(error.response.data.msg);
		}
	};

	return (
		<div className={Style.wrapper}>
			<div className={Style.headContainer}>
				<h1 className={Style.heading}>Welcome Back</h1>
				<h2
					className={Style.dummyLogin}
					onClick={handleDemoLogin}>
					<i>Use Demo login</i>
				</h2>
			</div>
			<form
				action=''
				onSubmit={handleSubmit}
				className={Style.form}>
				<div className={Style.inputContainer}>
					<label htmlFor='email'>Email</label>
					<input
						id='email'
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Enter your email'
						type='email'
						value={email}
					/>
				</div>

				<div className={Style.inputContainer}>
					<label htmlFor='password'>Password</label>
					<input
						id='password'
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Enter your password'
						type='password'
						value={password}
					/>
				</div>

				<div className={Style.actoinContainer}>
					{/* <Link to='/account/forgotpassword'>Forgot password?</Link> */}
					<Button>
						<AiOutlineUser />
						LOGIN
					</Button>
				</div>
			</form>

			<span
				onClick={() => toogleSignIn('signup')}
				className={Style.hoverUnderline}>
				Not registered yet? Sign Up{' '}
			</span>
		</div>
	);
};

export default Signin;
