import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../../store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { IoEllipsisHorizontal } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../../components/ui/dropdown-menu";
import {
  DELETE_CHANNEL_ROUTE,
  HOST,
  LEAVE_CHANNEL_ROUTE,
} from "../../../../../../utils/constants";
import { getColor } from "../../../../../../lib/utils";
import { IoArrowBack } from "react-icons/io5";
import { apiClient } from "../../../../../../lib/api-client";
import ChannelInfoModal from "../../../../../../components/ChannelInfoModel";
import { useState } from "react";

const ChatHeader = () => {
  const {
    closeChat,
    selectedChatData,
    selectedChatType,
    userInfo,
    removeChannel,
  } = useAppStore();
  const handleLeaveChannel = async () => {
    try {
      if (window.confirm("Are you sure you want to leave this channel?")) {
        const response = await apiClient.delete(
          LEAVE_CHANNEL_ROUTE(selectedChatData._id),
          { withCredentials: true }
        );
        if (response.status === 200) {
          removeChannel(selectedChatData._id);
          toast.success("You have left the channel.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to leave channel.");
    }
  };

  const handleDeleteChannel = async () => {
    try {
      if (
        window.confirm(
          "Are you sure you want to DELETE this channel? This action is irreversible."
        )
      ) {
        const response = await apiClient.delete(
          DELETE_CHANNEL_ROUTE(selectedChatData._id),
          { withCredentials: true }
        );
        if (response.status === 200) {
          // The socket event will handle removal for the admin too.
          toast.success("Channel deleted successfully.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete channel.");
    }
  };

  const isUserAdmin =
    selectedChatData?.admin?.toString() === userInfo.id?.toString();
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);

  return (
    <>
      <div className="h-20 border-b-2 border-[#2f303b] flex items-center justify-between px-4 md:px-8 lg:px-20">
        <div
          className="flex gap-3 sm:gap-5 items-center cursor-pointer"
          onClick={() => {
            if (selectedChatType === "channel") setShowParticipantsModal(true);
          }}
        >
          <button className="md:hidden text-neutral-300" onClick={closeChat}>
            <IoArrowBack className="text-2xl" />
          </button>
          <div className="w-12 h-12 relative flex-shrink-0">
            {selectedChatType === "contact" ? (
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
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" &&
              (selectedChatData.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.email)}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          {selectedChatType === "channel" && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <IoEllipsisHorizontal className="text-neutral-400 text-xl cursor-pointer hover:text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#111] border-neutral-700 text-white">
                {isUserAdmin ? (
                  <DropdownMenuItem
                    onClick={handleDeleteChannel}
                    className="text-red-500 hover:!bg-red-500 hover:!text-white cursor-pointer"
                  >
                    Delete Channel
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={handleLeaveChannel}
                    className="text-red-500 hover:!bg-red-500 hover:!text-white cursor-pointer"
                  >
                    Leave Channel
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <button
            className="text-neutral-400 hover:text-white focus:border-none focus:outline-none duration-300 transition-all cursor-pointer"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl hidden md:block" />
          </button>
        </div>
      </div>
      {selectedChatType === "channel" && (
        <ChannelInfoModal
          isOpen={showParticipantsModal}
          onClose={() => setShowParticipantsModal(false)}
        />
      )}
    </>
  );
};

export default ChatHeader;
