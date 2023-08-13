import React from 'react';
import Style from './home.module.css';
import CreateRoom from '../../components/CreateRoom';

const Homepage = () => {
	return (
		<div
			style={{
				width: '100%',
				height: '92vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '400px',
					width: '300px',
				}}>
				<CreateRoom />
			</div>
		</div>
	);
};

export default Homepage;
