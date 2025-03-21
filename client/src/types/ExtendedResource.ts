import Department from "./Department";
import Resource from "./Resource";

interface ExtendedResource extends Omit<Resource, "department"> {
  department: Department;
}

export default ExtendedResource;
