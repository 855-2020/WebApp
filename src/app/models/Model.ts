import { Category } from "./Category";
import { Role } from "./Role";
import { Sector } from "./Sector";

export interface Model {
  id?:	number;
  name:	string;
  description: string;
  economic_matrix?: number[][];
  leontief_matrix?: number[][];
  categories: Category[];
  sectors?: Sector[];
  roles?: Role[];
}
