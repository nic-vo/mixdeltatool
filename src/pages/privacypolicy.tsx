import look from '@styles/privacy.module.scss';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const LAST_UPDATED = new Date();

const PrivacyPolicy = () => {
	return (
		<main className={look.main}>
			<h1 className={look.h1}>Superuser Actions Privacy Policy</h1>
			<p>Last updated: {LAST_UPDATED.toDateString()}</p>
			<section className={look.section}>
				<h2>Introduction</h2>
				<p>
					Welcome to Superuser Actions! This Privacy Policy outlines the information we collect, how we use it, and the choices you have concerning your data. By using Superuser Actions, you agree to the terms of this Privacy Policy.
				</p>
			</section>
			<section className={look.section}>
				<h2>Information We Collect</h2>
				<section className={look.section}>
					<h3>User Authentication and Authorization</h3>
					<p>
						Superuser Actions uses Spotify's OAuth for user authentication and authorization. We collect and store the following information:
					</p>
					<ul className={look.list}>
						<li>Spotify user ID</li>
						<li>Link to profile picture associated with Spotify user ID</li>
						<li>Access and Refresh Tokens</li>
						<li>Email associated with Spotify ID</li>
					</ul>
				</section>
				<section className={look.section}>
					<h3>Playlist Information</h3>
					<p>
						Superuser Actions only accesses the following information about the user's Spotify library:
					</p>
					<ul className={look.list}>
						<li>Playlist names</li>
						<li>Playlist owners</li>
						<li>Playlist size</li>
						<li>Playlist thumbnails</li>
						<li>Track URIs within playlists</li>
					</ul>
				</section>
				<section className={look.section}>
					<h3>User-Specified Playlists and Albums</h3>
					<p>
						For certain functionalities, Superuser Actions may collect information about randomly specified playlists and albums chosen by the user.
					</p>
				</section>
			</section>
			<section className={look.section}>
				<h2>How We Use Information</h2>
				<p>We use the collected information for the following purposes:</p>
				<ul className={look.list}>
					<li>User authentication and authorization against Spotify</li>
					<li>Displaying playlists from the user's Spotify library</li>
					<li>Creating new playlists and populating them with tracks as per user instructions</li>
				</ul>
			</section>
			<section className={look.section}>
				<h2>Privacy Practices and Policies</h2>
				<p>
					We are committed to protecting your privacy, and we want to be transparent about our practices. Here are key points:
				</p>
				<ol className={look.list}>
					<li>
						<h3>Notice</h3>
						<p>Our collection and use of data are subject to this Privacy Policy.</p>
					</li>
					<li>
						<h3>Information Disclosure</h3>
						<p>We disclose information to users regarding:</p>
						<ul className={look.list}>
							<li>What information we collect</li>
							<li>How we collect, use, and share that information</li>
						</ul>
					</li>
					<li>
						<h3>Contact Information</h3>
						<p>
							Users can contact us with inquiries regarding their information at [Your Contact Email].
						</p>
					</li>
					<li>
						<h3>Use of Cookies</h3>
						<p>
							We use cookies exclusively for managing user authentication. These cookies are the bare minimum for functionality on this app. By using Superuser Actions, you agree to the use of cookies for this purpose.
						</p>
					</li>
					<li>
						<h3>Third-Party Cookies</h3>
						<p>
							We do not allow third parties to place cookies on users' browsers for collecting information about their browsing activities.
						</p>
					</li>
					<li>
						<h3>Cookie Management</h3>
						<p>
							Users have options for managing cookies. Please refer to your browser settings for cookie management, but understand that completely blocking cookies for this app will severely affect the functionality of it.
						</p>
					</li>
				</ol>
			</section>
			<section className={look.section}>
				<h2>Changes to this Privacy Policy</h2>
				<p>
					We may update this Privacy Policy to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage users to review this policy periodically.
				</p>
			</section>
			{/*
					TODO HERE
						|	|	|
						V	V	V
			*/}
			<section className={look.section}>
				<h2>Contact Us</h2>
				<p>If you have any questions or concerns about this Privacy Policy or Superuser Actions, please contact us at [Your Contact Email].</p>
			</section>
			<p>Thank you for using Superuser Actions!</p>
			<div className={look.smallnav}>
				<a href='/'><FaAngleDoubleLeft  />Back home...</a>
				<a href='/spotify'>TO THE TOOL! <FaAngleDoubleRight /></a>
			</div>
		</main>
	);
}

export default PrivacyPolicy;
