import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

const Invite = () => {
  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .get("/invites/onboard-user")
      .then((res) => {
        if (res.data.data.role === "hod") {
          if (res.data.data.isOnboarded) window.location.href = "/hod";
          else window.location.href = "/onboarding";
        } else if (res.data.data.role === "project-manager")
          window.location.href = "/pm";
      })
      .catch(() => {});
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <ReloadIcon className="w-10 h-10 text-gray-400 animate-spin" />
    </div>
  );
};

export default Invite;
