import React, { useEffect } from 'react';
import style from './style.module.scss';
import { useGlobalContext } from '../../context';
import * as api from '../../api';

import CreateRoom from '../../components/CreateRoom';
import JoinRoom from '../../components/JoinRoom';
import Rooms from '../../components/Rooms';
import UserPanel from '../../components/UserPanel';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

const DashBoard = () => {
	const [myRooms, setMyRooms] = React.useState([]);
	const [otherRooms, setOtherRooms] = React.useState([]);

	const { userId, isSignedIn } = useGlobalContext();

	const fetchRooms = async () => {
		api.handler(
			api.getRooms,
			(data) => {
				setMyRooms(data.myRooms);
				setOtherRooms(data.otherRooms);
			},
			userId
		);
	};
	useEffect(() => {
		// console.log(userId);
		fetchRooms();
	}, [userId]);

	// if (!isSignedIn) return <h1>Sign In to view your dashboard</h1>;
	if (!isSignedIn)
		return (
			<div className={`${style.dashbaord}`}>
				<p
					style={{
						fontSize: '2rem',
					}}>
					<i>Sign In to view your dashboard.</i>
					<Link
						to='/'
						style={{
							color: 'black',
						}}>
						{' '}
						Home
					</Link>
				</p>
			</div>
		);

	return (
		<>
			<div className={style.dashbaord}>
				<div className={style.user}>
					<UserPanel />
				</div>
				<div className={style.rooms}>
					<div className={`${style.join}`}>
						<CreateRoom />
						<JoinRoom />
					</div>
					<section className={style.room}>
						<h2>My Rooms</h2>
						<Rooms rooms={myRooms} />
					</section>
					<section className={style.room}>
						<h2>Other Rooms</h2>
						<Rooms rooms={otherRooms} />
					</section>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default DashBoard;
