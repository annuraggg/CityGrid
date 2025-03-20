type User = {
  _id: string;
  clerkId: string;
  role: "pm" | "citizen" | "hod";
  name: string;
  email: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
};

export default User;
