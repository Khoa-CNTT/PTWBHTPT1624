// Interface for the User object
interface User {
    _id: string;
    user_name: string;
    user_avatar_url: string;
}

// Interface for the Chat/Conversation object
export interface IConversation {
    _id: string;
    user: User;
    participants: string[];
    createdAt: string;
    updatedAt: string;
    seen: boolean;
}
