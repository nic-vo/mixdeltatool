import { createContext, useState } from 'react';

const GlobalLoadingContextInit = {
	gLoading: false,
	updateGLoading: (newL: boolean) => null
};

type GlobalLoadingContextSignature = typeof GlobalLoadingContextInit;

const GlobalLoadingContext = createContext<GlobalLoadingContextSignature>(GlobalLoadingContextInit);

const GlobalLoadingProvider = (props: { children: React.ReactNode }) => {
	const [loading, setLoading] = useState(false);

	const updateGLoading = (newL: boolean) => {
		setLoading(newL);
		return null;
	}

	return (
		<GlobalLoadingContext.Provider value={{
			gLoading: loading,
			updateGLoading
		}}>
			{props.children}
		</GlobalLoadingContext.Provider>
	);
}

export {
	GlobalLoadingContext,
	GlobalLoadingProvider
};
