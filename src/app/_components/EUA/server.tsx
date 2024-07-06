import {
	GlobalBlockLink,
	GlobalTextWrapper,
	InlineLink,
} from '@/components/global/serverComponentUI';
import { localNavigation } from '@/consts/buttonStates';
import { PropsWithChildren } from 'react';

const EUAList = (
	props: PropsWithChildren & {
		ordered: boolean;
		listStyle?: string;
		root?: boolean;
	}
) => {
	const classer = `flex flex-col outline-white ${
		props.root ? 'gap-12 *:ml-0' : 'gap-8 ml-8'
	}`;
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

const EUASection = (props: PropsWithChildren) => (
	<section className='flex flex-col gap-2'>{props.children}</section>
);

const EUAHeading = (props: PropsWithChildren & { level: 2 | 3 | 4 | 5 }) => {
	switch (props.level) {
		case 2:
			return (
				<h2 className='text-xl sm:text-2xl font-bold'>{props.children}</h2>
			);
		case 3:
			return (
				<h3 className='text-xl sm:text-2xl font-bold'>{props.children}</h3>
			);
		case 4:
			return (
				<h4 className='text-xl sm:text-2xl font-bold'>{props.children}</h4>
			);
		case 5:
			return (
				<h5 className='text-xl sm:text-2xl font-bold'>{props.children}</h5>
			);
	}
};

export const SmallNav = () => {
	return (
		<nav className='relative z-10 w-full flex justify-between max-w-screen-lg'>
			<GlobalBlockLink
				href='/'
				className={localNavigation}>
				<GlobalTextWrapper>&larr; Home</GlobalTextWrapper>
			</GlobalBlockLink>
			<GlobalBlockLink
				href='/tool'
				className={localNavigation}>
				<GlobalTextWrapper>To the tool &rarr;</GlobalTextWrapper>
			</GlobalBlockLink>
		</nav>
	);
};

const EUAContent = ({
	styling,
	light,
	tabIndex,
}: {
	tabIndex?: 0;
	styling?: string;
	light?: boolean;
}) => (
	<div
		className={'flex flex-col gap-8' + (styling ? ` ${styling}` : '')}
		tabIndex={tabIndex}
		role='region'
		aria-label='Scrollable EUA Content'>
		<EUASection>
			<EUAHeading level={2}>Introduction</EUAHeading>
			<p>
				This End User Agreement (&quot;Agreement&quot;) is entered into between
				you (&quot;User&quot; or &quot;you&quot;) and the developer
				(&quot;Developer&quot;) of the web app &quot;MixDelta&quot;
				(&quot;Application&quot; or &quot;App&quot;). This Agreement governs
				your use of the App and any related services provided by the Developer.
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Acceptance of Terms</EUAHeading>
			<p>
				By using the App, you agree to be bound by the terms and conditions set
				forth in this Agreement. If you do not agree to these terms, please
				refrain from using the App.
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Description of Service</EUAHeading>
			<p>
				The App is a web app that utilizes Spotify&apos;s Web API to provide the
				User with a quick way to apply non-destructive, bulk actions to existing
				Spotify playlists.
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Spotify Integration</EUAHeading>
			<p>
				The Developer does not make any warranties or representations on behalf
				of Spotify and expressly disclaims all implied warranties with respect
				to the Spotify Platform, Spotify Service, and Spotify Content, including
				the implied warranties of merchantability, fitness for a particular
				purpose, and non-infringement.
			</p>
			<p>
				The User is prohibited from modifying or creating derivative works based
				on the Spotify Platform, Spotify Service, or Spotify Content.
			</p>
			<p>
				The User is prohibited from decompiling, reverse-engineering,
				disassembling, and otherwise reducing the Spotify Platform, Spotify
				Service, and Spotify Content to source code or other human-perceivable
				form, to the full extent allowed by law.
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>User Responsibilities</EUAHeading>
			<p>The User is responsible for:</p>
			<EUAList
				ordered
				listStyle='lower-alpha'>
				<li>
					<EUASection>
						<EUAHeading level={3}>Compliance with Laws</EUAHeading>
						<p>
							The User is expected to use the App in compliance with all
							applicable laws and regulations.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Account Security</EUAHeading>
						<p>
							The User is responsible for maintaining the security of their
							account credentials and ensuring that unauthorized individuals do
							not access their accounts.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Lawful Use</EUAHeading>
						<p>
							The User agrees to use the App for lawful purposes only and shall
							not engage in any activity that violates local, national, or
							international laws.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Prohibited Conduct</EUAHeading>
						<p>
							The User is prohibited from engaging in any conduct that may harm,
							interfere with, or disrupt the functionality of the App, including
							but not limited to unauthorized access, distribution of malicious
							code, or attempts to compromise the security of the App.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Lawful Content</EUAHeading>
						<p>
							If the App allows the User to generate content, the User is
							responsible for ensuring that any content they upload or create
							complies with applicable laws and does not infringe on the rights
							of others.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Termination of Use</EUAHeading>
						<p>
							The User acknowledges that the Developer reserves the right to
							terminate their access to the App if they fail to comply with
							these user responsibilities.
						</p>
					</EUASection>
				</li>
			</EUAList>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Developer&apos;s Liability</EUAHeading>
			<p>
				The Developer is solely responsible for its products, and this Agreement
				disclaims any liability on the part of third parties (e.g., Spotify).
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Termination</EUAHeading>
			<p>
				The Developer reserves the right to terminate this Agreement and your
				access to the App for any reason.
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Disclaimers</EUAHeading>
			<p>
				The Application is provided &quot;as is&quot; without warranties. The
				Developer disclaims any liability for:
			</p>
			<EUAList
				ordered
				listStyle='lower-alpha'>
				<li>
					<EUASection>
						<EUAHeading level={3}>Loss of Data</EUAHeading>
						<p>
							The Developer shall not be held liable for any loss of the
							User&apos; data or any damages resulting from the loss of data.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Consequential Damages</EUAHeading>
						<p>
							In no event shall the Developer be liable for any consequential,
							incidental, indirect, special, or punitive damages, including, but
							not limited to, lost profits or business interruption, arising out
							of or in connection with the use of the App.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Third-Party Actions</EUAHeading>
						<p>
							The Developer is not responsible for any actions or omissions of
							third parties, including but not limited to service providers,
							partners, or other users of the App.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Interruptions or Downtime</EUAHeading>
						<p>
							The Developer does not guarantee continuous, uninterrupted, or
							secure access to the App and shall not be liable for any
							interruptions or downtime of the App.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Unauthorized Access</EUAHeading>
						<p>
							The Developer is not responsible for any unauthorized access to
							user accounts or any unauthorized use of personal information, and
							users are encouraged to take appropriate measures to safeguard
							their accounts.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Modification of Content</EUAHeading>
						<p>
							The User acknowledges that the Developer reserves the right to
							modify, suspend, or discontinue MixDelta, and shall not be liable
							for any modification, suspension, or discontinuation of the App.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Technical Issues</EUAHeading>
						<p>
							The Developer is not liable for any technical issues, including
							but not limited to bugs, glitches, or compatibility issues, and
							makes no warranties regarding the performance or reliability of
							the App.
						</p>
					</EUASection>
				</li>
			</EUAList>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Limitation of Liability</EUAHeading>
			<p>
				The Developer&pos;s liability is limited to the maximum extent permitted
				by applicable law.
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Indemnification</EUAHeading>
			<p>
				The User agrees to indemnify and hold the Developer harmless from and
				against any and all claims, liabilities, damages, losses, costs,
				expenses, or fees (including reasonable attorneys&apos; fees) arising
				out of or in connection with:
			</p>
			<EUAList
				ordered
				listStyle='lower-alpha'>
				<li>
					<EUASection>
						<EUAHeading level={3}>User Violations</EUAHeading>
						<p>
							Any violation by the user of this Agreement or any applicable laws
							or regulations.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Unauthorized Access</EUAHeading>
						<p>
							Any unauthorized access to or use of the App by the user or any
							third party using the User&apos;s account.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Third-Party Claims</EUAHeading>
						<p>
							Any claims or actions brought against the Developer by third
							parties arising out of or related to the User&apos;s use of the
							App.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Breach of Agreement</EUAHeading>
						<p>Any breach of this Agreement by the User.</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Misuse of MixDelta</EUAHeading>
						<p>
							Any misuse or abuse of the App by the User that results in harm,
							damages, or legal consequences.
						</p>
					</EUASection>
				</li>
				<li>
					<EUASection>
						<EUAHeading level={3}>Violation of Rights</EUAHeading>
						<p>
							Any violation of the rights of third parties by the User in
							connection with the use of the App.
						</p>
					</EUASection>
				</li>
			</EUAList>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Amendments</EUAHeading>
			<p>
				The Developer reserves the right to update this Agreement, with users
				being informed of changes.
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Contact Information</EUAHeading>
			<p>
				For support or inquiries, please use{' '}
				<InlineLink
					href='/contact'
					className={light ? 'outline-black' : ''}>
					our contact form
				</InlineLink>{' '}
				or email us at{' '}
				<InlineLink
					href='mailto:mixdeltatool@gmail.com'
					target='_blank'
					className={light ? 'outline-black' : ''}>
					mixdeltatool@gmail.com
				</InlineLink>
				.
			</p>
		</EUASection>
		<EUASection>
			<EUAHeading level={2}>Spotify as a Third-Party Beneficiary</EUAHeading>
			<p>
				Spotify is a third-party beneficiary of this Agreement and is entitled
				to directly enforce this Agreement.
			</p>
		</EUASection>
		<p>
			Effective: <time dateTime='2024-01-26'>January 26, 2024</time>
		</p>
	</div>
);

export default EUAContent;
