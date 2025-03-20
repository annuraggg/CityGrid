type User = {
  clerkId: string;
  role: "pm" | "citizen" | "hod";
  department?: string;
  uid?: string;
  createdAt: Date;
  updatedAt: Date;
};

export default User;
