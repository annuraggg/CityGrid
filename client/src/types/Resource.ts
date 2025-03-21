type Resource = {
  _id: string;
  name: string;
  quantity: number;
  unit: string;
  description: string;
  category: string;
  department?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
};

export default Resource;
