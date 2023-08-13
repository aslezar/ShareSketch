import React from 'react';
import Style from './rooms.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Rooms = ({ rooms }) => {
	// console.log(rooms);
	const navigate = useNavigate();
	if (rooms.length === 0)
		return (
			<div
				className={Style.room}
				style={{ textAlign: 'center' }}>
				<i>No Rooms to show</i>
			</div>
		);
	return (
		<ul className={Style.room}>
			{rooms.map((room, index) => {
				return (
					<li
						key={room._id}
						onClick={() => {
							navigate(`/room/${room.roomId}`);
						}}>
						<p className={Style.name}>{room.name}</p>
						<p className={Style.id}>{room.roomId}</p>
					</li>
				);
			})}
		</ul>
	);
};

export default Rooms;
