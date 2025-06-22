import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "../../../../lib/api-client";
import { GET_DM_CONTACT_ROUTES, GET_USER_CHANNELS_ROUTE } from "../../../../utils/constants";
import { useAppStore } from "../../../../store";
import ContactList from "../../../../components/ContactList";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {

  const {setDirectMessagesContacts, directMessagesContacts,channels,setChannels} = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACT_ROUTES,{withCredentials:true})
      if(response.data.data){
        setDirectMessagesContacts(response.data.data);
      }
    }
    const getChannels = async() =>{
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE,{withCredentials:true})
      if(response.data.data){
        setChannels(response.data.data);
      }
    }
    getContacts();
    getChannels();
  },[])
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#111] border-r-2 border-[#222] w-full p-4">
      <div>
        <div className="flex items-center gap-4 mt-5">
          <div style={{ width: "64px", height: "64px" }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="black"
                strokeWidth="2"
                fill="white"
              />
              <path
                d="M20 22C20 19.8 21.8 18 24 18H40C42.2 18 44 19.8 44 22V34C44 36.2 42.2 38 40 38H32L25 44V38H24C21.8 38 20 36.2 20 34V22Z"
                fill="black"
                stroke="black"
                strokeLinejoin="round"
              />
              <circle cx="27" cy="28" r="2" fill="white" />
              <circle cx="32" cy="28" r="2" fill="white" />
              <circle cx="37" cy="28" r="2" fill="white" />
            </svg>
          </div>

          <div className="text-white text-3xl tracking-wide poppins-extrabold">
            Chatter
          </div>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Direct Messages"} />
          <NewDM />
      </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Channels"} />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-gray-400 pl-10 font-light text-sm">
      {text}
    </h6>
  );
};

export default ContactsContainer;
