import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { toast } from "sonner";

const Onboarding = () => {
  const [name, setName] = useState("");
  const { getToken } = useAuth();
  const axios = ax(getToken);

  const handleContinue = () => {
    axios
      .put("/departments", { name })
      .then((res) => {
        if (res.data.data) {
          window.location.href = "/hod";
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-2">
      <h3>Welcome to CityGrid</h3>
      <Input
        placeholder="Enter your department name to continue"
        className="w-64"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleContinue}>Continue</Button>
    </div>
  );
};

export default Onboarding;
