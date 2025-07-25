import React, { useEffect } from 'react';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';
import ChatContainer from './components/chat-container';

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast('Please setup profile to continue');
      navigate('/profile');
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-screen text-white bg-[#0e0e0e] overflow-hidden relative font-sans">
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-5 text-white">
          <h5 className="text-3xl md:text-5xl font-semibold animate-pulse">
            Uploading File
          </h5>
          <div className="text-lg md:text-2xl font-medium tracking-wide">
            {fileUploadProgress}%
          </div>
        </div>
      )}

      {isDownloading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-5 text-white">
          <h5 className="text-3xl md:text-5xl font-semibold animate-pulse">
            Downloading File
          </h5>
          <div className="text-lg md:text-2xl font-medium tracking-wide">
            {fileDownloadProgress}%
          </div>
        </div>
      )}

      <div className={`w-full md:w-auto ${selectedChatType !== undefined ? 'hidden md:flex' : 'flex'}`}>
        <ContactsContainer />
      </div>

      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <div className="flex-1 w-full md:w-auto">
          <ChatContainer />
        </div>
      )}
    </div>
  );
};

export default Chat;