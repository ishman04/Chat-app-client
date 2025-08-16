import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from "../../../../../../store";
import { useSocket } from "../../../../../../context/socketContext";
import { apiClient } from "../../../../../../lib/api-client";
import { CHATBOT_QUERY_ROUTE, UPLOAD_FILE_ROUTE } from "../../../../../../utils/constants";
import { StatusCodes } from "http-status-codes";
import { toast } from "sonner";


const MessageBar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const { userInfo, selectedChatType, selectedChatData, setIsUploading, setFileUploadProgress, addMessage } = useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
        if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (socket?.current && selectedChatData) {
            socket.current.emit("stop-typing", {
                recipient: selectedChatData._id,
                channelId: selectedChatData._id,
                isChannel: selectedChatType === 'channel'
            });
        }
    };
  }, [selectedChatData, selectedChatType, socket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    if (selectedChatData?._id === 'chatbot-gemini-id') {
      const userQueryMessage = {
        _id: `user-msg-${Date.now()}`,
        sender: { _id: userInfo.id },
        recipient: { _id: 'chatbot-gemini-id' },
        content: message,
        messageType: 'text',
        timestamp: new Date(),
      };
      addMessage(userQueryMessage);

      const queryText = message;
      setMessage(""); // Clear input immediately

      try {
        await apiClient.post(CHATBOT_QUERY_ROUTE, { message: queryText }, { withCredentials: true });
        // The bot's response comes via a separate socket event
      } catch (error) {
        console.error("Chatbot API error:", error);
        toast.error("Could not reach ChatterBot. Please try again.");
      }
    
    } else {
      const messageData = {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: 'text',
      };

      if (selectedChatType === 'contact') {
        socket.current.emit("sendMessage", messageData);
      } else if (selectedChatType === 'channel') {
        messageData.channelId = selectedChatData._id;
        socket.current.emit("sendChannelMessage", messageData);
      }

      setMessage("");
      if (socket.current) {
        clearTimeout(typingTimeoutRef.current);
        socket.current.emit("stop-typing", {
            recipient: selectedChatData._id,
            channelId: selectedChatData._id,
            isChannel: selectedChatType === 'channel'
        });
      }
    }
    // --- END OF NEW LOGIC ---
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (socket?.current) {
        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Emit that user is typing
        socket.current.emit("typing", {
            recipient: selectedChatData._id,
            channelId: selectedChatData._id,
            isChannel: selectedChatType === 'channel'
        });

        // Set a timeout to emit "stop-typing" after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket.current.emit("stop-typing", {
                recipient: selectedChatData._id,
                channelId: selectedChatData._id,
                isChannel: selectedChatType === 'channel'
            });
            typingTimeoutRef.current = null;
        }, 2000);
    }
  };


  const handleAttachementClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachementChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      setIsUploading(true);
      setFileUploadProgress(0);

      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        withCredentials: true,
        onUploadProgress: (data) => {
          setFileUploadProgress(Math.round((100 * data.loaded) / (data.total || file.size)));
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === StatusCodes.OK && response.data?.data?.filePath) {
        setIsUploading(false);
        setFileUploadProgress(0);

        const messageData = {
          sender: userInfo.id,
          content: message,
          messageType: 'file',
          fileUrl: response.data.data.filePath,
          originalFilename: response.data.data.originalFilename,
        };

        if (selectedChatType === 'contact') {
          messageData.recipient = selectedChatData._id;
          socket.current.emit("sendMessage", messageData);
        } else if (selectedChatType === 'channel') {
          messageData.channelId = selectedChatData._id;
          socket.current.emit("sendChannelMessage", messageData);
        }

        setMessage("");
        event.target.value = '';
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setIsUploading(false);
      setFileUploadProgress(0);
    }
  };

  return (
    <div className="h-20 bg-[#111] px-4 md:px-8 flex items-center gap-2 md:gap-4 border-t-2 border-[#222]">
      <div className="flex-1 flex items-center bg-[#222] rounded-xl px-4 py-2 gap-2 md:gap-4">
        <input
          type="text"
          className="flex-1 bg-transparent text-white text-base focus:outline-none placeholder:text-gray-400"
          placeholder="Type a message"
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => { if(e.key === "Enter") handleSendMessage() }}
        />
        <button
          className="text-gray-400 hover:text-white transition duration-300"
          onClick={handleAttachementClick}
        >
          <GrAttachment className="text-xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachementChange} />
        <div className="relative">
          <button
            className="text-gray-400 hover:text-white transition duration-300"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-xl" />
          </button>
          <div className="absolute bottom-14 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
              height={400}
              width={300}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-white hover:bg-gray-200 text-black p-3 md:p-4 rounded-xl transition duration-300 flex items-center justify-center"
        onClick={handleSendMessage}
      >
        <IoSend className="text-xl" />
      </button>
    </div>
  );
};

export default MessageBar;