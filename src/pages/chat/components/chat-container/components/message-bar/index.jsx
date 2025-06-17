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
  const {userInfo,selectedChatType, selectedChatData} = useAppStore();
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
}

const handleAttachementClick = () => {
  if(fileInputRef.current){
    fileInputRef.current.click()
  }
}
const handleAttachementChange = async(event) => {
  try {
    const file = event.target.files[0];
    if(file){
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post(UPLOAD_FILE_ROUTE,formData,{withCredentials:true})

      if(response.status === StatusCodes.OK && response.data.data.filePath){
        socket.current.emit("sendFile", {
      sender: userInfo.id,
      content: undefined,
      recipient: selectedChatData._id,
      messageType: 'file',
      fileUrl: response.data.data.filePath
    })
      }
    }
  } catch (error) {
    console.log(error);   
  }
}


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
