import Style from './navbar.module.css';
import React from 'react';
import Logo from '../../assets/sharesketch.svg';
import LogoDark from '../../assets/sharesketch_dark.svg';
import { useGlobalContext } from '../../context';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Sign from '../../components/Sign';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const Navbar = () => {
	const colorMode = useGlobalContext().getColorMode();
	const toggleColorMode = useGlobalContext().toggleColorMode;

	return (
		<nav className={Style.navCenter}>
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
				<li onClick={toggleColorMode}>
					{colorMode === 'dark' ? (
						<MdLightMode className={Style.icon} />
					) : (
						<MdDarkMode className={Style.icon} />
					)}
				</li>
				<li>
					<Link to='/'>Home</Link>
				</li>
				<li>
					<Link to='/room'>Join Room</Link>
				</li>
				<li>
					<Link to='/about'>About Us</Link>
				</li>
				<li>
					<User />
				</li>
			</ul>
		</nav>
	);
};

const User = () => {
	const [showSign, setShowSign] = React.useState(false);

	const isSignedIn = useGlobalContext().isSignedIn();

	const name = useGlobalContext().getUserName();
	const email = useGlobalContext().getUserEmail();
	const signOut = useGlobalContext().signOut;

	return (
		<div className={Style.user}>
			{isSignedIn ? (
				<>
					<p>{name}</p>
					<p>{email}</p>
					<button
						onClick={signOut}
						className={Style.signOutButton}>
						Sign Out
					</button>
				</>
			) : (
				<>
					<button
						className={Style.signInButton} // Apply the correct class for styling
						onClick={() => {
							setShowSign(!showSign);
						}}>
						Sign Up/Sign In
					</button>
					{showSign && (
						<Sign
							closeSign={() => {
								setShowSign(false);
							}}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default Navbar;
