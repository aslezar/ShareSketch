import React, { useEffect } from 'react';
import Style from './dashboard.module.css';
import { useGlobalContext } from '../../context';
import * as api from '../../api';

import CreateRoom from '../../components/CreateRoom';
import JoinRoom from '../../components/JoinRoom';
import Rooms from '../../components/Rooms';
import UserPanel from '../../components/UserPanel';
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
			<div className={`${Style.dashbaord}`}>
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
		<div className={`${Style.dashbaord}`}>
			<div className={`${Style.user} ${Style.child}`}>
				<UserPanel />
			</div>
			<div className={`${Style.rooms} ${Style.child}`}>
				<div className={`${Style.join}`}>
					<CreateRoom />
					<JoinRoom />
				</div>
				<section className={Style.room}>
					<h2 className={Style.heading}>My Rooms</h2>
					<Rooms rooms={myRooms} />
				</section>
				<section className={Style.room}>
					<h2 className={Style.heading}>Other Rooms</h2>
					<Rooms rooms={otherRooms} />
				</section>
			</div>
		</div>
	);
};

export default DashBoard;
