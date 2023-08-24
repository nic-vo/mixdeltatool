import { signIn } from 'next-auth/react';

export default function RetryLogin() {
	return (
		<>
			<h1>Login failed. Please retry</h1>
			<button onClick={() => signIn('spotify', { callbackUrl: '/spotify' })}>Retry login</button>
		</>
	)
}
