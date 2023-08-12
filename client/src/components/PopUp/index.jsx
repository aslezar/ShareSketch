import { GrFormClose } from 'react-icons/gr';
import Style from './popUp.module.css';

const PopUp = ({ closeSign, children }) => {
	return (
		<div className={Style.popup}>
			<GrFormClose
				onClick={closeSign}
				className={Style.close}
			/>
			{children}
		</div>
	);
};
export default PopUp;
