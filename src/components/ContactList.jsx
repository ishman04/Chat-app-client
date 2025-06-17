import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "../store";
import { HOST } from "../utils/constants";
import { getColor } from "../lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
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
      {contacts.map((contact) => (
        <div
          key={contact._id}
          onClick={() => handleClick(contact)}
          className={`pl-6 py-3 transition-all duration-200 rounded-xl cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#681721] text-white"
              : "hover:bg-[#222] text-gray-300"
          }`}
        >
          <div className="flex gap-4 items-center">
            {!isChannel && (
              <Avatar className="h-11 w-11 rounded-full overflow-hidden bg-[#111] shadow-md">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
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
            <div className="text-base font-semibold truncate">
              {isChannel ? contact.name : contact.firstName || contact.email}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
