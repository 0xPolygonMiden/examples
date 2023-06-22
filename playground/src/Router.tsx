import { HashRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import CodingEnvironment from "./pages/CodingEnvironment";

const Router = () => {
    return <>
        <HashRouter>
            <Routes>
                <Route path="" element={<MainLayout />}>
                    <Route path="" element={<CodingEnvironment />} />
                    {/* <Route path="" element={<CodingEnvironment />} */}
                    {/*
                    <Route path="/examples" element={<CodingEnvironment />} />
                    <Route path="/instruction-set" lement={<InstructionTable />} />
                    <Route path="/explainer" element={<ExplainerPage />} /> */}
                </Route>

                <Route path="*" element={<p>Path not resolved</p>} />
            </Routes>
        </HashRouter>
    </>
};
export default Router;