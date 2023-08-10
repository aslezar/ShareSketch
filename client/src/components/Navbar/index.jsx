import Style from './navbar.module.css';
import React from 'react';
import Logo from '../../assets/sharesketch.svg';
import LogoDark from '../../assets/sharesketch_dark.svg';
import { useGlobalContext } from '../../context';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
	const colorMode = useGlobalContext().getColorMode();

	return (
		<nav>
			<div className={Style.navCenter}>
				<div className={Style.navHeader}>
					<img
						src={colorMode === 'dark' ? LogoDark : Logo}
						className={Style.logo}
						alt='logo'
					/>
					<button className={Style.navToggle}>
						<FaBars style={colorMode === 'dark' && { color: 'black' }} />
					</button>
				</div>
				<ul className={Style.links}>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/about'>About Us</Link>
					</li>
					<li>
						<Link to='/contact'>Sign Up/Sign In</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
};

const User = (props) => {
	return (
		<div className={Style.user}>
			<img
				src={props.img}
				alt='user'
			/>
			<p>{props.name}</p>
		</div>
	);
};

export default Navbar;
