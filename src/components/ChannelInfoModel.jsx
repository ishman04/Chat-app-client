// client/src/components/ChannelInfoModal.jsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { apiClient }from "@/lib/api-client";
import { CHANNEL_ROUTES } from "@/utils/constants";

const ChannelInfoModal = ({ isOpen, onClose }) => {
  const { selectedChatData, userInfo, removeChannelMember } = useAppStore();

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        const response = await apiClient.delete(
          `${CHANNEL_ROUTES}/${selectedChatData._id}/remove-member/${memberId}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          removeChannelMember(selectedChatData._id, memberId);
          toast.success("Member removed successfully.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove member.");
      }
    }
  };

  const isUserAdmin = selectedChatData?.admin?._id.toString() === userInfo.id.toString();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111] text-white border-none">
        <DialogHeader>
          <DialogTitle>Participants of "{selectedChatData?.name}"</DialogTitle>
          <DialogDescription>
            {selectedChatData?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-4">
          {selectedChatData?.members?.map((member) => (
            <div key={member._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {member.image ? (
                    <AvatarImage src={member.image} alt="profile" className="object-cover w-full h-full" />
                  ) : (
                    <div className={`uppercase h-10 w-10 text-sm flex items-center justify-center rounded-full ${getColor(member.color)}`}>
                      {member.firstName ? member.firstName.charAt(0) : member.email.charAt(0)}
                    </div>
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">
                    {member.firstName} {member.lastName}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {member._id === selectedChatData?.admin?._id ? "Admin" : "Member"}
                  </div>
                </div>
              </div>
              {isUserAdmin && member._id !== userInfo.id && (
                <Button size="sm" variant="destructive" onClick={() => handleRemoveMember(member._id)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelInfoModal;