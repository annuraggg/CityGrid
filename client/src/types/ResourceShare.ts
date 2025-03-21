interface ResourceShare {
    _id: string
    resource: string;
    department: string;
    quantity: number;
    sharedWith: string;
    project: string;
    status: "pending" | "dispatched" | "received";
}

export default ResourceShare;