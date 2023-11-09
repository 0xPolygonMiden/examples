import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import PopoverManager from "../components/PopoverManager";
import useFileManager from "../hooks/useFileManager";

const MainLayout = () => {
    const { theme } = useTheme();
    

    return <>
        <div className="main">
            <Header />
            <Outlet />
        </div>
        <PopoverManager />
    </>;
};

export default MainLayout;