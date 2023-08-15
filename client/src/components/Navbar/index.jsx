import React, { useEffect } from 'react';
import style from './style.module.scss';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../context';

import Sign from '../Sign';
import PopUp from '../PopUp';
import Button from '../Button';
import JoinRoom from '../JoinRoom';

import { FaBars } from 'react-icons/fa';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const Navbar = () => {
	const [joinRoom, setJoinRoom] = React.useState(false);

	const { isSignedIn, colorMode, toggleColorMode } = useGlobalContext();
	useEffect(() => {
		return () => {
			setJoinRoom(false);
		};
	}, []);

	return (
		<>
			{joinRoom && (
				<PopUp
					closeSign={() => {
						setJoinRoom(false);
					}}>
					<JoinRoom />
				</PopUp>
			)}
			<nav className={style.nav}>
				<div className={style.navHeader}>
					<button className={style.navToggle}>
						<FaBars className={style.icon} />
					</button>
					<h1>ShareSketch</h1>
				</div>
				<div className={style.action}>
					<div onClick={toggleColorMode}>
						{colorMode === 'dark' ? (
							<MdLightMode className={style.icon} />
						) : (
							<MdDarkMode className={style.icon} />
						)}
					</div>
					<ul className={style.links}>
						<li>
							<Link to='/'>Home</Link>
						</li>
						<li>
							<Link to='/dashboard'>DashBoard</Link>
						</li>
						<li onClick={() => setJoinRoom((prev) => !prev)}>Join Room</li>
						<li>
							<Link to='/about'>About Us</Link>
						</li>
					</ul>
					<User />
				</div>
			</nav>
		</>
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
					className={style.user}>
					<img
						src={profileImage}
						alt={name}
						className={style.profileImage}
					/>
					<span>
						<p>{name.split(' ')[0]}</p>
						<button
							onClick={signOut}
							className={style.signOutButton}>
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
