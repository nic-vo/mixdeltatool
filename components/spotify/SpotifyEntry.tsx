import { SpotifyMain } from './dynamic';
import Header from './Header/Header';
import { SpotEUA } from '@components/legal';
import { Background } from '@components/misc';

export default function SpotifyEntry() {
	return (
		<>
			<Header />
			<main style={{
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				justifyContent:'space-around',
				flexDirection: 'column',
				width: '100svw',
				height: '100svh',
				zIndex: 1
			}}>
				<SpotEUA />
				<SpotifyMain />
				<Background />
			</main>
		</>
	);
}
