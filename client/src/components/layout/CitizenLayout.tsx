import { Outlet } from "react-router-dom";
import CitizenSidebar from "./../ui/CitizenSidebar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";

const Layout = () => {
  return (
    <>
      <SignedIn>
        <div className="flex gap-5">
          <CitizenSidebar />
          <div className="h-screen overflow-y-auto w-full">
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