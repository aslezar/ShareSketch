import React from 'react';
import style from './style.module.scss';
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
			<a
				href='http://www.freepik.com'
				target='_blank'>
				Image Credits
			</a>
			<SocaialIcons />
		</footer>
	);
};

export default Footer;
