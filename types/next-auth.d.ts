import { DefaultSession } from 'next-auth';
import { Role, UserStatus } from '@prisma/client';

// Define a simplified Institution type for the session
interface SessionInstitution {
  id: string;
  name: string;
  isApproved: boolean;
  status: string | null;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: UserStatus;
      institutionId: string | null;
      institutionApproved: boolean;
      institution?: SessionInstitution;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: Role;
    status: UserStatus;
    institutionId: string | null;
    institutionApproved: boolean;
    institution?: SessionInstitution;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    status: UserStatus;
    institutionId: string | null;
    institutionApproved: boolean;
    institution?: SessionInstitution;
  }
} 