import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const ChatContainer = () => {
  return (
    <div className="flex-1 h-full bg-[#1c1d21] flex flex-col">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;