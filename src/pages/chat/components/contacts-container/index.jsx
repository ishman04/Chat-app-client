import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "../../../../lib/api-client";
import { GET_DM_CONTACT_ROUTES, GET_USER_CHANNELS_ROUTE } from "../../../../utils/constants";
import { useAppStore } from "../../../../store";
import ContactList from "../../../../components/ContactList";
import CreateChannel from "./components/create-channel";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "../../../../lib/utils";

// Define the static chatbot contact object. Its _id MUST match the one on the backend.
const chatbotContact = {
    _id: 'chatbot-gemini-id',
    firstName: 'ChatterBot',
    lastName: '(AI)',
    image: '/chatbot-avatar.png',
    color: 4,
};

const ContactsContainer = () => {
  const { 
    setDirectMessagesContacts, 
    directMessagesContacts, 
    channels, 
    setChannels,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_DM_CONTACT_ROUTES, { withCredentials: true });
        if (response.data.data) {
          // Set the contacts list from the API response
          setDirectMessagesContacts(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch contacts.", error);
        setDirectMessagesContacts([]); // On error, set to an empty list
      }
    };
    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, { withCredentials: true });
        if (response.data.data) {
          setChannels(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch channels.", error);
      }
    };
    
    getContacts();
    getChannels();
  }, [setDirectMessagesContacts, setChannels]);
  
  // A dedicated click handler for the chatbot element
  const handleChatbotClick = () => {
    setSelectedChatType('contact'); // It behaves like a contact
    setSelectedChatData(chatbotContact);
    // Clear previous messages if switching to the chatbot
    if (selectedChatData?._id !== chatbotContact._id) {
        setSelectedChatMessages([]);
    }
  };
  
  // Filter the chatbot out of the main contacts list to prevent duplication
  const userContacts = directMessagesContacts.filter(contact => contact._id !== chatbotContact._id);
  
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#111] border-r-2 border-[#222] w-full flex flex-col h-screen">
      <div className="p-4">
        {/* Chatter Logo Section */}
        <div className="flex items-center gap-2 sm:gap-4 mt-5">
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
            <svg width="100%" height="100%" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="black" strokeWidth="2" fill="white" />
              <path d="M20 22C20 19.8 21.8 18 24 18H40C42.2 18 44 19.8 44 22V34C44 36.2 42.2 38 40 38H32L25 44V38H24C21.8 38 20 36.2 20 34V22Z" fill="black" stroke="black" strokeLinejoin="round" />
              <circle cx="27" cy="28" r="2" fill="white" />
              <circle cx="32" cy="28" r="2" fill="white" />
              <circle cx="37" cy="28" r="2" fill="white" />
            </svg>
          </div>
          <div className="text-white text-2xl sm:text-3xl tracking-wide poppins-extrabold">
            Chatter
          </div>
        </div>
      </div>

      {/* --- START: NEW DEDICATED CHATBOT SECTION --- */}
      <div className="px-4 mt-4">
        <div 
            onClick={handleChatbotClick}
            className={`pl-6 py-3 transition-all duration-300 rounded-xl cursor-pointer flex justify-between items-center pr-5 border-2 ${
                selectedChatData?._id === chatbotContact._id 
                ? 'border-red-800 bg-[#681721] text-white' 
                : 'border-neutral-700 hover:border-neutral-500 text-gray-300'
            }`}
        >
            <div className="flex gap-4 items-center">
                <Avatar className="h-11 w-11 rounded-full overflow-hidden flex-shrink-0">
                    <AvatarImage src={chatbotContact.image} alt="chatbot-avatar" className="object-cover w-full h-full"/>
                </Avatar>
                <div className="text-base font-semibold truncate">
                    {chatbotContact.firstName}
                </div>
            </div>
        </div>
        <hr className="border-neutral-700 my-5" /> {/* Separator line */}
      </div>
      {/* --- END: NEW DEDICATED CHATBOT SECTION --- */}

      <div className="flex-1 overflow-y-auto scrollbar-hidden px-4">
        <div className="my-2">
          <div className="flex items-center justify-between pr-4 sm:pr-10">
            <Title text={"Direct Messages"} />
            <NewDM />
          </div>
          <div className="mt-2">
            {/* Pass the filtered list of only real users to ContactList */}
            <ContactList contacts={userContacts} />
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-4 sm:pr-10">
            <Title text={"Channels"} />
            <CreateChannel />
          </div>
          <div className="mt-2">
            <ContactList contacts={channels} isChannel={true} />
          </div>
        </div>
      </div>
      
      <ProfileInfo />
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-gray-400 pl-4 sm:pl-10 font-light text-xs sm:text-sm">
      {text}
    </h6>
  );
};

export default ContactsContainer;