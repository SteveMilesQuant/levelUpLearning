export interface UserData {
  full_name: string;
  email_address: string;
}

export interface User extends UserData {
  id: number;
  roles: string[];
}
