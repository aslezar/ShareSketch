import style from './style.module.scss';
import { IoIosUndo, IoIosRedo } from 'react-icons/io';
import { GrClearOption } from 'react-icons/gr';
import { MdContentCopy } from 'react-icons/md';
import { FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
const Toolbox = ({
	isConnected,
	toogleConnection,
	elements,
	history,
	handleUndo,
	handleRedo,
	clearCanvas,
	toolbox,
	setToolbox,
	roomId,
	roomName,
	roomUsers,
	roomAdmin,
	curUser,
}) => {
	const handleChange = (e) => {
		setToolbox((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};
	const handleCopy = () => {
		toast.info('Room Id copied to clipboard');
		navigator.clipboard.writeText(roomId);
	};
	const handleShare = () => {
		toast.info('Link copied to clipboard');
		navigator.clipboard.writeText(window.location.href);
	};
	return (
		<div className={style.container}>
			<div className={style.heading}>
				<button
					className={`${style.button} ${
						isConnected ? style.connected : style.disconnected
					}`}
					onClick={toogleConnection}>
					{isConnected ? 'Connected' : 'Disconnected'}
				</button>
				<p className={style.roomName}>
					Room:{' '}
					{roomName ? (
						<i>
							<b>{roomName}</b>{' '}
						</i>
					) : (
						'Unknown'
					)}
				</p>
				<p className={style.roomName}>
					Name:{' '}
					{curUser.name ? (
						<i>
							<b>{curUser.name}</b>{' '}
						</i>
					) : (
						'Unknown'
					)}
				</p>
				<div className={style.share}>
					<button
						className={style.button}
						onClick={handleCopy}>
						<MdContentCopy
							style={{
								width: '1rem',
								height: '1rem',
							}}
						/>{' '}
						Copy RoomID
					</button>
					<button
						className={style.button}
						onClick={handleShare}>
						<FaShareAlt
							style={{
								width: '1rem',
								height: '1rem',
							}}
						/>
						Share Link
					</button>
				</div>
			</div>
			<div className={style.toolbox}>
				<section className={style.tools}>
					<div className={style.tool}>
						<label htmlFor='tool'>Tool: </label>
						<select
							name='tool'
							onChange={handleChange}>
							<option value='pencil'>Pencil</option>
							<option value='line'>Line</option>
							<option value='rectangle'>Rectangle</option>
							<option value='circle'>Circle</option>
						</select>
					</div>
					<div className={style.lineWidth}>
						<label htmlFor='lineWidth'>Line Width:</label>
						<section>
							<input
								type='number'
								name={'lineWidth'}
								value={toolbox.lineWidth}
								min={1}
								max={100}
								onChange={handleChange}
							/>
							<input
								type='range'
								min={1}
								max={100}
								value={toolbox.lineWidth}
								name='lineWidth'
								onChange={handleChange}
							/>
						</section>
					</div>
					<div className={style.color}>
						<label htmlFor='color'>Color:</label>
						<input
							type='color'
							name='strokeStyle'
							onChange={handleChange}
						/>
					</div>
					<div className={style.fillStyle}>
						<label htmlFor='fillStyle'>Fill Color:</label>
						<input
							type='color'
							name={'fillStyle'}
							onChange={handleChange}
						/>
					</div>
				</section>
				<section className={style.buttons}>
					<button
						type='button'
						className={style.button}
						disabled={elements.length < 1}
						onClick={handleUndo}>
						<IoIosUndo />
						Undo
					</button>
					<button
						type='button'
						className={style.button}
						disabled={history.length < 1}
						onClick={handleRedo}>
						<IoIosRedo />
						Redo
					</button>
					<button
						type='button'
						className={style.button}
						disabled={elements.length < 1}
						onClick={clearCanvas}>
						<GrClearOption />
						Clear Canvas
					</button>
				</section>
			</div>
			<Users
				users={roomUsers}
				curUser={curUser}
			/>
		</div>
	);
};

const Users = ({ users, curUser }) => {
	return (
		<div className={style.userdiv}>
			<h3>Users</h3>
			<ul className={style.users}>
				{users.map((user) => (
					<li key={`${user.userId} ${user.name}`}>
						{user.name}
						{user.userId === curUser.userId ? ' (You)' : ''}
						{user.isGuest ? (
							<span> (Guest) </span>
						) : user.isAdmin ? (
							<span> (Admin) </span>
						) : (
							''
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Toolbox;
