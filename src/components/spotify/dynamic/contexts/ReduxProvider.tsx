import { Provider } from 'react-redux';
import { store } from '@state/state';

const ReduxProvider = (props: { children: React.ReactNode }) => {
	return (
		<Provider store={store}>
			{props.children}
		</Provider>
	);
}

export default ReduxProvider;
