import {
	EUAHeading,
	EUAList,
	EUASection,
	SmallNav,
} from '../../components/global/bodyText';
import { GlobalMain, InlineLink } from '@/components/global/serverComponentUI';

const PrivacyPolicy = () => {
	return (
		<GlobalMain className='max-w-prose mt-16 mb-8 !overflow-auto px-2 outline-white focus-visible:outline flex flex-col gap-8'>
			<header className='flex flex-col gap-4'>
				<h1 className='text-center text-5xl font-black'>
					MixDelta Privacy Policy
				</h1>
				<SmallNav />
			</header>
			<EUASection>
				<EUAHeading level={2}>Introduction</EUAHeading>
				<p>
					Welcome to MixDelta for Spotify! This Privacy Policy outlines the
					information we collect, how we use it, and the choices you have
					concerning your data. By using MixDelta, you agree to the terms of
					this Privacy Policy.
				</p>
			</EUASection>
			<EUASection>
				<EUAHeading level={2}>Information We Collect</EUAHeading>
				<EUAList
					ordered
					listStyle='upper-latin'>
					<li>
						<EUASection>
							<EUAHeading level={3}>
								User Authentication and Authorization
							</EUAHeading>
							<p>
								MixDelta uses Spotify&apos;s OAuth flow for user authentication
								and authorization. We collect and store the following
								information:
							</p>
							<ul className='ml-8 list-[lower\-alpha]'>
								<li>Spotify user ID</li>
								<li>Link to profile picture associated with Spotify user ID</li>
								<li>Access and Refresh Tokens</li>
								<li>Email associated with Spotify ID</li>
							</ul>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>IP Address Usage</EUAHeading>
							<p>
								MixDelta collects and temporarily stores IP addresses for the
								purpose of rate limiting API requests. This is done to ensure
								fair usage and protect against misuse of our services. These IP
								addresses are not associated with users&apos; Spotify
								information in any way.
							</p>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>Playlist Information</EUAHeading>
							<p>
								MixDelta only accesses the following information about the
								User&apos;s Spotify library:
							</p>
							<ul className='ml-8 list-[lower\-alpha]'>
								<li>Playlist names</li>
								<li>Playlist owners</li>
								<li>Playlist size</li>
								<li>Playlist thumbnails</li>
								<li>Track URIs within playlists</li>
							</ul>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>
								User-Specified Playlists and Albums
							</EUAHeading>
							<p>
								For certain functionalities, MixDelta may collect information
								about randomly specified playlists and albums chosen by the
								user.
							</p>
						</EUASection>
					</li>
				</EUAList>
			</EUASection>
			<EUASection>
				<EUAHeading level={2}>How We Use Information</EUAHeading>
				<p>We use the collected information for the following purposes:</p>
				<ul className='ml-8 list-[lower\-alpha]'>
					<li>User authentication and authorization against Spotify</li>
					<li>Displaying playlists from the user&apos;s Spotify library</li>
					<li>
						Creating new playlists and popEUAListating them with tracks as per
						user instructions
					</li>
					<li>Ensuring fair usage and preventing misuse of our services</li>
				</ul>
			</EUASection>
			<EUASection>
				<EUAHeading level={2}>Privacy Practices and Policies</EUAHeading>
				<p>
					We are committed to protecting your privacy, and we want to be
					transparent about our practices. Here are key points:
				</p>
				<EUAList
					ordered
					listStyle='upper-alpha'>
					<li>
						<EUASection>
							<EUAHeading level={3}>Notice</EUAHeading>
							<p>
								Our collection and use of data are subject to this Privacy
								Policy.
							</p>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>Information Disclosure</EUAHeading>
							<p>We disclose information to users regarding:</p>
							<ul className='ml-8 list-[lower\-alpha]'>
								<li>What information we collect</li>
								<li>How we collect, use, and share that information</li>
							</ul>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>Contact Information</EUAHeading>
							<p>
								Users can contact us with inquiries regarding their information
								via either our{' '}
								<InlineLink href='/contact'>contact form</InlineLink> or
								emailing{' '}
								<InlineLink href='mailto:mixdeltatool@gmail.com'>
									mixdeltatool@gmail.com
								</InlineLink>
								.
							</p>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>Use of Cookies</EUAHeading>
							<p>
								We use cookies for user authentication. These cookies are the
								bare minimum for this app&apos;s primary functionality. By using
								MixDelta, you agree to the use of cookies for this purpose.
							</p>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>hCaptcha</EUAHeading>
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
								<InlineLink href='https://www.hcaptcha.com/privacy'>
									https://www.hcaptcha.com/privacy
								</InlineLink>{' '}
								and{' '}
								<InlineLink href='https://www.hcaptcha.com/terms'>
									https://www.hcaptcha.com/terms
								</InlineLink>
							</p>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>Third-Party Cookies</EUAHeading>
							<p>
								Besides any cookie maintained for hCaptcha, we do not allow
								third parties to place cookies on users&apos; browsers for
								collecting information about their browsing activities.
							</p>
						</EUASection>
					</li>
					<li>
						<EUASection>
							<EUAHeading level={3}>Cookie Management</EUAHeading>
							<p>
								Users have options for managing cookies. Please refer to your
								browser settings for cookie management, but understand that
								completely blocking cookies will severely impair the funcitoning
								of this app.
							</p>
						</EUASection>
					</li>
				</EUAList>
			</EUASection>
			<EUASection>
				<EUAHeading level={2}>Changes to this Privacy Policy</EUAHeading>
				<p>
					We may update this Privacy Policy to reflect changes in our practices
					or for other operational, legal, or regEUAListatory reasons. We
					encourage users to review this policy periodically.
				</p>
			</EUASection>
			<EUASection>
				<EUAHeading level={2}>Contact Us</EUAHeading>
				<p>
					If you have any questions or concerns about this Privacy Policy or
					MixDelta, please contact us at either at{' '}
					<InlineLink href='mailto:mixdeltatool@gmail.com'>
						mixdeltatool@gmail.com
					</InlineLink>{' '}
					or via our <InlineLink href='/contact'>contact form</InlineLink>.
				</p>
			</EUASection>
			<p className='w-full'>
				Effective: <time dateTime='2024-01-26'>January 26, 2024</time>
			</p>
			<footer className='w-full'>
				<SmallNav />
			</footer>
		</GlobalMain>
	);
};

export default PrivacyPolicy;

export const metadata = {
	title: 'Privacy Policy',
	description: 'The privacy policy for MixDelta',
};
