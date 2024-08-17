export interface UserData {
  full_name: string;
  email_address: string;
  instructor_subjects: string;
  instructor_description: string;
}

export interface User extends UserData {
  id: number;
  roles: string[];
}
