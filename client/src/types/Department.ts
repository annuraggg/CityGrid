type Department = {
    name: string;
    members: string[];
    projects: string[];
    departments: string[];
    hod?: string;
    inviteStatus: "expired" | "pending" | "accepted";
    createdAt: Date;
    updatedAt: Date;
  };

export default Department;