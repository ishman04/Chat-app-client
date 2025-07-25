import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "../../../../../../lib/utils";
import { useAppStore } from "../../../../../../store";
import { LOGOUT_ROUTE } from "../../../../../../utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../../lib/api-client";
import { toast } from "sonner";
import { StatusCodes } from "http-status-codes";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const handleLogout = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
      if (response.status === StatusCodes.OK) {
        setUserInfo(null);
        navigate('/auth');
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="h-20 w-full px-3 sm:px-5 flex items-center justify-between bg-neutral-900">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 relative flex-shrink-0">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={userInfo.image}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div
                className={`uppercase h-full w-full text-lg flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.email?.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div className="truncate hidden sm:block">
          {userInfo.firstName && userInfo.lastName && (
            <div className="text-slate-100 poppins-regular text-sm">{`${userInfo.firstName} ${userInfo.lastName}`}</div>
          )}
        </div>
      </div>
      <div className="flex gap-3 sm:gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-gray-400 text-xl hover:text-white"
                onClick={() => navigate('/profile')}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#1f1f1f] text-slate-100 px-2 py-1.5 mb-1.5 rounded-md shadow-lg text-sm font-medium"
            >
              <p>Edit profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-500 text-xl hover:text-red-400"
                onClick={handleLogout}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-[#1f1f1f] text-slate-100 px-2 py-1.5 mb-1.5 rounded-md shadow-lg text-sm font-medium"
            >
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;