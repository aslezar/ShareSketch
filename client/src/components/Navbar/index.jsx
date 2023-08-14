import Style from './navbar.module.css';
import React, { useEffect } from 'react';
import Logo from '../../assets/sharesketch.svg';
import LogoDark from '../../assets/sharesketch_dark.svg';
import { useGlobalContext } from '../../context';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Sign from '../../components/Sign';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import PopUp from '../PopUp';
import JoinRoom from '../JoinRoom';
import Button from '../Button';
import { AiOutlineUserAdd } from 'react-icons/ai';

const Navbar = () => {
	const [joinRoom, setJoinRoom] = React.useState(false);

	const { isSignedIn, colorMode, toggleColorMode } = useGlobalContext();
	useEffect(() => {
		return () => {
			setJoinRoom(false);
		};
	}, []);

	return (
		<nav className={Style.navCenter}>
			<div className={Style.navHeader}>
				{/* <img
					src={colorMode === 'dark' ? LogoDark : Logo}
					className={Style.logo}
					alt='logo'
				/> */}
				<span>
					<b>
						<i style={{ fontSize: '1.2rem' }}> ShareSketch</i>
					</b>
				</span>
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
				{isSignedIn && <Link to='/dashboard'>DashBoard</Link>}
				<li onClick={() => setJoinRoom((prev) => !prev)}>Join Room</li>
				<li>
					<Link to='/about'>About Us</Link>
				</li>
				<li>
					<User />
				</li>
			</ul>
			{joinRoom && (
				<PopUp
					closeSign={() => {
						setJoinRoom(false);
					}}>
					<JoinRoom />
				</PopUp>
			)}
		</nav>
	);
};

const User = () => {
	const [showSign, setShowSign] = React.useState(false);

	const { isSignedIn, name, signOut, profileImage } = useGlobalContext();

	return (
		<>
			{isSignedIn ? (
				<div
					action=''
					className={Style.user}>
					<img
						src={profileImage}
						alt={name}
						className={Style.profileImage}
					/>
					<span>
						<p>{name}</p>
						<button
							onClick={signOut}
							className={Style.signOutButton}>
							Sign Out
						</button>
					</span>
				</div>
			) : (
				<>
					{showSign && (
						<Sign
							closeSign={() => {
								setShowSign(false);
							}}
						/>
					)}
					<div
						action=''
						onClick={() => {
							setShowSign(!showSign);
						}}>
						<Button>
							<AiOutlineUserAdd />
							Sign Up/Sign In
						</Button>
					</div>
				</>
			)}
		</>
	);
};

export default Navbar;
