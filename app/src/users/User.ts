
export interface UserData {
  full_name: string;
  email_address: string;
  instructor_subjects: string;
  instructor_description: string;
  email_verified?: boolean;
  receive_marketing_emails?: boolean;
}

export interface User extends UserData {
  id: number;
  roles: string[];
}
