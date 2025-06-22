import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../../store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "../../../../../../utils/constants";
import { getColor } from "../../../../../../lib/utils";

const ChatHeader = () => {

    const {closeChat, selectedChatData,selectedChatType} = useAppStore();

    return <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
        <div className="flex gap-5 items-center justify-between w-full">
            <div className="flex items-center justify-center gap-3">
                 <div className="w-12 h-12 relative">
                  {
                    selectedChatType === 'contact' ?
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                      {selectedChatData.image ? (
                        <AvatarImage
                          src={`${HOST}/${selectedChatData.image}`}
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
                    </Avatar> :
                    <>
                      <div
                className={`h-11 w-11 rounded-full flex items-center justify-center text-4xl font-bold shadow-md bg-white text-black`}
              >
                #
              </div>
                    </>
                      
                  }
                    
                  </div>
                  <div>
                    {selectedChatType==='channel' && selectedChatData.name}
                    {selectedChatType==='contact' &&
                    selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}
                  </div>
            </div>
            <div className="flex items-center justify-center gap-5">
                <button className="text-neutral-500 focus-border-none focus-outline-none focus-text-white duration-300 transition-all cursor-pointer" onClick={closeChat}>
                    <RiCloseFill className="text-3xl"/>
                </button>

            </div>
        </div>
        
    </div>
}

export default ChatHeader;