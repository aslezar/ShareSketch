import style from './style.module.scss';
import { IoIosUndo, IoIosRedo } from 'react-icons/io';
import { GrClearOption } from 'react-icons/gr';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineClear } from 'react-icons/ai';
import {
	FaShareAlt,
	FaPencilAlt,
	FaSlash,
	FaRegSquare,
	FaRegCircle,
} from 'react-icons/fa';
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
	curUser,
}) => {
	// console.log('toolbox');
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
		<>
			<AiOutlineClear
				className={style.toolicon}
				onClick={() => {
					document.getElementById('tool').classList.toggle(style.show);
					document.getElementById('wrapper').classList.toggle(style.show);
				}}
			/>
			<FaUserCircle
				className={style.usericon}
				onClick={() => {
					document.getElementById('user').classList.toggle(style.show);
					document.getElementById('wrapper').classList.toggle(style.show);
				}}
			/>
			<div
				id='wrapper'
				className={style.wrapper}>
				<div
					id='tool'
					className={style.container}>
					<div className={style.heading}>
						<button
							className={`${style.button} ${
								isConnected ? style.connected : style.disconnected
							}`}
							onClick={toogleConnection}>
							{isConnected ? 'Connected' : 'Disconnected'}
						</button>
						<span className={style.roomName}>
							<p>Room: </p>
							{roomName ? <b>{roomName}</b> : 'Unknown'}
						</span>
						<span className={style.roomName}>
							<p>Name: </p>
							<p>{curUser.name ? <b>{curUser.name}</b> : 'Unknown'}</p>
						</span>
						<div className={style.share}>
							<button
								className={style.button}
								onClick={handleCopy}>
								<MdContentCopy className={style.icon} /> Copy RoomID
							</button>
							<button
								className={style.button}
								onClick={handleShare}>
								<FaShareAlt className={style.icon} />
								Share Link
							</button>
						</div>
					</div>
					<div className={style.toolbox}>
						<section className={style.tools}>
							<div className={style.tool}>
								<label htmlFor='tool'>Tools: </label>
								<button
									className={`${style.button} ${
										toolbox.tool === 'pencil' ? style.active : ''
									}`}
									name='tool'
									value='pencil'
									onClick={handleChange}>
									<FaPencilAlt />
								</button>
								<button
									className={`${style.button} ${
										toolbox.tool === 'line' ? style.active : ''
									}`}
									name='tool'
									value='line'
									onClick={handleChange}>
									<FaSlash />
								</button>
								<button
									className={`${style.button} ${
										toolbox.tool === 'rectangle' ? style.active : ''
									}`}
									name='tool'
									value='rectangle'
									onClick={handleChange}>
									<FaRegSquare />
								</button>
								<button
									className={`${style.button} ${
										toolbox.tool === 'circle' ? style.active : ''
									}`}
									name='tool'
									value='circle'
									onClick={handleChange}>
									<FaRegCircle />
								</button>
							</div>
							<div className={style.lineWidth}>
								<label htmlFor='lineWidth'>LineWidth:</label>
								<input
									type='number'
									name={'lineWidth'}
									value={toolbox.lineWidth}
									min={1}
									max={100}
									onChange={handleChange}
								/>
							</div>
							<div className={style.color}>
								<label htmlFor='color'>Color:</label>
								<input
									type='color'
									name='strokeStyle'
									onChange={handleChange}
								/>
							</div>
							<div className={style.color}>
								<label htmlFor='fillStyle'>Fill Color:</label>
								<input
									type='color'
									name={'fillStyle'}
									onChange={handleChange}
								/>
							</div>
						</section>
						<section className={style.buttonsSection}>
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
				</div>
				<Users
					users={roomUsers}
					curUser={curUser}
				/>
			</div>
		</>
	);
};

const Users = ({ users, curUser }) => {
	return (
		<>
			<div
				id='user'
				className={style.userdiv}>
				<h3>Users</h3>
				<ul className={style.users}>
					{users.map((user) => (
						<li
							key={user.userId}
							className={user.isOnline ? style.green : style.red}>
							<p>
								{user.name}
								{user.userId === curUser.userId ? ' (You)' : ''}
							</p>
							<p>
								{user.isGuest ? (
									<span> (Guest) </span>
								) : user.isAdmin ? (
									<span> (Admin) </span>
								) : (
									''
								)}
							</p>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default Toolbox;
