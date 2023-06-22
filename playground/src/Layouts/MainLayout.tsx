import { useContext, useEffect } from "react";
import Header from "../components/Header";
import { ConfigContext } from "../contexts/ConfigProvider";
import Helmet from "react-helmet";
import { Outlet } from "react-router-dom";
import ConfigWindow from "../components/ConfigWindow";
import PopoverManager from "../components/PopoverManager";

const MainLayout = () => {
    const { darkmode,  } = useContext(ConfigContext);

    useEffect(() => {
        //set data-theme attribute on html element
        document.documentElement.setAttribute('data-theme', darkmode ? 'dark' : 'light');
    }, [darkmode]);


    return <>
        <Helmet>
            <script src="https://kit.fontawesome.com/be33eca35b.js" crossOrigin="anonymous"></script>
        </Helmet>
        <Header />
        <Outlet />
        <PopoverManager />
        <ConfigWindow />
    </>;
};

export default MainLayout;