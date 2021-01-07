import { Role } from "./Role";

export interface User {
  id? :	number;
  firstname:	string;
  lastname: string;
  username: string;
  email: string;
  institution?: string;
  agreed_terms?: boolean;
  roles?: Role[];
}
