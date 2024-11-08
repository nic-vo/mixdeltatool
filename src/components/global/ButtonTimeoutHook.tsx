'use client';

import { useState, type MouseEventHandler } from 'react';

const useButtonTimeout = (firstDelayMsg: string, totalFailMsg: string) => {
	const [messageCountdown, setMessageCountdown] =
		useState<null | NodeJS.Timeout>(null);
	const [totalCountdown, setTotalCountdown] = useState<null | NodeJS.Timeout>(
		null
	);
	const [message, setMessage] = useState('');
	const [disabled, setDisabled] = useState(false);

	const clickHandler: MouseEventHandler<HTMLButtonElement> = async (e) => {
		if (messageCountdown) clearTimeout(messageCountdown);
		if (totalCountdown) clearTimeout(totalCountdown);
		setMessage('');
		setMessageCountdown(setTimeout(() => setMessage(firstDelayMsg), 5000));
		setTotalCountdown(
			setTimeout(() => {
				setMessage(totalFailMsg);
				setDisabled(false);
			}, 15000)
		);
		// REALLY SKETCHY EVENT LOOP HACK
		// Hopefully triggers after main call stack (?)
		setTimeout(() => setDisabled(true));
		setDisabled(false);
	};

	return {
		message,
		disabled,
		clickHandler,
	};
};

export default useButtonTimeout;
