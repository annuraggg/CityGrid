type Project = {
    name: string;
    description: string;
    department?: string;
    documents: string[];
    resources: string[];
    schedule: {
      start: Date;
      end: Date;
      isRescheduled: boolean;
    };
    location: {
      longitude: number;
      latitude: number;
    };
  };

export default Project;