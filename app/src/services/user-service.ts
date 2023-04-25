import create from "./http-service";

export interface UserData {
  full_name: string;
}

export interface User extends UserData {
  id: number;
}

export const instructorService = create<UserData, User>("/instructors");

export default create<UserData, User>("/users");
