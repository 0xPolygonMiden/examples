import { useState } from "react";
import MidenLogo from "./MidenLogo";
import useTheme from "../hooks/useTheme";


/** External links for the top navigation menu */
const navigation = {
    docs: { name: 'Documentation', href: 'https://wiki.polygon.technology/docs/miden/user_docs/assembly/main' },
    tools: { name: 'Developer Tools', href: 'https://0xpolygonmiden.github.io/miden-vm/tools/main.html' },
    home: { name: 'Homepage', href: 'https://polygon.technology/solutions/polygon-miden/' },
}

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const {theme, setTheme} = useTheme();

    return <>
        <header>
            <div className="brand">
                <a href={navigation.home.href}><MidenLogo className="brand" /></a>
                <h1>Polygon Miden <span>Playground</span></h1>
            </div>
            <div className={`menu ${!mobileMenuOpen && 'hidden'}`}>
                <div className="button"  onClick={e => setTheme(theme === 'dark' ? 'light': 'dark')}>
                    <i className={" fa fa-" + (theme === 'dark'? 'sun' : 'moon')}/>
                </div>
                <div className="button">
                    <i className=" fa fa-question" />
                </div>
                <a href={navigation.docs.href}>{navigation.docs.name}</a>
            </div>
            <b className="hamburger mobile-only"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen
                    ? <i className="fa fa-times" />
                    : <i className="fa fa-bars" />
                }
            </b>
        </header>
    </>
}

export default Header;
