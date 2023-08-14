import React, { useEffect, useState, useRef } from 'react';
import Style from './chat.module.css';
import { useGlobalContext } from '../../context';

const Chat = ({ isConnected, messages, sendMessage }) => {
	const [message, setMessage] = useState('');

	const messageRef = useRef(null);

	const { isSignedIn, userId } = useGlobalContext();

	const handleSubmit = (e) => {
		e.preventDefault();
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
		<div className={Style.chat}>
			<ul
				className={Style.messages}
				ref={messageRef}>
				{messages.map((msg, index) => (
					<li
						key={index}
						className={
							msg.userId === userId ? Style.userMessage : Style.otherMessage
						}>
						{msg.userId !== userId && (
							<i>{msg.userName.split(' ')[0] + ': '}</i>
						)}
						{msg.message}
					</li>
				))}
			</ul>
			<form
				className={Style.form}
				onSubmit={handleSubmit}>
				<input
					className={Style.input}
					placeholder={isSignedIn ? 'Type your message' : 'Sign in to chat'}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					autoComplete='off'
					disabled={!isConnected || !isSignedIn}
				/>
				<button
					className={Style.btn}
					disabled={!isConnected || !isSignedIn}
					type='submit'>
					Send
				</button>
			</form>
		</div>
	);
};

export default Chat;
