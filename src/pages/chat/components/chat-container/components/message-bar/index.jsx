import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react'
import { useAppStore } from "../../../../../../store";
import { useSocket } from "../../../../../../context/socketContext";
import { apiClient } from "../../../../../../lib/api-client";
import { UPLOAD_FILE_ROUTE } from "../../../../../../utils/constants";
import { StatusCodes } from "http-status-codes";



const MessageBar = () => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef()
  const fileInputRef = useRef();
  const socket = useSocket();
  const {userInfo,selectedChatType, selectedChatData, setIsUploading, setFileUploadProgress} = useAppStore();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false); 
  useEffect(()=> {
    function handleClickOutside(event){
        if(emojiRef.current && !emojiRef.current.contains(event.target)){
            setEmojiPickerOpen(false)
        }
        }
        
        document.addEventListener("mousedown",handleClickOutside);
        return () => {
            document.removeEventListener("mousedown",handleClickOutside);
    }
  },[])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    }

  const handleSendMessage = async () => {
  if (selectedChatType === 'contact') {
    console.log("📤 Sending message:", message);
    socket.current.emit("sendMessage", {
      sender: userInfo.id,
      content: message,
      recipient: selectedChatData._id,
      messageType: 'text',
      fileUrl: undefined
    });
    
    setMessage(""); // clear input after send
  }
  else if(selectedChatType==='channel'){
    socket.current.emit("sendChannelMessage",{
      sender: userInfo.id,
      content: message,
      messageType:'text',
      fileUrl: undefined,
      channelId: selectedChatData._id
    })
  }
}

const handleAttachementClick = () => {
  if(fileInputRef.current){
    fileInputRef.current.click()
  }
}
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
        setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
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
        content: message, // Include any text message along with the file
        messageType: 'file',
        fileUrl: response.data.data.filePath
      };

      if (selectedChatType === 'contact') {
        messageData.recipient = selectedChatData._id;
        socket.current.emit("sendMessage", messageData);
      } else if (selectedChatType === 'channel') {
        messageData.channelId = selectedChatData._id;
        socket.current.emit("sendChannelMessage", messageData);
      }

      setMessage("");
      event.target.value = ''; // Reset file input
    } else {
      throw new Error('Invalid server response');
    }
  } catch (error) {
    console.error("File upload failed:", error);
    setIsUploading(false);
    setFileUploadProgress(0);
    // Add user feedback here (toast notification, etc.)
  }
};


  return (
    <div className="h-[10vh] bg-[#111] px-8 flex items-center gap-4 border-t border-[#222]">
      <div className="flex-1 flex items-center bg-[#222] rounded-2xl px-4 py-3 gap-4">
        <input
          type="text"
          className="flex-1 bg-transparent text-white text-base focus:outline-none placeholder:text-gray-400"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-gray-400 hover:text-white transition duration-300"
          onClick={handleAttachementClick}
        >
          <GrAttachment className="text-xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachementChange}/>
        <button className="text-gray-400 hover:text-white transition duration-300"
        onClick={() => setEmojiPickerOpen(true)}
        >
          <RiEmojiStickerLine className="text-xl" />
        </button>
        
        <div className="absolute bottom-16 right-0 " ref={emojiRef}>
            <EmojiPicker
                theme= "dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSerach={false}
            />
        </div>
      </div>
      <button className="bg-white hover:bg-gray-200 text-black p-4 rounded-xl transition duration-300 flex items-center justify-center"
      onClick={handleSendMessage}
      >
        <IoSend className="text-xl" />
      </button>
    </div>
  );
};

export default MessageBar;
