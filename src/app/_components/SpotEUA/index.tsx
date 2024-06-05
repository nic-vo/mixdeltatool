'use client';

import { FormEventHandler, useEffect, useState, useRef } from 'react';
import { EUALIContainer, EUAList } from './server';

import global from '@/styles/globals.module.scss';

const LOCAL_EXPIRY_KEY = 'SUPERUSER_EUA';
const LOCAL_EXPIRY_LENGTH = 1000 * 60 * 60 * 24 * 7;
// const LOCAL_EXPIRY_LENGTH = 1000 * 5;

const SpotEUA = (props: { submitter?: () => void }) => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [accepted, setAccepted] = useState<boolean | null>(null);

	useEffect(() => {
		try {
			const local = localStorage.getItem(LOCAL_EXPIRY_KEY);
			if (local === null) throw null;
			const expiry = parseInt(local) * 1000;
			if (expiry === undefined || Date.now() > expiry) throw null;
			if (props.submitter) props.submitter();
			setAccepted(true);
		} catch {
			setAccepted(false);
		}
	}, []);

	useEffect(() => {
		if (accepted === true) return;
		if (dialogRef.current !== null) dialogRef.current.showModal();
	}, [accepted]);

	const formSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		localStorage.setItem(
			LOCAL_EXPIRY_KEY,
			Math.floor((Date.now() + LOCAL_EXPIRY_LENGTH) / 1000).toString()
		);
		if (props.submitter) props.submitter();
		dialogRef.current!.close();
		setAccepted(true);
		return null;
	};

	if (accepted) return null;
	return (
		<dialog
			ref={dialogRef}
			className='bg-black w-11/12 h-[90dvh] max-w-screen-lg max-h-[1024px] m-auto overflow-hidden border-0 rounded-xl backdrop-blur-sm backdrop-brightness-50'>
			<form
				onSubmit={formSubmit}
				className='flex flex-col gap-8 p-4 w-full h-full m-auto overflow-hidden'>
				<h2 className='text-center'>MixDelta End User Agreement</h2>
				<div className='flex flex-col gap p-4 md:p-8 overflow-y-auto bg-transparent backdrop-brightness-150 rounded-xl'>
					<p>Effective: January 26, 2024</p>
					<p>
						This End User Agreement (&quot;Agreement&quot;) is entered into
						between you (&quot;User&quot; or &quot;you&quot;) and the developer
						(&quot;Developer&quot;) of the web app &quot;MixDelta&quot;
						(&quot;Application&quot; or &quot;App&quot;). This Agreement governs
						your use of the App and any related services provided by the
						Developer.
					</p>
					<EUAList ordered>
						<EUALIContainer>
							<h3>Acceptance of Terms</h3>
							<p>
								By using the App, you agree to be bound by the terms and
								conditions set forth in this Agreement. If you do not agree to
								these terms, please refrain from using the App.
							</p>
						</EUALIContainer>
						<EUALIContainer>
							<h3>Description of Service</h3>
							<p>
								The App is a web app that utilizes Spotify&apos;s Web API to
								provide the User with a quick way to apply non-destructive, bulk
								actions to existing Spotify playlists.
							</p>
						</EUALIContainer>
						<EUALIContainer>
							<h3>Spotify Integration</h3>
							<EUAList ordered>
								<EUALIContainer>
									The Developer does not make any warranties or representations
									on behalf of Spotify and expressly disclaims all implied
									warranties with respect to the Spotify Platform, Spotify
									Service, and Spotify Content, including the implied warranties
									of merchantability, fitness for a particular purpose, and
									non-infringement.
								</EUALIContainer>
								<EUALIContainer>
									The User is prohibited from modifying or creating derivative
									works based on the Spotify Platform, Spotify Service, or
									Spotify Content.
								</EUALIContainer>
								<EUALIContainer>
									The User is prohibited from decompiling, reverse-engineering,
									disassembling, and otherwise reducing the Spotify Platform,
									Spotify Service, and Spotify Content to source code or other
									human-perceivable form, to the full extent allowed by law.
								</EUALIContainer>
							</EUAList>
						</EUALIContainer>
						<EUALIContainer>
							<h3>User Responsibilities</h3>
							<p>The User is responsible for:</p>
							<EUAList
								ordered
								listStyle='lower-alpha'>
								<EUALIContainer>
									<h4>Compliance with Laws</h4>
									<p>
										The User is expected to use the App in compliance with all
										applicable laws and regulations.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Account Security</h4>
									<p>
										The User is responsible for maintaining the security of
										their account credentials and ensuring that unauthorized
										individuals do not access their accounts.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Lawful Use</h4>
									<p>
										The User agrees to use the App for lawful purposes only and
										shall not engage in any activity that violates local,
										national, or international laws.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Prohibited Conduct</h4>
									<p>
										The User is prohibited from engaging in any conduct that may
										harm, interfere with, or disrupt the functionality of the
										App, including but not limited to unauthorized access,
										distribution of malicious code, or attempts to compromise
										the security of the App.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Lawful Content</h4>
									<p>
										If the App allows the User to generate content, the User is
										responsible for ensuring that any content they upload or
										create complies with applicable laws and does not infringe
										on the rights of others.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Termination of Use</h4>
									<p>
										The User acknowledges that the Developer reserves the right
										to terminate their access to the App if they fail to comply
										with these user responsibilities.
									</p>
								</EUALIContainer>
							</EUAList>
						</EUALIContainer>
						<EUALIContainer>
							<h3>Developer&apos;s Liability</h3>
							<p>
								The Developer is solely responsible for its products, and this
								Agreement disclaims any liability on the part of third parties
								(e.g., Spotify).
							</p>
						</EUALIContainer>
						<EUALIContainer>
							<h3>Termination</h3>
							<p>
								The Developer reserves the right to terminate this Agreement and
								your access to the App for any reason.
							</p>
						</EUALIContainer>
						<EUALIContainer>
							<h3>Disclaimers</h3>
							<EUAList
								ordered
								listStyle='lower-alpha'>
								<EUALIContainer>
									The Application is provided &quot;as is&quot; without
									warranties.
								</EUALIContainer>
								<EUALIContainer>
									<p>The Developer disclaims any liability for:</p>
									<EUAList
										ordered
										listStyle='lower-roman'>
										<EUALIContainer>
											<h4>Loss of Data</h4>
											<p>
												The Developer shall not be held liable for any loss of
												the User&apos; data or any damages resulting from the
												loss of data.
											</p>
										</EUALIContainer>
										<EUALIContainer>
											<h4>Consequential Damages</h4>
											<p>
												In no event shall the Developer be liable for any
												consequential, incidental, indirect, special, or
												punitive damages, including, but not limited to, lost
												profits or business interruption, arising out of or in
												connection with the use of the App.
											</p>
										</EUALIContainer>
										<EUALIContainer>
											<h4>Third-Party Actions</h4>
											<p>
												The Developer is not responsible for any actions or
												omissions of third parties, including but not limited to
												service providers, partners, or other users of the App.
											</p>
										</EUALIContainer>
										<EUALIContainer>
											<h4>Interruptions or Downtime</h4>
											<p>
												The Developer does not guarantee continuous,
												uninterrupted, or secure access to the App and shall not
												be liable for any interruptions or downtime of the App.
											</p>
										</EUALIContainer>
										<EUALIContainer>
											<h4>Unauthorized Access</h4>
											<p>
												The Developer is not responsible for any unauthorized
												access to user accounts or any unauthorized use of
												personal information, and users are encouraged to take
												appropriate measures to safeguard their accounts.
											</p>
										</EUALIContainer>
										<EUALIContainer>
											<h4>Modification of Content</h4>
											<p>
												The User acknowledges that the Developer reserves the
												right to modify, suspend, or discontinue MixDelta, and
												shall not be liable for any modification, suspension, or
												discontinuation of the App.
											</p>
										</EUALIContainer>
										<EUALIContainer>
											<h4>Technical Issues</h4>
											<p>
												The Developer is not liable for any technical issues,
												including but not limited to bugs, glitches, or
												compatibility issues, and makes no warranties regarding
												the performance or reliability of the App.
											</p>
										</EUALIContainer>
									</EUAList>
								</EUALIContainer>
							</EUAList>
						</EUALIContainer>
						<EUALIContainer>
							<h3>Limitation of Liability</h3>
							<p>
								The Developer&pos;s liability is limited to the maximum extent
								permitted by applicable law.
							</p>
						</EUALIContainer>
						<EUALIContainer>
							<h3>Indemnification</h3>
							<p>
								The User agrees to indemnify and hold the Developer harmless
								from and against any and all claims, liabilities, damages,
								losses, costs, expenses, or fees (including reasonable
								attorneys&apos; fees) arising out of or in connection with:
							</p>
							<EUAList
								ordered
								listStyle='lower-alpha'>
								<EUALIContainer>
									<h4>User Violations</h4>
									<p>
										Any violation by the user of this Agreement or any
										applicable laws or regulations.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Unauthorized Access</h4>
									<p>
										Any unauthorized access to or use of the App by the user or
										any third party using the User&apos;s account.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Third-Party Claims</h4>
									<p>
										Any claims or actions brought against the Developer by third
										parties arising out of or related to the User&apos;s use of
										the App.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Breach of Agreement</h4>
									<p>Any breach of this Agreement by the User.</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Misuse of MixDelta</h4>
									<p>
										Any misuse or abuse of the App by the User that results in
										harm, damages, or legal consequences.
									</p>
								</EUALIContainer>
								<EUALIContainer>
									<h4>Violation of Rights</h4>
									<p>
										Any violation of the rights of third parties by the User in
										connection with the use of the App.
									</p>
								</EUALIContainer>
							</EUAList>
						</EUALIContainer>
						<EUALIContainer>
							<h3>Amendments</h3>
							<p>
								The Developer reserves the right to update this Agreement, with
								users being informed of changes.
							</p>
						</EUALIContainer>
						<EUALIContainer>
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
						</EUALIContainer>
						<EUALIContainer>
							<h3>Spotify as a Third-Party Beneficiary</h3>
							<p>
								Spotify is a third-party beneficiary of this Agreement and is
								entitled to directly enforce this Agreement.
							</p>
						</EUALIContainer>
					</EUAList>
				</div>
				<p className='text-center'>
					MixDelta&apos;s{' '}
					<a
						href='/privacypolicy'
						className='font-bold underline'>
						privacy policy.
					</a>
				</p>
				<label
					htmlFor='check'
					className='cursor-pointer flex gap-4 py-4'>
					<input
						type='checkbox'
						name='check'
						id='check'
						required
					/>
					I have read, understood, and agreed to these terms and conditions as
					well as the terms and conditions set forth by the privacy policy.
				</label>
				<button
					className={global.emptyButton}
					type='submit'>
					Submit
				</button>
			</form>
		</dialog>
	);
};

export default SpotEUA;
