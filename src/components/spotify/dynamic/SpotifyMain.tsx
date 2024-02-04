import SpotifyRouter from './SpotifyRouter';
import { Provider } from 'react-redux';
import { store } from '@state/state';

const SpotifyMain = () => {
	return (
		<Provider store={store}>
			<SpotifyRouter />
		</Provider>
	);
}

export default SpotifyMain;
