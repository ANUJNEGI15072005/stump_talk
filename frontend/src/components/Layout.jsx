import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Rightbar from "./Rightbar";
import Footer from "./Footer";

const Layout = () => {
    const location = useLocation();

    return (
        <>
            <div className="flex min-h-screen w-full ">
                <Sidebar activePage={location.pathname} className="w-1/5 min-h-screen fixed left-0 top-20" />
                <Navbar className="w-full fixed top-0 left-0 z-50 " />
                <Rightbar className="right-0 fixed min-h w-1/5 top-20" />
                <div className="  lg:ml-[20%] mt-16 lg:mt-20 lg:w-3/5 w-full">
                    <Outlet />
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default Layout;
