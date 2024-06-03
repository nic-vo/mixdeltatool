'use client';

import { createContext, useState } from 'react';

const MotionContext = createContext({
	animated: true,
	toggleAnimated: () => {},
});

export const MotionContextProvider = (props: { children: React.ReactNode }) => {
	const [animated, setAnimated] = useState(true);
	const toggleAnimated = () => setAnimated(!animated);
	return (
		<MotionContext.Provider value={{ animated, toggleAnimated }}>
			{props.children}
		</MotionContext.Provider>
	);
};

export default MotionContext;
