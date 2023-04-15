import create from "./http-service";

export interface User {
  id: number;
  full_name: string;
}

export const instructorService = create<User>("/instructors");

export default create<User>("/users");
