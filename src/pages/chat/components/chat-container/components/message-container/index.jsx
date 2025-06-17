import { useEffect, useRef } from "react";
import { useAppStore } from "../../../../../../store";
import moment from "moment";
import {apiClient} from '../../../../../../lib/api-client'
import { GET_ALL_MESSAGES_ROUTES } from "../../../../../../utils/constants";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages
  } = useAppStore();

  useEffect(() =>{
    const getMessages = async() => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTES,{id:selectedChatData._id},{withCredentials:true})
        if(response.data.data){
          setSelectedChatMessages(response.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if(selectedChatData._id){
      if(selectedChatType==='contact'){
        getMessages();
      }
    }
  },[selectedChatData,selectedChatType,setSelectedChatMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderDMMessages = (message) => {
    const senderId = message?.sender?._id || message?.sender;
    const userId = userInfo?._id || userInfo?.id;
    const isSentByUser = Boolean(senderId && userId && senderId === userId);

    return (
      <div
        className={`flex w-full mb-4 ${isSentByUser ? "justify-end" : "justify-start"}`}
      >
        <div className={`max-w-[75%] flex flex-col gap-1 ${isSentByUser ? "items-end" : "items-start"}`}>
          {message.messageType === "text" && (
            <div
              className={`px-6 py-2 rounded-2xl text-md shadow-md whitespace-pre-wrap
              ${isSentByUser
                ? "bg-white text-black rounded-br-none"
                : "bg-[#222] text-white rounded-bl-none"
              }`}
            >
              {message.content}
            </div>
          )}
          <div
            className={`text-[10px] text-gray-400 ${isSentByUser ? "text-right" : "text-left"}`}
          >
            {moment(message.timestamp).format("hh:mm A")}
          </div>
        </div>
      </div>
    );
  };

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i
    return imageRegex.test(filePath)
  }

  const renderMessages = () => {
    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No messages yet
        </div>
      );
    }

    let lastDate = null;

    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id || message.timestamp}>
          {showDate && (
            <div className="text-center text-gray-500 text-xs my-6">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:px-8 bg-[#111] text-white h-full scrollbar-hidden">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
