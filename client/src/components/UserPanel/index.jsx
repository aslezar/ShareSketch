import React, { useEffect, useState, useRef } from 'react';
import { useGlobalContext } from '../../context';
import { FaEdit, FaRegUser } from 'react-icons/fa';
import styles from './userpanel.module.css'; // Import styles from the module CSS file
import { toast } from 'react-toastify';
import * as api from '../../api/index.js';
const UserPanel = () => {
	return (
		<div className={styles['panel']}>
			<UserProfile />
			<Bio />
		</div>
	);
};
const UserProfile = () => {
	const [inputName, setInputName] = useState('');
	const [hoveringName, setHoveringName] = useState(false);
	const [editingName, setEditingName] = useState(false);

	const [hoveringImage, setHoveringImage] = useState(false);

	const { name, email, profileImage, updateUser } = useGlobalContext();

	useEffect(() => {
		setInputName(name);
	}, [name]);

	const handleNameEditClick = () => {
		setEditingName(true);
	};

	const handleNameInputChange = (event) => {
		setInputName(event.target.value);
	};
	const handleNameSaveClick = async () => {
		setEditingName(false);
		if (inputName.length < 3) {
			toast.error('Name must be at least 3 characters');
			return;
		}
		if (inputName.length > 20) {
			toast.error('Name cannot be more than 20 characters');
			return;
		}
		if (inputName === name) return;
		api.handler(
			api.updateName,
			(data) => {
				updateUser({ name: data.name });
			},
			inputName
		);
	};

	return (
		<div className={styles['profile']}>
			<div
				className={styles['user-image-container']}
				onMouseEnter={() => setHoveringImage(true)}
				onMouseLeave={() => setHoveringImage(false)}>
				<img
					className={`${styles['user-image']} ${
						hoveringImage ? styles['hovered'] : ''
					}`}
					src={profileImage}
					alt={name}
				/>
				{hoveringImage && <ProfileImageUpload />}
			</div>
			<div className={styles['user-details']}>
				{editingName ? (
					<input
						type='text'
						value={inputName}
						onChange={handleNameInputChange}
						onBlur={handleNameSaveClick}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								handleNameSaveClick();
							}
						}}
						className={styles['edit-input']}
					/>
				) : (
					<div
						className={`${styles['user-name']} ${
							hoveringName ? styles['hovered'] : ''
						}`}
						onMouseEnter={() => setHoveringName(true)}
						onMouseLeave={() => setHoveringName(false)}>
						{name}
						{hoveringName && (
							<div
								className={styles['edit-icon']}
								onClick={handleNameEditClick}>
								<FaEdit />
							</div>
						)}
					</div>
				)}
				<div className={styles['user-email']}>{email}</div>
			</div>
		</div>
	);
};

const Bio = () => {
	const [inputBio, setInputBio] = useState('');
	const [focused, setFocused] = useState(false);

	const { bio, updateUser } = useGlobalContext();

	useEffect(() => {
		setInputBio(bio);
	}, [bio]);

	const handleBioChange = (event) => {
		setInputBio(event.target.value);
	};

	const handleFocus = () => {
		setFocused(true);
	};

	const handleBlur = async () => {
		setFocused(false);
		if (inputBio === bio) return;
		if (!inputBio) {
			toast.error('Bio cannot be empty');
			return;
		}
		if (inputBio.length > 150) {
			toast.error('Bio cannot be more than 150 characters');
			return;
		}
		if (inputBio.length > 0) {
			api.handler(
				api.updateBio,
				(data) => {
					updateUser({ bio: data.bio });
				},
				inputBio
			);
		}
	};

	return (
		<textarea
			value={inputBio}
			onChange={handleBioChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onKeyDown={(event) => {
				if (event.key === 'Enter' && event.shiftKey === false && focused) {
					event.preventDefault();
					event.target.blur();
				}
			}}
			className={`${styles.bio} ${focused ? '' : styles.italic}`}
			placeholder='Write something about yourself'
			rows={4}
		/>
	);
};
function ProfileImageUpload() {
	const fileInputRef = useRef(null);

	const { updateUser } = useGlobalContext();

	const handleFileClick = () => {
		fileInputRef.current.click();
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;
		if (file.size > 1024 * 1024) {
			toast.error('Image size cannot exceed 1MB');
			return;
		}
		if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
			toast.error('Image must be of type jpeg or png');
			return;
		}
		api.handler(
			api.updateImage,
			(data) => {
				// updateUser({ profileImage: data.profileImage });
				toast.success(data.msg);
				setTimeout(() => {
					window.location.reload();
				}, 3000);
			},
			file
		);
	};

	return (
		<div
			className={styles['edit-icon']}
			onClick={handleFileClick}>
			<FaEdit />
			<input
				type='file'
				accept='image/*'
				name='profileImage'
				ref={fileInputRef}
				onChange={handleFileUpload}
				style={{ display: 'none' }}
			/>
		</div>
	);
}
export default UserPanel;
