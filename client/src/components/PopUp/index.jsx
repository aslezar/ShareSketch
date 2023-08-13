import { GrFormClose } from 'react-icons/gr';
import Style from './popUp.module.css';

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
			<div className={Style.popup}>
				<GrFormClose
					onClick={closeSign}
					className={Style.close}
				/>
				{children}
			</div>
		</div>
	);
};
export default PopUp;
