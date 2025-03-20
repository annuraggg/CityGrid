type Conflict = {
  project?: string;
  conflictingProject?: string;
  status: "pending" | "resolved";
  createdAt: Date;
  updatedAt: Date;
};

export default Conflict;
