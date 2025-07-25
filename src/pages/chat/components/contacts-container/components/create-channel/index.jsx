import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "../../../lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACT_ROUTES,
} from "../../../utils/constants";
import { useAppStore } from "../../../store";
import { MultiSelect } from "@/components/ui/multi-select"; // Assuming the file is multi-select.jsx
import { StatusCodes } from "http-status-codes";
import { toast } from "sonner";

const CreateChannel = () => {
  const [newChannelModel, setNewChannelModel] = useState(false);
  // 1. Simplified state: Only one list for all contacts is needed.
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const { addChannel } = useAppStore();

  useEffect(() => {
    const getAllContactsForChannel = async () => {
      setIsLoadingContacts(true);
      try {
        const response = await apiClient.get(GET_ALL_CONTACT_ROUTES, {
          withCredentials: true,
        });

        if (response.status === StatusCodes.OK && response.data.data) {
          const formattedContacts = response.data.data.map((user) => ({
            label: user.label,
            value: user.value,
          }));
          setAllContacts(formattedContacts);
        }
      } catch (err) {
        console.error("Failed to load contacts:", err);
        toast.error("Failed to load contacts.");
      } finally {
        setIsLoadingContacts(false);
      }
    };

    // Fetch contacts only when the dialog is opened.
    if (newChannelModel) {
      getAllContactsForChannel();
    }
  }, [newChannelModel]);

  // 2. Removed the `handleSearch` function. It's not needed for client-side filtering.

  const createChannel = async () => {
    if (!channelName.trim()) {
      return toast.error("Channel name is required.");
    }
    if (selectedContacts.length < 2) {
      return toast.error("Please select at least two members.");
    }

    try {
      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value),
        },
        { withCredentials: true }
      );

      if (response.status === StatusCodes.CREATED) {
        setChannelName("");
        setSelectedContacts([]);
        setNewChannelModel(false);
        addChannel(response.data.data);
        toast.success("Channel created successfully.");
      }
    } catch (error) {
      console.error("Channel creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create channel.");
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
            <MultiSelect
              // 3. Pass the single source of truth for contacts here.
              options={allContacts}
              value={selectedContacts}
              onChange={setSelectedContacts}
              disabled={isLoadingContacts}
              className="bg-[#222] border-none text-white placeholder-gray-400 [&>div]:border-none [&>div]:bg-[#222]"
              placeholder={
                isLoadingContacts
                  ? "Loading contacts..."
                  : "Search and select members"
              }
              emptyIndicator={
                <p className="text-center text-sm leading-10 text-gray-500">
                  No matching contacts found.
                </p>
              }
            />
          </div>

          <div className="mt-6">
            <Button
              className="w-full bg-white text-black font-semibold text-base py-3 rounded-md hover:bg-gray-200"
              onClick={createChannel}
              // 4. Improved disabled logic for better UX.
              disabled={
                isLoadingContacts ||
                channelName.trim() === "" ||
                selectedContacts.length < 2
              }
            >
              {isLoadingContacts ? "Creating..." : "Create Channel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;