import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context';
import { useState } from 'react';
import { toast } from 'react-toastify';

const JoinRoom = () => {
	const [buttonClicked, setButtonClicked] = useState(false);

	const navigate = useNavigate();

	const isSignedIn = useGlobalContext().isSignedIn();
	const userId = useGlobalContext().getUserId();
	const socket = useGlobalContext().socket;
	const updateRoomId = useGlobalContext().updateRoomId;

	const joinRoom = () => {
		setButtonClicked(true);
		try {
			if (!socket.connected) {
				socket.connect();
			}
			socket.emit('createRoom', { userId }, (response) => {
				if (response.success) {
					toast.success(response.msg);
					updateRoomId(response.data.roomId);
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
		<div>
			<button
				style={{
					border: '2px solid red',
					position: 'absolute',
					top: '50%',
					left: '50%',
					width: '200px',
					height: '50px',
					transform: 'translate(-50%,-50%)',
					hover: 'pointer',
				}}
				disabled={buttonClicked || !isSignedIn}
				type='submit'
				onClick={joinRoom}>
				Create Room
			</button>
		</div>
	);
};

export default JoinRoom;
