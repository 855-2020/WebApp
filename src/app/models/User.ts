export interface User {
  id? :	number;
  firstname:	string;
  lastname: string;
  username: string;
  email: string;
  institution?: string;
  role?: UserRole["id"];
}

export interface UserRole {
  id: string;
  name: string;
}
