import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { compare } from 'bcrypt';

// Ensure we have a secret for NextAuth
const secret = process.env.NEXTAUTH_SECRET || 'your-fallback-secret-key-change-in-production';

export const authOptions: NextAuthOptions = {
  secret: secret,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            institution: true
          }
        });
        
        if (!user) {
          return null;
        }
        
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        
        if (!isPasswordValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          institutionId: user.institution?.id || null,
          status: user.status,
          institutionApproved: user.institution?.isApproved || false
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
        token.institutionId = user.institutionId;
        token.status = user.status;
        token.institutionApproved = user.institutionApproved;
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        Object.assign(token, session);
      }
      
      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.image as string | null,
          role: token.role as string,
          institutionId: token.institutionId as string | null,
          status: token.status as string,
          institutionApproved: token.institutionApproved as boolean,
        };
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Allow URLs from the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      return baseUrl;
    },
    async signOut({ token, session }) {
      // Clear any custom session data
      return true;
    }
  },
  debug: false, // Disable debug mode
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Sign in event handled silently
    },
    async session({ session, token }) {
      // Session event handled silently
    },
  },
}; 