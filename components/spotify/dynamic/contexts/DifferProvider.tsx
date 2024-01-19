import { createContext, useState, useContext } from 'react';
import { useDifferForm } from '@hooks/differ';
import { GlobalLoadingContext } from './GlobalLoadingProvider';
import { ActionType, MyPlaylistObject } from '@components/spotify/types';

const DifferContextInit = {
	target: '' as '' | MyPlaylistObject,
	differ: '' as '' | MyPlaylistObject,
	type: 'stu' as '' | ActionType,
	loading: false,
	error: null as null | string,
	success: null as null | string[],
	targetChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => null,
	differChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => null,
	radioHandler: (e: React.ChangeEvent<HTMLSelectElement>) => null,
	submitHandler: async (e: React.FormEvent<HTMLFormElement>) => null,
	onForm: true,
	goToForm: () => null,
	leaveForm: () => null
}

type DifferContextSignature = typeof DifferContextInit;

const DifferContext = createContext<DifferContextSignature>(DifferContextInit);

const DifferProvider = (props: { children: React.ReactNode }) => {
	const [onForm, setOnForm] = useState(true);
	const { gLoading } = useContext(GlobalLoadingContext);

	const {
		target,
		differ,
		type,
		loading,
		error,
		success,
		targetChangeHandler,
		differChangeHandler,
		radioHandler,
		submitHandler,
	} = useDifferForm();

	const goToForm = () => {
		setOnForm(true);
		return null;
	}

	const leaveForm = () => {
		setOnForm(false);
		return null;
	}

	const providerSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		if (gLoading) return null;
		leaveForm();
		await submitHandler(e);
		return null;
	}

	return (
		<DifferContext.Provider value={{
			target,
			differ,
			type,
			loading: loading || gLoading,
			error,
			success,
			targetChangeHandler,
			differChangeHandler,
			radioHandler,
			submitHandler: providerSubmitHandler,
			onForm,
			goToForm,
			leaveForm
		}}>
			{props.children}
		</DifferContext.Provider>
	);
}

export {
	DifferContext,
	DifferProvider
};
