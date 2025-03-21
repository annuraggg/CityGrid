import Department from "./Department";
import Document from "./Document";
import Project from "./Project";
import User from "./User";

interface ExtendedProject extends Omit<Project, "department" | "documents" | "manager"> {
  department: Department;
  documents: Document[];
  manager: User
}

export default ExtendedProject;
