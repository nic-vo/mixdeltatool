import Head from 'next/head';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

import local from '@/styles/privacy.module.scss';
import pre from '@/components/legal/SpotEUA/SpotEUA.module.scss';

const terms = () => {
	return (
		<>
			<Head>
				<title>Terms and Conditions | MixDelta</title>
				<meta
					name='description'
					content='The terms and conditions for MixDelta'
				/>
			</Head>

			<nav className={local.smallnav}>
				<a href='/'>
					<FaAngleDoubleLeft />
					Back home
				</a>
				<a href='/spotify'>
					To the tool <FaAngleDoubleRight />
				</a>
			</nav>
			<main className={local.main}>
				<h1 className={local.h1}>MixDelta End User Agreement</h1>
				<p>Effective: January 26, 2024</p>
				<p>
					This End User Agreement (&quot;Agreement&quot;) is entered into
					between you (&quot;User&quot; or &quot;you&quot;) and the developer
					(&quot;Developer&quot;) of the web app &quot;MixDelta&quot;
					(&quot;Application&quot; or &quot;App&quot;). This Agreement governs
					your use of the App and any related services provided by the
					Developer.
				</p>
				<ol className={pre.list}>
					<li>
						<h3>Acceptance of Terms</h3>
						<p>
							By using the App, you agree to be bound by the terms and
							conditions set forth in this Agreement. If you do not agree to
							these terms, please refrain from using the App.
						</p>
					</li>
					<li>
						<h3>Description of Service</h3>
						<p>
							The App is a web app that utilizes Spotify&apos;s Web API to
							provide the User with a quick way to apply non-destructive, bulk
							actions to existing Spotify playlists.
						</p>
					</li>
					<li>
						<h3>Spotify Integration</h3>
						<ol className={pre.secondList}>
							<li>
								The Developer does not make any warranties or representations on
								behalf of Spotify and expressly disclaims all implied warranties
								with respect to the Spotify Platform, Spotify Service, and
								Spotify Content, including the implied warranties of
								merchantability, fitness for a particular purpose, and
								non-infringement.
							</li>
							<li>
								The User is prohibited from modifying or creating derivative
								works based on the Spotify Platform, Spotify Service, or Spotify
								Content.
							</li>
							<li>
								The User is prohibited from decompiling, reverse-engineering,
								disassembling, and otherwise reducing the Spotify Platform,
								Spotify Service, and Spotify Content to source code or other
								human-perceivable form, to the full extent allowed by law.
							</li>
						</ol>
					</li>
					<li>
						<h3>User Responsibilities</h3>
						<p>The User is responsible for:</p>
						<ol className={pre.secondList}>
							<li>
								<h4>Compliance with Laws</h4>
								<p>
									The User is expected to use the App in compliance with all
									applicable laws and regulations.
								</p>
							</li>
							<li>
								<h4>Account Security</h4>
								<p>
									The User is responsible for maintaining the security of their
									account credentials and ensuring that unauthorized individuals
									do not access their accounts.
								</p>
							</li>
							<li>
								<h4>Lawful Use</h4>
								<p>
									The User agrees to use the App for lawful purposes only and
									shall not engage in any activity that violates pre, national,
									or international laws.
								</p>
							</li>
							<li>
								<h4>Prohibited Conduct</h4>
								<p>
									The User is prohibited from engaging in any conduct that may
									harm, interfere with, or disrupt the functionality of the App,
									including but not limited to unauthorized access, distribution
									of malicious code, or attempts to compromise the security of
									the App.
								</p>
							</li>
							<li>
								<h4>Lawful Content</h4>
								<p>
									If the App allows the User to generate content, the User is
									responsible for ensuring that any content they upload or
									create complies with applicable laws and does not infringe on
									the rights of others.
								</p>
							</li>
							<li>
								<h4>Termination of Use</h4>
								<p>
									The User acknowledges that the Developer reserves the right to
									terminate their access to the App if they fail to comply with
									these user responsibilities.
								</p>
							</li>
						</ol>
					</li>
					<li>
						<h3>Developer&apos;s Liability</h3>
						<p>
							The Developer is solely responsible for its products, and this
							Agreement disclaims any liability on the part of third parties
							(e.g., Spotify).
						</p>
					</li>
					<li>
						<h3>Termination</h3>
						<p>
							The Developer reserves the right to terminate this Agreement and
							your access to the App for any reason.
						</p>
					</li>
					<li>
						<h3>Disclaimers</h3>
						<ol className={pre.secondList}>
							<li>
								The Application is provided &quot;as is&quot; without
								warranties.
							</li>
							<li>
								<p>The Developer disclaims any liability for:</p>
								<ol className={pre.thirdList}>
									<li>
										<h4>Loss of Data</h4>
										<p>
											The Developer shall not be held liable for any loss of the
											User&apos; data or any damages resulting from the loss of
											data.
										</p>
									</li>
									<li>
										<h4>Consequential Damages</h4>
										<p>
											In no event shall the Developer be liable for any
											consequential, incidental, indirect, special, or punitive
											damages, including, but not limited to, lost profits or
											business interruption, arising out of or in connection
											with the use of the App.
										</p>
									</li>
									<li>
										<h4>Third-Party Actions</h4>
										<p>
											The Developer is not responsible for any actions or
											omissions of third parties, including but not limited to
											service providers, partners, or other users of the App.
										</p>
									</li>
									<li>
										<h4>Interruptions or Downtime</h4>
										<p>
											The Developer does not guarantee continuous,
											uninterrupted, or secure access to the App and shall not
											be liable for any interruptions or downtime of the App.
										</p>
									</li>
									<li>
										<h4>Unauthorized Access</h4>
										<p>
											The Developer is not responsible for any unauthorized
											access to user accounts or any unauthorized use of
											personal information, and users are encouraged to take
											appropriate measures to safeguard their accounts.
										</p>
									</li>
									<li>
										<h4>Modification of Content</h4>
										<p>
											The User acknowledges that the Developer reserves the
											right to modify, suspend, or discontinue MixDelta, and
											shall not be liable for any modification, suspension, or
											discontinuation of the App.
										</p>
									</li>
									<li>
										<h4>Technical Issues</h4>
										<p>
											The Developer is not liable for any technical issues,
											including but not limited to bugs, glitches, or
											compatibility issues, and makes no warranties regarding
											the performance or reliability of the App.
										</p>
									</li>
								</ol>
							</li>
						</ol>
					</li>
					<li>
						<h3>Limitation of Liability</h3>
						<p>
							The Developer&pos;s liability is limited to the maximum extent
							permitted by applicable law.
						</p>
					</li>
					<li>
						<h3>Indemnification</h3>
						<p>
							The User agrees to indemnify and hold the Developer harmless from
							and against any and all claims, liabilities, damages, losses,
							costs, expenses, or fees (including reasonable attorneys&apos;
							fees) arising out of or in connection with:
						</p>
						<ol className={pre.secondList}>
							<li>
								<h4>User Violations</h4>
								<p>
									Any violation by the user of this Agreement or any applicable
									laws or regulations.
								</p>
							</li>
							<li>
								<h4>Unauthorized Access</h4>
								<p>
									Any unauthorized access to or use of the App by the user or
									any third party using the User&apos;s account.
								</p>
							</li>
							<li>
								<h4>Third-Party Claims</h4>
								<p>
									Any claims or actions brought against the Developer by third
									parties arising out of or related to the User&apos;s use of
									the App.
								</p>
							</li>
							<li>
								<h4>Breach of Agreement</h4>
								<p>Any breach of this Agreement by the User.</p>
							</li>
							<li>
								<h4>Misuse of MixDelta</h4>
								<p>
									Any misuse or abuse of the App by the User that results in
									harm, damages, or legal consequences.
								</p>
							</li>
							<li>
								<h4>Violation of Rights</h4>
								<p>
									Any violation of the rights of third parties by the User in
									connection with the use of the App.
								</p>
							</li>
						</ol>
					</li>
					<li>
						<h3>Amendments</h3>
						<p>
							The Developer reserves the right to update this Agreement, with
							users being informed of changes.
						</p>
					</li>
					<li>
						<h3>Contact Information</h3>
						<p>
							For support or inquiries, please email us at{' '}
							<a
								href='mailto:mixdeltatool@gmail.com'
								target='_blank'>
								mixdeltatool@gmail.com
							</a>{' '}
							or message us via{' '}
							<a
								href='/contact'
								target='_blank'>
								our contact form.
							</a>
						</p>
					</li>
					<li>
						<h3>Spotify as a Third-Party Beneficiary</h3>
						<p>
							Spotify is a third-party beneficiary of this Agreement and is
							entitled to directly enforce this Agreement.
						</p>
					</li>
				</ol>
			</main>
			<nav className={pre.smallnav}>
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

export default terms;
