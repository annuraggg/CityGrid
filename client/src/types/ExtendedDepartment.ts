import Department from "./Department";
import Project from "./Project";
import User from "./User";

interface ExtendedDepartment
  extends Omit<Department, "members" | "projects" | "departments" | "hod"> {
  members: User[];
  projects: Project[];
  departments: Department[];
  hod?: User;
}

export default ExtendedDepartment;