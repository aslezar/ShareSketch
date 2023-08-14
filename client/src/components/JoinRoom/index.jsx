import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../Button';
import Style from './joinroom.module.css';
import * as api from '../../api/index.js';
const JoinRoom = () => {
	const [roomId, setRoomId] = useState('');
	const navigate = useNavigate();

	const joinRoom = async (e) => {
		e.preventDefault();
		console.log('join room called');
		api.handler(
			api.isRoomIdValid,
			(data) => {
				navigate(`/room/${roomId}`);
			},
			roomId
		);
		// try {
		// 	const res = await api.isRoomIdValid(roomId);
		// 	console.log(res.data);
		// 	if (res.data.success) {
		// 		navigate(`/room/${roomId}`);
		// 	} else {
		// 		toast.error(res.data.msg);
		// 	}
		// } catch (error) {
		// 	console.log(error);
		// 	toast.error(error.response.data.msg);
		// }
	};
	return (
		<div className={Style.wrapper}>
			<h1 className={Style.heading}>Join Room</h1>
			<form
				action=''
				onSubmit={joinRoom}
				className={Style.form}>
				<div className={Style.inputContainer}>
					<input
						name='roomId'
						onChange={(e) => setRoomId(e.target.value)}
						placeholder='Enter room ID to join...'
						type='text'
					/>
				</div>
				<div className={Style.actoinContainer}>
					<Button>Join Room</Button>
				</div>
			</form>
		</div>
	);
};

export default JoinRoom;
