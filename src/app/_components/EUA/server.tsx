import Link from 'next/link';
import { PropsWithChildren } from 'react';

const EUAList = (
	props: PropsWithChildren & { ordered: boolean; listStyle?: string }
) => {
	const classer = 'flex flex-col gap-6 pl-6';
	const { children, ordered, listStyle } = props;
	if (ordered)
		return (
			<ol
				className={classer}
				style={listStyle ? { listStyleType: listStyle } : {}}>
				{children}
			</ol>
		);
	return (
		<ul
			className={classer}
			style={listStyle ? { listStyleType: listStyle } : {}}>
			{children}
		</ul>
	);
};

const EUALIContainer = (props: PropsWithChildren) => {
	return (
		<li>
			<section>{props.children}</section>
		</li>
	);
};

const EUAHeading = (
	props: PropsWithChildren & { lower?: boolean; level: 2 | 3 | 4 | 5 }
) => {
	switch (props.level + (props.lower ? 1 : 0)) {
		case 2:
			return <h2 className='font-hind'>{props.children}</h2>;
		case 3:
			return <h3 className='font-hind'>{props.children}</h3>;
		case 4:
			return <h4 className='font-hind'>{props.children}</h4>;
		case 5:
			return <h5 className='font-hind'>{props.children}</h5>;
	}
};

export const SmallNav = () => {
	return (
		<nav className='w-fLocalListl flex justify-between p-4 *'>
			<Link
				href='/'
				prefetch={false}
				className='border-b-2 border-white p-4 hover:text-black hover:bg-white focus-visible:text-black focus-visible:bg-white *:text-inherit'>
				&larr; Back home
			</Link>
			<Link
				href='/spotify'
				prefetch={false}
				className='border-b-2 border-white p-4 hover:text-black hover:bg-white focus-visible:text-black focus-visible:bg-white *:text-inherit'>
				To the tool &rarr;
			</Link>
		</nav>
	);
};

