type Resource = {
  name: string;
  quantity: number;
  unit: string;
  description: string;
  department?: string;
  sharedWith: string[];
  status: "pending" | "dispatched" | "delivered";
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
};

export default Resource;
