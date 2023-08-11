import Style from './button.module.css';

const Button = ({ children }) => {
	return (
		<button
			type='submit'
			className={Style.btn}>
			{children}
		</button>
	);
};

export default Button;
