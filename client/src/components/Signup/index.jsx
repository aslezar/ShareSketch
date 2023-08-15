import Style from './signup.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../../context';
import * as api from '../../api/index.js';

//Components
import Button from '../Button';

const InitState = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

function Signup({ toogleSignIn, closeSign }) {
	const [sForm, setsForm] = useState(InitState);

	const { signIn } = useGlobalContext();

	const navigate = useNavigate();

	const handleChange = (e) =>
		setsForm({
			...sForm,
			[e.target.name]: e.target.value,
		});

	const validEmail = (email) => {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[?)([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;
		return re.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (sForm.password !== sForm.confirmPassword) {
			toast.error('Passwords do not match');
			setsForm((prev) => ({
				...prev,
				confirmPassword: '',
			}));
			return;
		}
		if (sForm.password.length < 8) {
			toast.error('Password must be atleast 8 characters long');
			return;
		}
		if (validEmail(sForm.email) === false) {
			toast.error('Please enter a valid email');
			return;
		}
		if (
			sForm.name !== '' &&
			sForm.password !== '' &&
			sForm.confirmPassword !== '' &&
			sForm.email !== '' &&
			sForm.password.length >= 8
		) {
			api.handler(
				api.signUp,
				(data) => {
					signIn(data);
					closeSign();
				},
				sForm
			);
		} else {
			toast.error('Please enter all details');
		}
	};

	return (
		<div className={Style.wrapper}>
			<div className={Style.headContainer}>
				<h1 className={Style.heading}>Create your account</h1>
			</div>

			<form
				action=''
				onSubmit={handleSubmit}
				className={Style.form}>
				<div className={Style.inputContainer}>
					<label>Full Name</label>
					<input
						onChange={handleChange}
						name='name'
						placeholder='Enter your full name'
						type='text'
					/>
				</div>
				<div className={Style.inputContainer}>
					<label>Email</label>
					<input
						name='email'
						onChange={handleChange}
						placeholder='Enter your email'
						type='email'
					/>
				</div>

				<div className={Style.inputContainer}>
					<label>Password</label>
					<input
						name='password'
						onChange={handleChange}
						placeholder='Enter your password'
						type='password'
					/>
				</div>

				<div className={Style.inputContainer}>
					<label>Confirm Password</label>
					<input
						name='confirmPassword'
						onChange={handleChange}
						placeholder='Retype your password'
						type='password'
					/>
				</div>

				<div className={Style.actoinContainer}>
					<span
						onClick={() => toogleSignIn('signup')}
						className={Style.hoverUnderline}>
						Forgot Password?
					</span>
					<Button>
						<AiOutlineUserAdd />
						REGISTER
					</Button>
				</div>
			</form>
			<span
				onClick={() => toogleSignIn('signin')}
				className={Style.hoverUnderline}>
				Already Signed Up? Sign In
			</span>
		</div>
	);
}

export default Signup;
