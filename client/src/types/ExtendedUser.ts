import Department from "./Department";
import User from "./User";

interface ExtendedUser extends Omit<User, "department"> {
  department: Department;
}

export default ExtendedUser;
