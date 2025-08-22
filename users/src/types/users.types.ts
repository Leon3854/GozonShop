export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address?: string;
  company?: string;
  country?: string;
  avatar?: string;
  createdAt: Date;
  updateAt: Date;
};
export type UserCreateInput = Omit<User, 'id' | 'createdAt' | 'updateAt'>;
