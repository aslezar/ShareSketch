import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../Button';
import Style from './createRoom.module.css';

const CreateRoom = () => {
	const [roomName, setRoomName] = useState('');
	const [buttonClicked, setButtonClicked] = useState(false);

	const navigate = useNavigate();

	const { isSignedIn, userId, socket } = useGlobalContext();

	const CreateRoom = (e) => {
		e.preventDefault();
		if (buttonClicked) return;
		if (!isSignedIn) return toast.error('Please Sign In to create a room.');
		if (!roomName) return toast.error('Please enter a room name.');
		setButtonClicked(true);
		try {
			if (!socket.connected) {
				socket.connect();
			}
			socket.emit('createRoom', { userId, roomName }, (response) => {
				if (response.success) {
					toast.success(response.msg);
					navigate(`/room/${response.data.roomId}`);
				} else {
					toast.error(response.msg);
				}
			});
		} catch (error) {
			console.log(error);
			toast.error('Unexpected Error Occured.');
			if (socket.connected) socket.disconnect();
			navigate('/');
		}
		setButtonClicked(false);
	};
	return (
		<div className={Style.wrapper}>
			<h1 className={Style.heading}>Create Room</h1>
			<form
				action=''
				onSubmit={CreateRoom}
				className={Style.form}>
				<div className={Style.inputContainer}>
					<input
						id='roomName'
						onChange={(e) => setRoomName(e.target.value)}
						type='text'
						placeholder='Enter Room Name: '
						value={roomName}
					/>
				</div>
				<div className={Style.actoinContainer}>
					<Button>Create Room</Button>
				</div>
			</form>
		</div>
	);
};

export default CreateRoom;
