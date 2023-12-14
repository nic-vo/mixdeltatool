import { FormEventHandler, useEffect, useRef } from 'react';

import look from './SpotEUA.module.scss';

const LOCAL_EXPIRY_KEY = 'SUPERUSER_EUA';
const LOCAL_EXPIRY_LENGTH = 1000 * 5;
const APP_NAME = 'SUPERUSER ACTIONS';

const SpotEUA = (props: {
	submitter?: () => void
}) => {

	const modalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const modal = modalRef.current;
		if (modal === null) return;
		try {
			const local = localStorage.getItem(LOCAL_EXPIRY_KEY);
			if (local === null) throw null;
			const expiry = parseInt(local) * 1000;
			if (expiry === undefined || Date.now() > expiry) throw null;
			if (props.submitter) props.submitter();
		} catch {
			modal.showModal();
		}
	}, []);

	const formSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		localStorage.setItem(LOCAL_EXPIRY_KEY, Math.floor(
			(Date.now() + LOCAL_EXPIRY_LENGTH) / 1000)
			.toString());
		modalRef.current!.close();
		if (props.submitter) props.submitter();
		return null;
	}

	return (
		<dialog ref={modalRef} className={look.dialog}>
			<form onSubmit={formSubmit} className={look.form}>
				<h2 className={look.h2}>{APP_NAME} End User Agreement</h2>
				<div>
					<p>Last updated: {'stupid'}</p>

					<p>
						This End User Agreement ("Agreement") is entered into between you ("User" or "you") and the developer  ("Developer") of the web app "Superuser Actions." This Agreement governs your use of the App and any related services provided by the Developer.
					</p>

					<ol className={look.list}>
						<li>
							<h3>Acceptance of Terms</h3>
							<p>
								By using Superuser Actions, you agree to be bound by the terms and conditions set forth in this Agreement. If you do not agree to these terms, please refrain from using the app.
							</p>
						</li>
						<li>
							<h3>Description of Service</h3>
							<p>
								Superuser Actions is a web app that utilizes Spotify's Web API to provide the User with a quick way to apply non-destructive, bulk actions to existing Spotify playlists.
							</p>
						</li>
						<li>
							<h3>Spotify Integration</h3>
							<ol className={look.secondList}>
								<li>
									The Developer does not make any warranties or representations on behalf of Spotify and expressly disclaims all implied warranties with respect to the Spotify Platform, Spotify Service, and Spotify Content, including the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
								</li>
								<li>
									The User is prohibited from modifying or creating derivative works based on the Spotify Platform, Spotify Service, or Spotify Content.
								</li>
								<li>
									The User is prohibited from decompiling, reverse-engineering, disassembling, and otherwise reducing the Spotify Platform, Spotify Service, and Spotify Content to source code or other human-perceivable form, to the full extent allowed by law.
								</li>
							</ol>
						</li>
						<li>
							<h3>User Responsibilities</h3>
							<p>Users are responsible for:</p>
							<ol className={look.secondList}>
								<li>
									<h4>Compliance with Laws</h4>
									<p>
										Users are expected to use Superuser Actions in compliance with all applicable laws and regulations.
									</p>
								</li>
								<li>
									<h4>Account Security</h4>
									<p>
										Users are responsible for maintaining the security of their account credentials and ensuring that unauthorized individuals do not access their accounts.
									</p>
								</li>
								<li>
									<h4>Lawful Use</h4>
									<p>
										Users agree to use Superuser Actions for lawful purposes only and shall not engage in any activity that violates local, national, or international laws.
									</p>
								</li>
								<li>
									<h4>Prohibited Conduct</h4>
									<p>
										Users are prohibited from engaging in any conduct that may harm, interfere with, or disrupt the functionality of Superuser Actions, including but not limited to unauthorized access, distribution of malicious code, or attempts to compromise the security of the app.
									</p>
								</li>
								<li>
									<h4>Lawful Content</h4>
									<p>
										If the app allows users to generate content, users are responsible for ensuring that any content they upload or create complies with applicable laws and does not infringe on the rights of others.
									</p>
								</li>
								<li>
									<h4>Termination of Use</h4>
									<p>
										Users acknowledge that the developer reserves the right to terminate their access to Superuser Actions if they fail to comply with these user responsibilities.
									</p>
								</li>
							</ol>
						</li>
						<li>
							<h3>Developer's Liability</h3>
							<p>
								The Developer is solely responsible for its products, and this Agreement disclaims any liability on the part of third parties (e.g., Spotify).
							</p>
						</li>
						<li>
							<h3>Termination</h3>
							<p>
								The Developer reserves the right to terminate this Agreement and your access to Superuser Actions for any reason.
							</p>
						</li>
						<li>
							<h3>Disclaimers</h3>
							<ol className={look.secondList}>
								<li>Superuser Actions is provided "as is" without warranties.</li>
								<li>
									<p>The Developer disclaims any liability for:</p>
									<ol className={look.thirdList}>
										<li>
											<h4>Loss of Data</h4>
											<p>
												The Developer shall not be held liable for any loss of user data or any damages resulting from the loss of data.
											</p>
										</li>
										<li>
											<h4>Consequential Damages</h4>
											<p>
												In no event shall the Developer be liable for any consequential, incidental, indirect, special, or punitive damages, including, but not limited to, lost profits or business interruption, arising out of or in connection with the use of Superuser Actions.
											</p>
										</li>
										<li>
											<h4>Third-Party Actions</h4>
											<p>
												The Developer is not responsible for any actions or omissions of third parties, including but not limited to service providers, partners, or other users of Superuser Actions.
											</p>
										</li>
										<li>
											<h4>Interruptions or Downtime</h4>
											<p>
												The Developer does not guarantee continuous, uninterrupted, or secure access to Superuser Actions and shall not be liable for any interruptions or downtime of the app.
											</p>
										</li>
										<li>
											<h4>Unauthorized Access</h4>
											<p>
												The Developer is not responsible for any unauthorized access to user accounts or any unauthorized use of personal information, and users are encouraged to take appropriate measures to safeguard their accounts.
											</p>
										</li>
										<li>
											<h4>Modification of Content</h4>
											<p>
												Users acknowledge that the Developer reserves the right to modify, suspend, or discontinue Superuser Actions, and shall not be liable for any modification, suspension, or discontinuation of the app.
											</p>
										</li>
										<li>
											<h4>Technical Issues</h4>
											<p>
												The Developer is not liable for any technical issues, including but not limited to bugs, glitches, or compatibility issues, and makes no warranties regarding the performance or reliability of Superuser Actions.
											</p>
										</li>
									</ol>
								</li>
							</ol>
						</li>
						<li>
							<h3>Limitation of Liability</h3>
							<p>The Developer's liability is limited to the maximum extent permitted by applicable law.</p>
						</li>
						<li>
							<h3>Indemnification</h3>
							<p>
								Users agree to indemnify and hold the Developer harmless from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or in connection with:
							</p>
							<ol className={look.secondList}>
								<li>
									<h4>User Violations</h4>
									<p>
										Any violation by the user of this End User Agreement or any applicable laws or regulations.
									</p>
								</li>
								<li>
									<h4>Unauthorized Access</h4>
									<p>
										Any unauthorized access to or use of Superuser Actions by the user or any third party using the user's account.
									</p>
								</li>
								<li>
									<h4>Third-Party Claims</h4>
									<p>
										Any claims or actions brought against the Developer by third parties arising out of or related to the user's use of Superuser Actions.
									</p>
								</li>
								<li>
									<h4>Breach of Agreement</h4>
									<p>Any breach of this End User Agreement by the user.</p>
								</li>
								<li>
									<h4>Misuse of Superuser Actions</h4>
									<p>
										Any misuse or abuse of Superuser Actions by the user that results in harm, damages, or legal consequences.
									</p>
								</li>
								<li>
									<h4>Violation of Rights</h4>
									<p>
										Any violation of the rights of third parties by the user in connection with the use of Superuser Actions.
									</p>
								</li>
							</ol>
						</li>
						<li>
							<h3>Amendments</h3>
							<p>
								The Developer reserves the right to update this Agreement, with users being informed of changes.
							</p>
						</li>
						<li>
							<h3>Contact Information</h3>
							{/* TODO HERE */}
							<p>For support or inquiries, please contact [provide contact details].</p>
						</li>
						<li>
							<h3>Spotify as a Third-Party Beneficiary</h3>
							<p>
								Spotify is a third-party beneficiary of this End User Agreement and is entitled to directly enforce this User License Agreement.
							</p>
						</li>
					</ol>
				</div>
				{/* TODO HERE */}
				<label htmlFor='check'>
					<input type='checkbox' name='check' id='check' required />
					I have read, understood, and agreed to these terms and conditions as well as the terms and conditions set forth by the privacy policy. [Link to privacy policy]
				</label>
				<button type='submit'>Submit</button>
			</form >
		</dialog >
	);
}

export default SpotEUA;
