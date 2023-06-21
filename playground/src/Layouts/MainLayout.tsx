import { useContext, useEffect } from "react";
import Header from "../components/Header";
import NavigationTabs from "../components/NavigationTabs";
import { ConfigContext } from "../contexts/ConfigProvider";
import Helmet from "react-helmet";
import Nav from "../components/Nav";

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
        {/* <div className="main"> */}
            <Header />
            <Nav />

            {/* <NavigationTabs /> */}

            <h1>This is a text</h1>
        {/* </div> */}
    </>;
};

export default MainLayout;