import React from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';

const Rooms = ({ rooms }) => {
	// console.log(rooms);
	const navigate = useNavigate();
	if (rooms.length === 0)
		return (
			<div
				className={style.room}
				style={{ textAlign: 'center' }}>
				<i>No Rooms to show</i>
			</div>
		);
	return (
		<ul className={style.room}>
			{rooms.map((room, index) => {
				return (
					<li
						key={room._id}
						onClick={() => {
							navigate(`/room/${room.roomId}`);
						}}>
						<p className={style.name}>{room.name}</p>
						<p className={style.id}>{room.roomId}</p>
					</li>
				);
			})}
		</ul>
	);
};

export default Rooms;
