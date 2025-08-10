import { createContext, useEffect, useContext, useRef } from "react";
import { useAppStore } from "../store";
import { HOST } from "../utils/constants";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();

  // 🧠 Extract state once using hooks (valid usage)
  const { userInfo, selectedChatData, selectedChatType, addMessage,addTypingUser,removeTypingUser,setTypingUsers,deleteMessage,editMessage, removeChannel, updateMessages, addUnreadChat, bringChatToTop } =
    useAppStore();

  // ⏺️ Refs to store latest selected chat
//   These refs are "mirrors" of your state values. Why?

// Because socket events are outside the React render lifecycle. If selectedChatData updates in the UI, your socket.on() handlers won’t see it unless you manually sync it.
  const selectedChatDataRef = useRef();
  const selectedChatTypeRef = useRef();

  // ✅ Keep refs in sync with state
  useEffect(() => {
    selectedChatDataRef.current = selectedChatData;
    selectedChatTypeRef.current = selectedChatType;
    setTypingUsers([]);
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo.id,
        },
      });

      socket.current.on("connect", () => {
        console.log("✅ Connected to socket server");
      });

      const handleChannelDeleted = ({ channelId }) => {
        // Use the action from the store to remove the channel
        removeChannel(channelId);
      };
      
      socket.current.on("channel-deleted", handleChannelDeleted);

      const handleMessagesRead = (payload) => {
        const { chatId, messages } = payload;
        const currentChat = selectedChatDataRef.current; // Use the ref here
        
        // Only update the state if the read receipts are for the currently open chat
        if (currentChat && currentChat._id === chatId) {
          updateMessages(messages);
        }
      };
      
      socket.current.on("messages-read", handleMessagesRead);


      const handleRecieveMessage = (message) => {
        const chatData = selectedChatDataRef.current;
        const chatType = selectedChatTypeRef.current;
        const sender = message.sender;

        if (
          chatType === 'contact' &&
          chatData &&
          chatData._id === sender._id
        ) {
          addMessage(message);
        } else {
           if (sender._id !== userInfo.id) {
            bringChatToTop('directMessagesContacts', sender);
            addUnreadChat(sender._id);
          }
        }
      };


      const handleRecieveChannelMessage = (message) => {
        const chatData = selectedChatDataRef.current;
        const chatType = selectedChatTypeRef.current;
        const channelId = message.channelId;
        
        if (
          chatType === 'channel' &&
          chatData !== undefined &&
          chatData._id?.toString() === channelId?.toString()
        ) {
          addMessage(message);
        } else {
          // This is the logic for an unread channel message
           const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
          if (senderId !== userInfo.id) {
            const { channels } = useAppStore.getState();
            const channel = channels.find(c => c._id === channelId);
            if (channel) {
              bringChatToTop('channels', channel);
              addUnreadChat(channelId);
            }
          }
        }
      };

      socket.current.on("receiveMessage", handleRecieveMessage);
      socket.current.on("receive-channel-message", handleRecieveChannelMessage);

      const handleTypingEvent = ({senderId, isChannel,channelId, senderName}) => {
        const chatData = selectedChatDataRef.current;
        const chatType = selectedChatTypeRef.current;
        if (
          (isChannel && chatType === 'channel' && chatData._id === channelId) ||
          (!isChannel && chatType === 'contact' && chatData._id === senderId)
        ) {
          addTypingUser({ id: senderId, firstName: senderName });
        }
      }
      const handleStopTypingEvent = ({ senderId }) => {
        removeTypingUser(senderId);
      };

      const handleMessageDeleted = ({ messageId }) => {
        deleteMessage(messageId);
      };

      const handleMessageEdited = ({ messageId, newContent }) => {
        editMessage(messageId, newContent);
      };

      const handleRemovedFromChannel = ({ channelId }) => {
                removeChannel(channelId);
                toast.info("You have been removed from a channel by the admin.");
            };

            socket.current.on("removed-from-channel", handleRemovedFromChannel);

      socket.current.on("message-deleted", handleMessageDeleted);
      socket.current.on("message-edited", handleMessageEdited);

      socket.current.on("typing", handleTypingEvent);
      socket.current.on("stop-typing", handleStopTypingEvent);

      return () => {
        socket.current.off("channel-deleted", handleChannelDeleted); // Clean up listener
        socket.current.off("messages-read", handleMessagesRead);
        socket.current.disconnect();
        console.log("🔌 Socket disconnected");
        
      };
    }
  }, [userInfo, addMessage, addTypingUser, removeTypingUser, deleteMessage, editMessage, removeChannel,updateMessages,addUnreadChat, bringChatToTop]

);


  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
