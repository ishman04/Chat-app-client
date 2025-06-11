import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "../../../../../../lib/utils";
import { useAppStore } from "../../../../../../store";
import { HOST } from "../../../../../../utils/constants";

const ProfileInfo = () => {
  const { userInfo } = useAppStore();
  return (
    <div className="absolute bottom-0 left-0 h-16 w-full px-5 flex items-center justify-start bg-neutral-900">
      <div className="flex gap-3 items-center justify-center">
        <div className=" w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
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
        <div>
            {
                userInfo.firstName && userInfo.lastName ? <div className="text-slate-100 poppins-light ">{`${userInfo.firstName} ${userInfo.lastName}`}</div> : ""
            }
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
