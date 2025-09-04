export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address?: string | null;
  company?: string | null;
  country?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updateAt: Date;
}
