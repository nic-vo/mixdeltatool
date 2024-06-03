import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

import look from '@/styles/privacy.module.scss';

const PrivacyPolicy = () => {
	return (
		<>
			<nav className={look.smallnav}>
				<a href='/'>
					<FaAngleDoubleLeft />
					Back home
				</a>
				<a href='/spotify'>
					To the tool <FaAngleDoubleRight />
				</a>
			</nav>
			<main className={look.main}>
				<h1 className={look.h1}>MixDelta Privacy Policy</h1>
				<p>Effective: January 26, 2024</p>
				<section className={look.section}>
					<h2>Introduction</h2>
					<p>
						Welcome to the MixDelta for Spotify! This Privacy Policy outlines
						the information we collect, how we use it, and the choices you have
						concerning your data. By using MixDelta, you agree to the terms of
						this Privacy Policy.
					</p>
				</section>
				<section className={look.section}>
					<h2>Information We Collect</h2>
					<section className={look.section}>
						<h3>User Authentication and Authorization</h3>
						<p>
							MixDelta uses Spotify&apos;s OAuth flow for user authentication
							and authorization. We collect and store the following information:
						</p>
						<ul className={look.list}>
							<li>Spotify user ID</li>
							<li>Link to profile picture associated with Spotify user ID</li>
							<li>Access and Refresh Tokens</li>
							<li>Email associated with Spotify ID</li>
						</ul>
					</section>
					<section>
						<h3>IP Address Usage</h3>
						<p>
							MixDelta collects and temporarily stores IP addresses for the
							purpose of rate limiting API requests. This is done to ensure fair
							usage and protect against misuse of our services. These IP
							addresses are not associated with users&apos; Spotify information
							in any way.
						</p>
					</section>
					<section className={look.section}>
						<h3>Playlist Information</h3>
						<p>
							MixDelta only accesses the following information about the
							User&apos;s Spotify library:
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
							For certain functionalities, MixDelta may collect information
							about randomly specified playlists and albums chosen by the user.
						</p>
					</section>
				</section>
				<section className={look.section}>
					<h2>How We Use Information</h2>
					<p>We use the collected information for the following purposes:</p>
					<ul className={look.list}>
						<li>User authentication and authorization against Spotify</li>
						<li>Displaying playlists from the user&apos;s Spotify library</li>
						<li>
							Creating new playlists and populating them with tracks as per user
							instructions
						</li>
						<li>Ensuring fair usage and preventing misuse of our services</li>
					</ul>
				</section>
				<section className={look.section}>
					<h2>Privacy Practices and Policies</h2>
					<p>
						We are committed to protecting your privacy, and we want to be
						transparent about our practices. Here are key points:
					</p>
					<ol className={look.list}>
						<li>
							<h3>Notice</h3>
							<p>
								Our collection and use of data are subject to this Privacy
								Policy.
							</p>
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
								Users can contact us with inquiries regarding their information
								via either our{' '}
								<a
									href='/contact'
									target='_blank'>
									contact form
								</a>{' '}
								or emailing{' '}
								<a
									href='mailto:mixdeltatool@gmail.com'
									target='_blank'>
									mixdeltatool@gmail.com
								</a>
								.
							</p>
						</li>
						<li>
							<h3>Use of Cookies</h3>
							<p>
								We use cookies for user authentication. These cookies are the
								bare minimum for this app&apos;s primary functionality. By using
								MixDelta, you agree to the use of cookies for this purpose.
							</p>
						</li>
						<li>
							<h3>hCaptcha</h3>
							<p>
								We use the hCaptcha security service (hereinafter
								&quot;hCaptcha&quot;) on our website. This service is provided
								by Intuition Machines, Inc., a Delaware US Corporation
								(&quot;IMI&quot;). hCaptcha is used to check whether user
								actions on our online service (such as submitting a login or
								contact form) meet our security requirements. To do this,
								hCaptcha analyzes the behavior of the website or mobile app
								visitor based on various characteristics. This analysis starts
								automatically as soon as the website or mobile app visitor
								enters a part of the website or app with hCaptcha enabled. For
								the analysis, hCaptcha evaluates various information (e.g. IP
								address, how long the visitor has been on the website or app, or
								mouse movements made by the user). The data collected during the
								analysis will be forwarded to IMI. hCaptcha analysis in the
								&quot;invisible mode&quot; may take place completely in the
								background. Website or app visitors are not advised that such an
								analysis is taking place if the user is not shown a challenge.
								Data processing is based on Art. 6(1)(b) of the GDPR: the
								processing of personal data is necessary for the performance of
								a contract to which the website visitor is party (for example,
								the website terms) or in order to take steps at the request of
								the website visitor prior to entering into a contract. Our
								online service (including our website, mobile apps, and any
								other apps or other forms of access offered by us) needs to
								ensure that it is interacting with a human, not a bot, and that
								activities performed by the user are not related to fraud or
								abuse. In addition, processing may also be based on Art. 6(1)(f)
								of the GDPR: our online service has a legitimate interest in
								protecting the service from abusive automated crawling, spam,
								and other forms of abuse that can harm our service or other
								users of our service. IMI acts as a &quot;data processor&quot;
								acting on behalf of its customers as defined under the GDPR, and
								a &quot;service provider&quot; for the purposes of the
								California Consumer Privacy Act (CCPA). For more information
								about hCaptcha&apos;s privacy policy and terms of use, please
								visit the following links:{' '}
								<a
									href='https://www.hcaptcha.com/privacy'
									target='_blank'>
									https://www.hcaptcha.com/privacy
								</a>{' '}
								and{' '}
								<a
									href='https://www.hcaptcha.com/terms'
									target='_blank'>
									https://www.hcaptcha.com/terms
								</a>
							</p>
						</li>
						<li>
							<h3>Third-Party Cookies</h3>
							<p>
								Besides any cookie maintained for hCaptcha, we do not allow
								third parties to place cookies on users&apos; browsers for
								collecting information about their browsing activities.
							</p>
						</li>
						<li>
							<h3>Cookie Management</h3>
							<p>
								Users have options for managing cookies. Please refer to your
								browser settings for cookie management, but understand that
								completely blocking cookies will severely impair the funcitoning
								of this app.
							</p>
						</li>
					</ol>
				</section>
				<section className={look.section}>
					<h2>Changes to this Privacy Policy</h2>
					<p>
						We may update this Privacy Policy to reflect changes in our
						practices or for other operational, legal, or regulatory reasons. We
						encourage users to review this policy periodically.
					</p>
				</section>
				<section className={look.section}>
					<h2>Contact Us</h2>
					<p>
						If you have any questions or concerns about this Privacy Policy or
						MixDelta, please contact us at either at{' '}
						<a
							href='mailto:mixdeltatool@gmail.com'
							target='_blank'>
							mixdeltatool@gmail.com
						</a>{' '}
						or via our{' '}
						<a
							href='/contact'
							target='_blank'>
							contact form
						</a>
						.
					</p>
				</section>
				<p>Thank you for using MixDelta!</p>
			</main>
			<nav className={look.smallnav}>
				<a href='/'>
					<FaAngleDoubleLeft />
					Back home
				</a>
				<a href='/spotify'>
					To the tool <FaAngleDoubleRight />
				</a>
			</nav>
		</>
	);
};

export default PrivacyPolicy;
