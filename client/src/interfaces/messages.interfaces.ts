interface Sender {
    _id?: string;
    user_name?: string;
    user_avatar_url?: string;
    admin_name: string;
    admin_avatar_url?: string;
}
export interface IMessage {
    _id?: string;
    conversationId?: string;
    sender: Sender;
    senderRole: string;
    image?: string;
    text?: string;
    seen?: boolean;
    createdAt: string;
    updatedAt?: string;
}
