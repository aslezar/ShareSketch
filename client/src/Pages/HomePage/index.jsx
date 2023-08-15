import React from 'react';
//Style
// import Style from './home.module.css';
import Style from './home.module.sass';
//Components
import Sign from '../../components/Sign';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import JoinRoom from '../../components/JoinRoom';
//Images
import image from '../../../public/ShareSketch3.png';
//Icons
import { useGlobalContext } from '../../context';
import { MdEmojiEmotions } from 'react-icons/md';
import { AiOutlineUserAdd } from 'react-icons/ai';

const features = [
	{
		title: '🎨 Collaborative Whiteboard',
		description: 'Real-time shared sketching and brainstorming.',
	},
	{
		title: '💬 Group Chat',
		description: 'Organized, productive group conversations.',
	},
	{
		title: '🚀 Effortless Sharing',
		description: 'Seamless sharing of creations and discussions.',
	},
	{
		title: '🌐 Global Collaboration',
		description: 'Connect worldwide, breaking barriers.',
	},
	{
		title: '🔒 Secure and Private',
		description: 'Advanced encryption for data privacy.',
	},
];
//points
const points = [
	'🎨 Create canvas with drawing tools: rectangles, lines, circles, pencils.',
	'🤝 Collaborate remotely via Socket.io: draw, chat, share ideas.',
	'💬 Real-time group chat for instant interaction.',
	'↩️ Undo-redo for correcting drawing mistakes.',
	'🖼️ Profile image upload for personal touch.',
	'✏️ User data editing for easy updates.',
	'🌓 Toggle between dark and light modes.',
	'👥 See list of active users in the room.',
	'👤 Allow guest users to participate.',
];

const Homepage = () => {
	const [signup, setSignup] = React.useState(false);

	const { isSignedIn, name, bio, profileImage } = useGlobalContext();
	return (
		<>
			{signup && (
				<Sign
					closeSign={() => setSignup(false)}
					page='signup'
				/>
			)}
			<div className={Style.homepage}>
				<div className={Style.container}>
					<div className={Style.about}>
						<header className={Style.header}>
							<div className={Style.headerContent}>
								<h1>
									Welcome to <b>ShareSketch</b>
								</h1>
								<p>
									<i>
										An online whiteboard for you and your friends to draw
										together
									</i>
								</p>
								<p>
									Introducing ShareSketch: your hub for collaborative drawing
									and brainstorming. Harness artistic potential with our
									versatile canvas and drawing tools. Connect in real time via
									Socket.io for seamless collaboration. Engage in lively
									discussions with integrated group chat. Experience boundless
									creativity with dark and light modes.
								</p>
							</div>
						</header>
						<section className={Style.features}>
							{features.map((feature, index) => (
								<div
									className={Style.feature}
									key={index}>
									<h2>{feature.title}</h2>
									<p>{feature.description}</p>
								</div>
							))}
						</section>
					</div>

					<section className={Style.cta}>
						<span className={Style.text}>
							<h2>Ready to Revolutionize Collaboration?</h2>
							{isSignedIn ? (
								<p>
									Join a room now and start collaborating with your friends.
								</p>
							) : (
								<p>
									SignUp for ShareSketch now and unlock the power of
									collaborative whiteboarding and efficient group chatting.
								</p>
							)}
						</span>
						{!isSignedIn && (
							<div onClick={() => setSignup(true)}>
								<Button>
									<AiOutlineUserAdd />
									Sign Up
								</Button>
							</div>
						)}
					</section>
				</div>
				{isSignedIn ? (
					<div className={Style.user}>
						<img
							src={profileImage ? profileImage : image}
							alt='profile'
							className={Style.profileImage}
						/>
						<span>
							<h2>
								<i>Hi, </i>
								{name}
							</h2>
							<p>{bio}</p>
						</span>
						{/* <h2>user name</h2>
						<p>user bio and image</p> */}
					</div>
				) : (
					<div className={Style.demo}>
						<h2>Demo</h2>
						<p>
							Sign in to join a room or create a new room. You can also join a
							room as a guest.
						</p>
						<Button>
							<MdEmojiEmotions />
							Join Demo Room
						</Button>
					</div>
				)}

				<div className={Style.joinroom}>
					<JoinRoom />
				</div>
				<div className={Style.imageDiv}>
					{/* <img
						src={image}
						alt='sharesketch'
						style={{
							maxWidth: '100%',
							height: 'auto',
							maxHeight: '100%',
						}}
						className={image}
					/> */}
					<ul className={Style.points}>
						{points.map((point, index) => (
							<li
								key={index}
								className={Style.point}>
								{point}
							</li>
						))}
					</ul>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Homepage;
