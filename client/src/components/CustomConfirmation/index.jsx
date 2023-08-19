import style from './style.module.scss';

const CustomConfirmation = ({ message, onConfirm, onCancel }) => {
	return (
		<div>
			<div>{message}</div>
			<button
				onClick={onConfirm}
				className={style.btn}>
				Confirm
			</button>
			<button
				onClick={onCancel}
				className={style.btn}>
				Cancel
			</button>
		</div>
	);
};

export default CustomConfirmation;
