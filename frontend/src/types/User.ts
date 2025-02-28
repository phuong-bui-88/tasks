export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  password?: string;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';
