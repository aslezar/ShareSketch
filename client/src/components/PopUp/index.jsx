import { IoCloseCircle } from 'react-icons/io5';
import style from './style.module.scss';

const PopUp = ({ closeSign, children }) => {
	const handleClose = (e) => {
		e.stopPropagation();
		if (e.target.id !== 'cover') return;
		closeSign();
	};
	return (
		<div
			onClick={handleClose}
			id='cover'
			style={{
				position: 'fixed',
				height: '100vh',
				left: '0',
				right: '0',
				bottom: '0',
				backgroundColor: 'rgba(0,0,0,0.1)',
			}}>
			<div className={style.popup}>
				<IoCloseCircle
					onClick={closeSign}
					className={style.close}
				/>
				{children}
			</div>
		</div>
	);
};
export default PopUp;
