import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../../../../../store";
import moment from "moment";
import { apiClient } from "../../../../../../lib/api-client";
import {
  GET_ALL_MESSAGES_ROUTES,
  GET_CHANNEL_MESSAGES,
} from "../../../../../../utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowDown, IoMdClose } from "react-icons/io";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.data) {
          setSelectedChatMessages(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.data) {
          setSelectedChatMessages(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === 'contact') {
        getMessages();
      } else if (selectedChatType === 'channel') {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const downloadFile = async (message) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    const fileUrl = message.fileUrl;

    try {
      const response = await apiClient.get(fileUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileDownloadProgress(percentCompleted);
          }
        },
      });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;

      const filename = message.originalFilename || fileUrl.split('/').pop();
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setIsDownloading(false);
        setFileDownloadProgress(0);
      }, 100);

    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
  };

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderDMMessages = (message) => {
    const senderId = message?.sender?._id || message?.sender;
    const userId = userInfo?._id || userInfo?.id;
    const isSentByUser = Boolean(senderId && userId && senderId === userId);

    return (
      <div
        className={`flex w-full mb-4 ${
          isSentByUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[75%] flex flex-col gap-1 ${
            isSentByUser ? "items-end" : "items-start"
          }`}
        >
          {message.messageType === "text" && (
            <div
              className={`px-4 py-2 rounded-2xl text-base shadow-md whitespace-pre-wrap ${
                isSentByUser
                  ? "bg-white text-black rounded-br-none"
                  : "bg-[#222] text-white rounded-bl-none border border-white/10"
              }`}
            >
              {message.content}
            </div>
          )}

          {message.messageType === "file" && (
            <div
              className={`rounded-2xl text-md shadow-md overflow-hidden ${
                isSentByUser
                  ? "bg-white text-black rounded-br-none"
                  : "bg-[#1e1e1e] text-white rounded-bl-none border border-white/10"
              }`}
            >
              {checkIfImage(message.originalFilename || message.fileUrl) ? (
                <div className="relative">
                  <img
                    src={message.fileUrl}
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full object-cover max-h-80 cursor-pointer"
                    onClick={() => {
                      setShowImage(true);
                      setImageURL(message.fileUrl);
                    }}
                  />
                  {message.content && (
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-black/50 backdrop-blur-sm">
                      <p className="text-white text-sm">{message.content}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 px-4 py-3">
                    <span className="text-3xl bg-black/20 text-white rounded-full p-3">
                      <MdFolderZip />
                    </span>
                    <span className="truncate max-w-36 sm:max-w-48 text-sm font-medium">
                      {message.originalFilename || message.fileUrl.split("/").pop()}
                    </span>
                    <button
                      className="bg-black/30 text-white p-3 text-2xl rounded-full hover:bg-black/60 cursor-pointer"
                      onClick={() => downloadFile(message)}
                    >
                      <IoMdArrowDown />
                    </button>
                  </div>
                  {message.content && (
                    <div className="px-4 pb-2 pt-1 text-sm">{message.content}</div>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            className={`text-xs text-gray-400 ${
              isSentByUser ? "text-right" : "text-left"
            }`}
          >
            {moment(message.timestamp).format("hh:mm A")}
          </div>
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    const senderId = typeof message.sender === "object" ? message.sender._id : message.sender;
    const userId = userInfo?._id || userInfo?.id;
    const isSentByUser = senderId?.toString() === userId?.toString();

    const senderName = isSentByUser
      ? "You"
      : typeof message.sender === "object"
      ? message.sender.firstName || message.sender.email || "Unknown"
      : "Unknown";

    return (
      <div
        className={`flex w-full mb-4 ${
          isSentByUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[75%] flex flex-col gap-1 ${
            isSentByUser ? "items-end" : "items-start"
          }`}
        >
          <span className="text-xs text-gray-400 mb-1">{senderName}</span>

          {message.messageType === "text" && (
            <div
              className={`px-4 py-2 rounded-2xl text-base shadow-md whitespace-pre-wrap ${
                isSentByUser
                  ? "bg-white text-black rounded-br-none"
                  : "bg-[#222] text-white rounded-bl-none border border-white/10"
              }`}
            >
              {message.content}
            </div>
          )}

          {message.messageType === "file" && (
            <div
              className={`rounded-2xl text-md shadow-md overflow-hidden ${
                isSentByUser
                  ? "bg-white text-black rounded-br-none"
                  : "bg-[#1e1e1e] text-white rounded-bl-none border border-white/10"
              }`}
            >
              {checkIfImage(message.originalFilename || message.fileUrl) ? (
                 <div className="relative">
                  <img
                    src={message.fileUrl}
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full object-cover max-h-80 cursor-pointer"
                    onClick={() => {
                      setShowImage(true);
                      setImageURL(message.fileUrl);
                    }}
                  />
                  {message.content && (
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-black/50 backdrop-blur-sm">
                      <p className="text-white text-sm">{message.content}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 px-4 py-3">
                    <span className="text-3xl bg-black/20 text-white rounded-full p-3">
                      <MdFolderZip />
                    </span>
                    <span className="truncate max-w-36 sm:max-w-48 text-sm font-medium">
                      {message.originalFilename || message.fileUrl.split("/").pop()}
                    </span>
                    <button
                      className="bg-black/30 text-white p-3 text-2xl rounded-full hover:bg-black/60 cursor-pointer"
                      onClick={() => downloadFile(message)}
                    >
                      <IoMdArrowDown />
                    </button>
                  </div>
                  {message.content && (
                    <div className="px-4 pb-2 pt-1 text-sm">{message.content}</div>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            className={`text-xs text-gray-400 ${
              isSentByUser ? "text-right" : "text-left"
            }`}
          >
            {moment(message.timestamp).format("hh:mm A")}
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          No messages yet. Start the conversation!
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
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:px-8 bg-[#111] text-white h-full scrollbar-hidden">
      {renderMessages()}
      <div ref={scrollRef}></div>

      {showImage && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative">
            <img
              src={imageURL}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-3">
              <button
                onClick={() => downloadFile({ fileUrl: imageURL, originalFilename: imageURL.split('/').pop() })}
                className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80"
              >
                <IoMdArrowDown size={22} />
              </button>
              <button
                onClick={() => setShowImage(false)}
                className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80"
              >
                <IoMdClose size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;