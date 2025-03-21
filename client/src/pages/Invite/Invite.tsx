import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ReloadIcon, CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Building } from "lucide-react";

const Invite = () => {
  const { getToken } = useAuth();
  const axios = ax(getToken);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="border-slate-200 shadow-sm w-full max-w-md overflow-hidden">
        <div className="bg-indigo-600 h-2" />
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 rounded-full bg-indigo-50 p-4">
              {status === "loading" && <ReloadIcon className="w-8 h-8 text-indigo-600 animate-spin" />}
              {status === "success" && <CheckCircledIcon className="w-8 h-8 text-emerald-600" />}
              {status === "error" && <CrossCircledIcon className="w-8 h-8 text-red-600" />}
            </div>
            
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              {status === "loading" && "Processing Your Invitation"}
              {status === "success" && "Invitation Accepted"}
              {status === "error" && "Invitation Error"}
            </h2>
            
            <p className="text-slate-500 mb-6">
              {status === "loading" && "Please wait while we verify your access and set up your account..."}
              {status === "success" && "Your account is ready! Redirecting you to your dashboard..."}
              {status === "error" && errorMessage}
            </p>
            
            {status === "loading" && (
              <div className="space-y-3 w-full max-w-xs">
                <div className="h-2 bg-slate-200 rounded animate-pulse" />
                <div className="h-2 bg-slate-200 rounded animate-pulse w-5/6 mx-auto" />
                <div className="h-2 bg-slate-200 rounded animate-pulse w-4/6 mx-auto" />
              </div>
            )}
            
            <div className="mt-8 text-xs text-slate-400 flex items-center">
              <Building className="h-3 w-3 mr-1" />
              <span>CityGrid Management System</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invite;
