import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "../store";
import { getColor } from "../lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
    unreadChats,
    removeUnreadChat,
  } = useAppStore();

  const handleClick = (contact) => {
    removeUnreadChat(contact._id);

    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        const isUnread = unreadChats.has(contact._id);

        return (
          <div
            key={contact._id}
            onClick={() => handleClick(contact)}
            className={`pl-6 py-3 transition-all duration-300 rounded-xl cursor-pointer flex justify-between items-center pr-5 ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#681721] text-white"
                : isUnread
                ? "bg-red-900/50 hover:bg-red-800/70 text-white font-semibold"
                : "hover:bg-[#222] text-gray-300"
            }`}
          >
            <div className="flex gap-4 items-center">
              {!isChannel && (
                <Avatar className="h-11 w-11 rounded-full overflow-hidden bg-[#111] shadow-md">
                  {contact.image ? (
                    <AvatarImage
                      src={contact.image}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div
                      className={`uppercase h-full w-full text-lg font-semibold flex items-center justify-center rounded-full ${getColor(
                        contact.color
                      )}`}
                    >
                      {contact.firstName
                        ? contact.firstName.charAt(0)
                        : contact.email?.charAt(0)}
                    </div>
                  )}
                </Avatar>
              )}
              {isChannel && (
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center text-4xl font-bold shadow-md ${
                    selectedChatData && selectedChatData._id === contact._id
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  #
                </div>
              )}

              <div className="text-base font-semibold truncate">
                {isChannel ? contact.name : `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.email}
              </div>
            </div>

            {isUnread && (
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;