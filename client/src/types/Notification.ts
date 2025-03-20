type Notification = {
    recipent?: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

export default Notification;