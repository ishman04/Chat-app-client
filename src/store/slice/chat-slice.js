export const createChatSlice = (set,get) => ({
    selectedChatType: undefined,
    selectedChatData:  undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
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
    }
})