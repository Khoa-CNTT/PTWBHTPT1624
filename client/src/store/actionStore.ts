import { create } from 'zustand';

// Define the state interface
interface ActionState {
    openFeatureAuth: boolean;
    mobile_ui: boolean;
    isLoading: boolean;
    featureAuth: number; // 0 register, 1 login, 2 forgot
    // socketRef: Socket | null;
    // notifications: INotification[];
    // unreadNotification: INotification[];
    // conversations: Conversation[];
    loadDataConversation: boolean;
    isOpenChat: boolean;
    // Action methods
    setOpenFeatureAuth: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
    setMobileUi: (value: boolean) => void;
    setIsOpenChat: (value: boolean) => void;
    setFeatureAuth: (value: number) => void;
    // setSocketRef: (socket: Socket | null) => void;
    // setNotifications: (payload: INotification | INotification[]) => void;
    // setUnreadNotifications: () => void;
    // setUnreadNotificationsEmpty: () => void;
    // setConversations: (payload: Conversation | Conversation[]) => void;
    // setIsWatchedConversations: (payload: { conversationId: string; userId: string; isWatched: boolean }) => void;
    // setLoadDataConversation: () => void;
}

// Create the Zustand store
export const useActionStore = create<ActionState>((set) => ({
    // Initial state
    openFeatureAuth: false,
    mobile_ui: false,
    isLoading: false,
    featureAuth: 0,
    socketRef: null,
    notifications: [],
    conversations: [],
    isOpenChat: false,
    loadDataConversation: false,

    // Actions
    setOpenFeatureAuth: (value) => set({ openFeatureAuth: value }),
    setIsLoading: (value) => set({ isLoading: value }),
    setMobileUi: (value) => set({ mobile_ui: value }),
    setIsOpenChat: (value) => set({ isOpenChat: value }),
    setFeatureAuth: (value) => set({ featureAuth: value }),
    setLoadDataConversation: () => set((state) => ({ loadDataConversation: !state.loadDataConversation })),
}));
