import React, { useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { useGlobalContext } from '../../context';

const Chat = ({ isConnected, messages, sendMessage }) => {
	console.log('chat');

	const [message, setMessage] = useState('');

	const messageRef = useRef(null);

	const { isSignedIn, userId } = useGlobalContext();

	const handleSubmit = (e) => {
		e.preventDefault();
		// console.log(message);
		if (message) {
			sendMessage(message);
			setMessage('');
		}
	};
	useEffect(() => {
		if (messageRef.current) {
			messageRef.current.scrollTop = messageRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className={style.chat}>
			<ul
				className={style.messages}
				ref={messageRef}>
				{messages.map((msg, index) => (
					<li
						key={index}
						className={
							msg.userId === userId ? style.userMessage : style.otherMessage
						}>
						{msg.userId !== userId && (
							<i>{msg.userName.split(' ')[0] + ': '}</i>
						)}
						{msg.message}
					</li>
				))}
			</ul>
			<form
				className={style.form}
				onSubmit={handleSubmit}>
				<input
					className={style.input}
					placeholder={isSignedIn ? 'Type your message' : 'Sign in to chat'}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					autoComplete='off'
					disabled={!isConnected || !isSignedIn}
				/>
				<button
					className={style.btn}
					disabled={!isConnected || !isSignedIn}
					type='submit'>
					Send
				</button>
			</form>
		</div>
	);
};

export default Chat;
