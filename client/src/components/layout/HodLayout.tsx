import { Outlet } from "react-router-dom";
import HodSidebar from "./../ui/HodSidebar";

const Layout = () => {
  return (
    <div className="flex gap-5">
      <HodSidebar />
      <Outlet />
    </div>
  );
};

export default Layout;
