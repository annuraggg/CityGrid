import { Outlet } from "react-router-dom";
import HodSidebar from "./../ui/HodSidebar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";

const Layout = () => {
  return (
    <>
      <SignedIn>
        <div className="flex gap-5">
          <HodSidebar />
          <div className="h-screen w-full overflow-y-scroll">
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
