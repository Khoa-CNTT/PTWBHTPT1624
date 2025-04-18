export interface IDashboard {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface IDashboardResponse {
    success: boolean;
    message: string;
    data: {
        items: IDashboard[];
        totalPage: number;
    };
}
