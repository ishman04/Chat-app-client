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
  const { userInfo, selectedChatData, selectedChatType, addMessage,addTypingUser,removeTypingUser,setTypingUsers,deleteMessage,editMessage, removeChannel } =
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

      const handleRecieveMessage = (message) => {

        const chatData = selectedChatDataRef.current;
        const chatType = selectedChatTypeRef.current;

        if (
          chatType &&
          chatData &&
          (chatData._id === message.sender._id ||
            chatData._id === message.recipient._id)
        ) {
          addMessage(message);
        } else {
          console.log("⚠️ Message does not match current chat. Ignored.");
        }
      };

      const handleRecieveChannelMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();
        if (
          selectedChatData !== undefined &&
          selectedChatData._id?.toString() === message.channelId?.toString()
        ) {
          addMessage(message);
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
        socket.current.disconnect();
        console.log("🔌 Socket disconnected");
      };
    }
  }, [userInfo, addMessage, addTypingUser, removeTypingUser, deleteMessage, editMessage, removeChannel]

);


  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
