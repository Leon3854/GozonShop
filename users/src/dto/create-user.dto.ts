export class CreateUserDto {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address?: string;
  company?: string;
  country?: string;
  avatar?: string;
}
