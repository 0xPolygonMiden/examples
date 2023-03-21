import { HashRouter as Router, Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import CodingEnvironment from "./pages/CodingEnvironment";
import InstructionTable from "./pages/InstructionTable";
import ExplainerPage from "./pages/Explainer";
import React from "react";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
            <Route path="/" element={<CodingEnvironment />} />
            <Route path="/examples" element={<CodingEnvironment />} />
            <Route
              path="/instruction-set"
              element={<InstructionTable />}
            />
            <Route path="/explainer" element={<ExplainerPage />} />
            <Route path="*" element={<p>Path not resolved</p>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
