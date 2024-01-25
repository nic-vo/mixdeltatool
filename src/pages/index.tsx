import { Background, ServiceStatus } from '@components/misc';
import { GlobalStatusUpdater } from '@lib/misc';
import Head from 'next/head';
import { FaArrowCircleRight } from 'react-icons/fa';

import { APP_NAME, MAIN_DESC, MAIN_TITLE } from '@consts/spotify';

import local from '@styles/Home.module.scss';
import global from '@styles/globals.module.scss';

export default function Home(props: {
	status: string,
	statusType: string,
	active: number
}) {
	return (
		<>
			<Head>
				<title>{MAIN_TITLE}</title>
				<meta name='description' content={MAIN_DESC} />
			</Head>

			<main className={local.main}>
				<h1 className={local.heading}>Welcome to the {APP_NAME} tool for Spotify!</h1>
				<a href='/spotify' className={global.emptyButton.concat(' ', local.toolLink)}>To the tool! <FaArrowCircleRight /></a>
				<ServiceStatus {...props} />
				<section className={local.description}>
					<h2>About this tool</h2>
					<section className={local.sectionLeft}>
						<p>Welcome to MixDelta, your ultimate companion for mastering your Spotify playlists with ease. Designed for playlist aficionados who curate an extensive library, MixDelta empowers you to efficiently compare and manage your playlists like never before. Say goodbye to the hassle of manually syncing changes across multiple playlists – MixDelta does the heavy lifting for you.</p>
					</section>
					<section className={local.sectionRight}>
						<p>With MixDelta, you can seamlessly compare two Spotify playlists, identifying shared tracks and unique gems in each. Tailor your new playlists based on your preferences – whether you want a compilation of shared tracks, exclusive additions from each playlist, or any combination in between. The power is in your hands.</p>
					</section>
				</section>
			</main>
			<Background />
		</>
	);
}

export async function getStaticProps() {
	const globalStatus = await GlobalStatusUpdater();
	return {
		props: { ...globalStatus },
		revalidate: 300
	};
}
