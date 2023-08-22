import NextAuth from 'next-auth/next';
import { authOptions } from '@lib/auth/options';

const handler = NextAuth(authOptions);

export default handler;
