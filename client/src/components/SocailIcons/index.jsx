import Style from './socialIcons.module.css';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import data from '../../data';
function SocailIcons() {
	const socials = data.socials;
	return (
		<ul className={Style.socialIcons}>
			{socials.twitter && (
				<li>
					<a href={socials.twitter}>
						<FaTwitter />
					</a>
				</li>
			)}
			{socials.facebook && (
				<li>
					<a href={socials.facebook}>
						<FaFacebook />
					</a>
				</li>
			)}
			{socials.instagram && (
				<li>
					<a href={socials.instagram}>
						<FaInstagram />
					</a>
				</li>
			)}
			{socials.linkedin && (
				<li>
					<a href={socials.linkedin}>
						<FaLinkedin />
					</a>
				</li>
			)}
		</ul>
	);
}
export default SocailIcons;
