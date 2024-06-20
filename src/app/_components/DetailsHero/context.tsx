'use client';

import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react';

export const HeroContextEnum = ['adu', 'odu', 'stu', 'otu', 'bu'] as const;

type HeroContextValue = (typeof HeroContextEnum)[number];

type HeroContextObjectType = {
	active: HeroContextValue | null;
	setActive: Dispatch<SetStateAction<HeroContextValue | null>> | null;
};

const HeroContext = createContext<HeroContextObjectType>({
	active: null,
	setActive: null,
});

export function HeroContextProvider(props: PropsWithChildren) {
	const [active, setActive] = useState<HeroContextValue | null>(null);

	return (
		<HeroContext.Provider value={{ active, setActive }}>
			{props.children}
		</HeroContext.Provider>
	);
}

export const HeroButton = (
	props: PropsWithChildren & { action: HeroContextValue }
) => {
	const { active, setActive } = useContext(HeroContext);
	<button
		onClick={() => setActive && setActive(props.action)}
		className={`p-4 bg-transparent rounded-sm `}>
		{props.children}
	</button>;
};
