import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../../../../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatAnimationDefaultOptions, getColor } from "../../../../../../lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "../../../../../../lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "../../../../../../utils/constants";
import { StatusCodes } from "http-status-codes";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "../../../../../../store";

const NewDM = () => {
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const {setSelectedChatType, setSelectedChatData,setSelectedChatMessages} = useAppStore();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        console.log(response);
        if (response.status === StatusCodes.OK) {
          setSearchedContacts(response.data.data);
        } else {
          setSearchedContacts([]);
        }
      }
      else{
        setSearchedContacts([])
      }
    } catch (error) {
      console.log(error);
    }
  };
  const selectNewContact = (contact) => {
    setOpenNewContactModel(false)
    setSelectedChatType("contact")
    setSelectedChatData(contact)
    setSearchedContacts([]);
  }

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#111] border-none text-white w-[90vw] max-w-[400px] h-[500px] flex flex-col rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Please select a contact
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Search contacts"
              className="bg-[#222] text-white border border-[#222] placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {
            searchedContacts.length > 0 && (
               <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={() => selectNewContact(contact)}
                >
                  <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div
                          className={`uppercase h-full w-full text-lg flex items-center justify-center rounded-full ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.charAt(0)
                            : contact.email?.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? contact.firstName + " " + contact.lastName
                        : contact.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
            )
          }
          {searchedContacts.length <= 0 && (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie
                isClickToPauseDisabled={true}
                height={150}
                width={150}
                options={chatAnimationDefaultOptions}
              />
            </div>
          )}
          <div className="mt-6 flex justify-center">
            <DialogClose asChild>
              <Button className="bg-white text-black text-lg px-10 py-3 rounded-md hover:bg-gray-200">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDM;
