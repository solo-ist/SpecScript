import { z } from 'zod';

export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'user', 'guest'])
}); 