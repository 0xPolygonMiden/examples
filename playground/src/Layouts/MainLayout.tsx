import { useContext, useEffect } from "react";
import Header from "../components/Header";
import { ConfigContext } from "../contexts/ConfigProvider";
import Helmet from "react-helmet";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const { darkmode } = useContext(ConfigContext);

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
    </>;
};

export default MainLayout;