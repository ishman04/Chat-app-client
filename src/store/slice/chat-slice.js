export const createChatSlice = (set,get) => ({
    selectedChatType: undefined,
    selectedChatData:  undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    unreadChats: new Set(),
    deleteMessage: (messageId) => {
        const selectedChatMessages = get().selectedChatMessages;
        set({
            selectedChatMessages: selectedChatMessages.filter(msg => msg._id !== messageId)
        });
    },
    editMessage: (messageId, newContent) => {
        const selectedChatMessages = get().selectedChatMessages;
        set({
            selectedChatMessages: selectedChatMessages.map(msg => 
                msg._id === messageId ? { ...msg, content: newContent } : msg
            )
        });
    },
    channels: [],
    typingUsers: [],
    setTypingUsers: (users) => set({ typingUsers: users }),
    addTypingUser: (user) => {
        const typingUsers = get().typingUsers;
        if (!typingUsers.some(u => u.id === user.id)) {
            set({ typingUsers: [...typingUsers, user] });
        }
    },
    removeTypingUser: (userId) => {
        const typingUsers = get().typingUsers;
        set({ typingUsers: typingUsers.filter(u => u.id !== userId) });
    },
    setChannels: (channels) =>set({channels}),

    setIsUploading: (isUploading) => set({isUploading}),
    setIsDownloading: (isDownloading) => set({isDownloading}),
    addUnreadChat: (chatId) => {
        set(state => {
            // Create a new Set to ensure React detects the state change
            const newUnreadChats = new Set(state.unreadChats);
            newUnreadChats.add(chatId);
            return { unreadChats: newUnreadChats };
        });
    },

    removeUnreadChat: (chatId) => {
        set(state => {
            const newUnreadChats = new Set(state.unreadChats);
            newUnreadChats.delete(chatId);
            return { unreadChats: newUnreadChats };
        });
    },
    bringChatToTop: (listKey, chat) => {
        set(state => {
            const list = [...state[listKey]]; // 'directMessagesContacts' or 'channels'
            
            // Find the index of the chat to move
            const existingChatIndex = list.findIndex(c => c._id === chat._id);

            // If it exists, remove it from its current position
            if (existingChatIndex !== -1) {
                list.splice(existingChatIndex, 1);
            }
            
            // Add the (potentially new) chat to the top of the list
            return { [listKey]: [chat, ...list] };
        });
    },
    setFileUploadProgress: (fileUploadProgress) => set({fileUploadProgress}),
    setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress}),
    setSelectedChatType: (selectedChatType) => set({selectedChatType}),
    setSelectedChatData: (selectedChatData) => set({selectedChatData}),
    setSelectedChatMessages: (selectedChatMessages) => set({selectedChatMessages}),
    setDirectMessagesContacts: (directMessagesContacts) => set({directMessagesContacts}),
    addChannel: (channel) => {
        const channels = get().channels;
        set({channels: [channel,...channels]})
    },
    closeChat: () => 
        set({
            selectedChatData: undefined,
            selectedChatMessages: [],
            selectedChatType: undefined
        }),
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMessages: [
                ...selectedChatMessages,
                {
                    ...message,
                    recipient:
                        selectedChatType === 'channel'
                            ? message.recipient
                            : message.recipient._id,
                    sender:
                        selectedChatType === 'channel'
                            ? message.sender
                            : message.sender._id
                    
                }
            ]
        })
    },
    removeChannel: (channelId) => {
        const { channels, selectedChatData, closeChat } = get();
        
        // If the deleted/left channel is the one currently being viewed, close it.
        if (selectedChatData && selectedChatData._id === channelId) {
            closeChat();
        }

        set({
            channels: channels.filter(channel => channel._id !== channelId)
        });
    },
    removeChannelMember: (channelId, memberId) => {
        const { channels, selectedChatData } = get();

        const updatedChannels = channels.map(channel => {
            if (channel._id === channelId) {
                const updatedMembers = channel.members.filter(member => member._id !== memberId);
                return { ...channel, members: updatedMembers };
            }
            return channel;
        });

        // Also update the selectedChatData if it's the current channel
        if (selectedChatData && selectedChatData._id === channelId) {
            const updatedMembers = selectedChatData.members.filter(member => member._id !== memberId);
            set({ selectedChatData: { ...selectedChatData, members: updatedMembers } });
        }

        set({ channels: updatedChannels });
    },

    updateMessages: (updatedMessages) => {
        const { selectedChatMessages } = get();
        const updatedMessagesMap = new Map(updatedMessages.map(msg => [msg._id, msg]));

        const newMessages = selectedChatMessages.map(msg => 
            updatedMessagesMap.has(msg._id) ? updatedMessagesMap.get(msg._id) : msg
        );
        
        set({ selectedChatMessages: newMessages });
    },
    
})