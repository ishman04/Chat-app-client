import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../../../../../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "../../../../../../lib/api-client";
import { CREATE_CHANNEL_ROUTE, SEARCH_CONTACTS_ROUTES } from "../../../../../../utils/constants";
import { useAppStore } from "../../../../../../store";
import MultipleSelector from "@/components/ui/multipleselect";
import { StatusCodes } from "http-status-codes";
import { toast } from "sonner";

const CreateChannel = () => {
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const { addChannel } = useAppStore();

  const handleSearch = async (value) => {
    if (typeof value !== 'string' || value.trim().length < 1) {
      setSearchedContacts([]);
      return;
    }

    try {
      const response = await apiClient.post(
        SEARCH_CONTACTS_ROUTES,
        { searchTerm: value.trim() },
        { withCredentials: true }
      );

      if (response.status === StatusCodes.OK && response.data.data) {
        // --- THIS IS THE FIX ---
        // Transform the raw user data into the { value, label } format
        // that the MultipleSelector component expects.
        const contacts = response.data.data.map(contact => ({
          value: contact._id,
          label: contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email,
        }));
        setSearchedContacts(contacts);
      } else {
        setSearchedContacts([]);
      }
    } catch (err) {
      console.error("Failed to search contacts:", err);
      toast.error("Error searching for contacts.");
      setSearchedContacts([]);
    }
  };

  const createChannel = async () => {
    try {
      if (channelName.trim().length > 0 && selectedContacts.length > 1) {
        const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value)
        }, { withCredentials: true });

        if (response.status === StatusCodes.CREATED) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(false);
          addChannel(response.data.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <FaPlus
              onClick={() => setNewChannelModel(true)}
              className="text-neutral-400 text-opacity-90 hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white rounded-md shadow-lg">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#111] text-white border-none rounded-3xl shadow-2xl w-[90vw] max-w-md max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Create a new channel
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Name your channel and add members to start collaborating.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              placeholder="Channel name"
              className="bg-[#222] text-white border-none placeholder-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>

          <div className="mt-4">
            <MultipleSelector
              options={searchedContacts}
              onSearch={handleSearch}
              className="bg-[#222] border-none text-white placeholder-gray-400 [&>div]:border-none [&>div]:bg-[#222]"
              placeholder="Search and select members"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-sm leading-10 text-gray-500">
                  Type to search for contacts to add.
                </p>
              }
            />
          </div>

          <div className="mt-6">
            <Button
              className="w-full bg-white text-black font-semibold text-base py-3 rounded-md hover:bg-gray-200"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
