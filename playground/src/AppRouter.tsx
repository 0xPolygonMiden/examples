import { Route, Routes } from "react-router"
import { BrowserRouter } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Playground from "./pages/Playground"

const AppRouter = () => {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={MainLayout}>
                    <Route path="/" Component={Playground} />
                    <Route path="/docs" Component={() => <h1>Docs</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
}

export default AppRouter;