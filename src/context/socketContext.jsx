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
  const { userInfo, selectedChatData, selectedChatType, addMessage } =
    useAppStore();

  // ⏺️ Refs to store latest selected chat
  const selectedChatDataRef = useRef();
  const selectedChatTypeRef = useRef();

  // ✅ Keep refs in sync with state
  useEffect(() => {
    selectedChatDataRef.current = selectedChatData;
    selectedChatTypeRef.current = selectedChatType;
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

      const handleRecieveMessage = (message) => {
        console.log("📩 Message received from backend:", message);
        console.log("🔍 Current Chat (ref):", selectedChatDataRef.current);
        console.log("🔍 Chat Type (ref):", selectedChatTypeRef.current);

        const chatData = selectedChatDataRef.current;
        const chatType = selectedChatTypeRef.current;

        if (
          chatType &&
          chatData &&
          (chatData._id === message.sender._id ||
            chatData._id === message.recipient._id)
        ) {
          console.log("✅ Message matches current chat. Adding...");
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

      return () => {
        socket.current.disconnect();
        console.log("🔌 Socket disconnected");
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
