import { Outlet } from "react-router-dom";
import PmSidebar from "../ui/PmSidebar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";

const Layout = () => {
  return (
    <>
      <SignedIn>
        <div className="flex gap-5">
          <PmSidebar />
          <div className="h-screen w-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Layout;