const EUAContent = ({ lower }: { lower?: boolean }) => (
	<>
		<p>Effective: January 26, 2024</p>
		<p>
			This End User Agreement (&quot;Agreement&quot;) is entered into between
			you (&quot;User&quot; or &quot;you&quot;) and the developer
			(&quot;Developer&quot;) of the web app &quot;MixDelta&quot;
			(&quot;Application&quot; or &quot;App&quot;). This Agreement governs your
			use of the App and any related services provided by the Developer.
		</p>
		<EUAList ordered>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Acceptance of Terms
				</EUAHeading>
				<p>
					By using the App, you agree to be bound by the terms and conditions
					set forth in this Agreement. If you do not agree to these terms,
					please refrain from using the App.
				</p>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Description of Service
				</EUAHeading>
				<p>
					The App is a web app that utilizes Spotify&apos;s Web API to provide
					the User with a quick way to apply non-destructive, bulk actions to
					existing Spotify playlists.
				</p>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Spotify Integration
				</EUAHeading>
				<EUAList ordered>
					<EUALIContainer>
						The Developer does not make any warranties or representations on
						behalf of Spotify and expressly disclaims all implied warranties
						with respect to the Spotify Platform, Spotify Service, and Spotify
						Content, including the implied warranties of merchantability,
						fitness for a particular purpose, and non-infringement.
					</EUALIContainer>
					<EUALIContainer>
						The User is prohibited from modifying or creating derivative works
						based on the Spotify Platform, Spotify Service, or Spotify Content.
					</EUALIContainer>
					<EUALIContainer>
						The User is prohibited from decompiling, reverse-engineering,
						disassembling, and otherwise reducing the Spotify Platform, Spotify
						Service, and Spotify Content to source code or other
						human-perceivable form, to the full extent allowed by law.
					</EUALIContainer>
				</EUAList>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					User Responsibilities
				</EUAHeading>
				<p>The User is responsible for:</p>
				<EUAList
					ordered
					listStyle='lower-alpha'>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Compliance with Laws
						</EUAHeading>
						<p>
							The User is expected to use the App in compliance with all
							applicable laws and regulations.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Account Security
						</EUAHeading>
						<p>
							The User is responsible for maintaining the security of their
							account credentials and ensuring that unauthorized individuals do
							not access their accounts.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Lawful Use
						</EUAHeading>
						<p>
							The User agrees to use the App for lawful purposes only and shall
							not engage in any activity that violates local, national, or
							international laws.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Prohibited Conduct
						</EUAHeading>
						<p>
							The User is prohibited from engaging in any conduct that may harm,
							interfere with, or disrupt the functionality of the App, including
							but not limited to unauthorized access, distribution of malicious
							code, or attempts to compromise the security of the App.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Lawful Content
						</EUAHeading>
						<p>
							If the App allows the User to generate content, the User is
							responsible for ensuring that any content they upload or create
							complies with applicable laws and does not infringe on the rights
							of others.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Termination of Use
						</EUAHeading>
						<p>
							The User acknowledges that the Developer reserves the right to
							terminate their access to the App if they fail to comply with
							these user responsibilities.
						</p>
					</EUALIContainer>
				</EUAList>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Developer&apos;s Liability
				</EUAHeading>
				<p>
					The Developer is solely responsible for its products, and this
					Agreement disclaims any liability on the part of third parties (e.g.,
					Spotify).
				</p>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Termination
				</EUAHeading>
				<p>
					The Developer reserves the right to terminate this Agreement and your
					access to the App for any reason.
				</p>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Disclaimers
				</EUAHeading>
				<p>
					The Application is provided &quot;as is&quot; without warranties. The
					Developer disclaims any liability for:
				</p>
				<EUAList
					ordered
					listStyle='lower-alpha'>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Loss of Data
						</EUAHeading>
						<p>
							The Developer shall not be held liable for any loss of the
							User&apos; data or any damages resulting from the loss of data.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Consequential Damages
						</EUAHeading>
						<p>
							In no event shall the Developer be liable for any consequential,
							incidental, indirect, special, or punitive damages, including, but
							not limited to, lost profits or business interruption, arising out
							of or in connection with the use of the App.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Third-Party Actions
						</EUAHeading>
						<p>
							The Developer is not responsible for any actions or omissions of
							third parties, including but not limited to service providers,
							partners, or other users of the App.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Interruptions or Downtime
						</EUAHeading>
						<p>
							The Developer does not guarantee continuous, uninterrupted, or
							secure access to the App and shall not be liable for any
							interruptions or downtime of the App.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Unauthorized Access
						</EUAHeading>
						<p>
							The Developer is not responsible for any unauthorized access to
							user accounts or any unauthorized use of personal information, and
							users are encouraged to take appropriate measures to safeguard
							their accounts.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Modification of Content
						</EUAHeading>
						<p>
							The User acknowledges that the Developer reserves the right to
							modify, suspend, or discontinue MixDelta, and shall not be liable
							for any modification, suspension, or discontinuation of the App.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Technical Issues
						</EUAHeading>
						<p>
							The Developer is not liable for any technical issues, including
							but not limited to bugs, glitches, or compatibility issues, and
							makes no warranties regarding the performance or reliability of
							the App.
						</p>
					</EUALIContainer>
				</EUAList>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Limitation of Liability
				</EUAHeading>
				<p>
					The Developer&pos;s liability is limited to the maximum extent
					permitted by applicable law.
				</p>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Indemnification
				</EUAHeading>
				<p>
					The User agrees to indemnify and hold the Developer harmless from and
					against any and all claims, liabilities, damages, losses, costs,
					expenses, or fees (including reasonable attorneys&apos; fees) arising
					out of or in connection with:
				</p>
				<EUAList
					ordered
					listStyle='lower-alpha'>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							User Violations
						</EUAHeading>
						<p>
							Any violation by the user of this Agreement or any applicable laws
							or regulations.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Unauthorized Access
						</EUAHeading>
						<p>
							Any unauthorized access to or use of the App by the user or any
							third party using the User&apos;s account.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Third-Party Claims
						</EUAHeading>
						<p>
							Any claims or actions brought against the Developer by third
							parties arising out of or related to the User&apos;s use of the
							App.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Breach of Agreement
						</EUAHeading>
						<p>Any breach of this Agreement by the User.</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Misuse of MixDelta
						</EUAHeading>
						<p>
							Any misuse or abuse of the App by the User that results in harm,
							damages, or legal consequences.
						</p>
					</EUALIContainer>
					<EUALIContainer>
						<EUAHeading
							level={3}
							lower={lower}>
							Violation of Rights
						</EUAHeading>
						<p>
							Any violation of the rights of third parties by the User in
							connection with the use of the App.
						</p>
					</EUALIContainer>
				</EUAList>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Amendments
				</EUAHeading>
				<p>
					The Developer reserves the right to update this Agreement, with users
					being informed of changes.
				</p>
			</EUALIContainer>
			<EUALIContainer>
				<EUAHeading
					level={2}
					lower={lower}>
					Contact Information
				</EUAHeading>
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
				<EUAHeading
					level={2}
					lower={lower}>
					Spotify as a Third-Party Beneficiary
				</EUAHeading>
				<p>
					Spotify is a third-party beneficiary of this Agreement and is entitled
					to directly enforce this Agreement.
				</p>
			</EUALIContainer>
		</EUAList>
	</>
);

export default EUAContent;
