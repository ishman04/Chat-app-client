import { useAppStore } from "../../../../store";
import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const TypingIndicator = () => {
  const { typingUsers, selectedChatData, userInfo } = useAppStore();

  if (!typingUsers.length || !selectedChatData) return null;

  const otherTypingUsers = typingUsers.filter(u => u.id !== userInfo.id);

  if(!otherTypingUsers.length) return null;
  const names = otherTypingUsers.map(u => u.firstName || 'User').join(', ');
  const verb = otherTypingUsers.length > 1 ? 'are' : 'is';
  return (
        <div className="h-8 px-4 md:px-8 flex items-center text-sm text-gray-400 italic">
            <div className="animate-pulse">
                {`${names} ${verb} typing...`}
            </div>
        </div>
    );

}

const ChatContainer = () => {
  return (
    <div className="flex-1 h-full bg-[#1c1d21] flex flex-col">
      <ChatHeader />
      <MessageContainer />
      <TypingIndicator />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;