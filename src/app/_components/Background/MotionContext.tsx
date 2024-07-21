'use client';

import { createContext, useState } from 'react';

const init = { animated: true, setAnimated: (arg: boolean) => {} };

const MotionContext = createContext(init);

export const MotionContextProvider = (props: { children: React.ReactNode }) => {
	const [animated, setAnimated] = useState(true);
	return (
		<MotionContext.Provider value={{ animated, setAnimated }}>
			{props.children}
		</MotionContext.Provider>
	);
};

export default MotionContext;
