import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../../store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "../../../../../../utils/constants";
import { getColor } from "../../../../../../lib/utils";
import { IoArrowBack } from "react-icons/io5";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-20 border-b-2 border-[#2f303b] flex items-center justify-between px-4 md:px-8 lg:px-20">
      <div className="flex gap-3 sm:gap-5 items-center">
        <button className="md:hidden text-neutral-300" onClick={closeChat}>
          <IoArrowBack className="text-2xl" />
        </button>
        <div className="w-12 h-12 relative flex-shrink-0">
          {selectedChatType === 'contact' ? (
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData.image ? (
                <AvatarImage
                  src={selectedChatData.image}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div
                  className={`uppercase h-full w-full text-lg flex items-center justify-center rounded-full ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.charAt(0)
                    : selectedChatData.email?.charAt(0)}
                </div>
              )}
            </Avatar>
          ) : (
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-3xl font-bold bg-[#2a2a2a] text-white">
              #
            </div>
          )}
        </div>
        <div className="text-white text-base sm:text-lg font-medium">
          {selectedChatType === 'channel' && selectedChatData.name}
          {selectedChatType === 'contact' &&
            (selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email)}
        </div>
      </div>
      <div className="flex items-center justify-center gap-5">
        <button
          className="text-neutral-400 hover:text-white focus:border-none focus:outline-none duration-300 transition-all cursor-pointer"
          onClick={closeChat}
        >
          <RiCloseFill className="text-3xl hidden md:block" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;