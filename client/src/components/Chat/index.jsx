import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Style from './chat.module.css';
import { useGlobalContext } from '../../context';

const Chat = ({ socket, isConnected }) => {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);

	const messageRef = useRef(null);

	const roomId = useGlobalContext().getRoomId();
	const user = useGlobalContext().getUserId();

	useEffect(() => {
		const onMessage = (msg) => {
			// Update the messages state with the new message
			setMessages((prevMessages) => [...prevMessages, msg]);
		};

		socket.on('chat:message', onMessage);

		return () => {
			socket.off('chat:message', onMessage);
		};
	}, [socket]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (message) {
			setMessages((prevMessages) => [...prevMessages, { user, message }]);
			// Emit the message to the server
			socket.emit('chat:message', { roomId, message, user });
			// Clear the input field
			setMessage('');
		}
	};
	useEffect(() => {
		if (messageRef.current) {
			messageRef.current.scrollTop = messageRef.current.scrollHeight;
		}
	});

	return (
		<div className={Style.chat}>
			<ul
				className={Style.messages}
				ref={messageRef}>
				{messages.map((msg, index) => (
					<li key={index}>
						{msg.user === user ? 'You:' : msg.user + ':'}
						{msg.message}
					</li>
				))}
			</ul>
			<form
				className={Style.form}
				onSubmit={handleSubmit}>
				<input
					className={Style.input}
					placeholder='Type your message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					autoComplete='off'
				/>
				<button
					className={Style.btn}
					disabled={!isConnected}
					type='submit'>
					Send
				</button>
			</form>
		</div>
	);
};

export default Chat;
