import React from 'react';
import style from './footer.module.css';
import SocaialIcons from '../SocailIcons';

const Footer = () => {
	return (
		<footer className={style.footer}>
			<p>&copy; 2023 ShareSketch. All rights reserved.</p>
			<b>
				<a
					href='https://github.com/aslezar/ShareSketch'
					target='_blank'>
					Source Code
				</a>
			</b>
			<SocaialIcons />
		</footer>
	);
};

export default Footer;
