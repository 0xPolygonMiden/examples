import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NavigationTabs from "./components/NavigationTabs";
import CodingEnvironment from "./pages/CodingEnvironment";
import InstructionTable from "./pages/InstructionTable";
import ExplainerPage from "./pages/Explainer";
import TxProofPage from "./pages/TxProof";

function App() {
  return (
    <main className="bg-gray-100">
      <HashRouter>
        <Header />
        <NavigationTabs />
        <Routes>
          <Route path="/" element={<CodingEnvironment />} />
          <Route path="/examples" element={<CodingEnvironment />} />
          <Route
            path="/instruction-set"
            element={<InstructionTable />}
          />
          <Route path="/explainer" element={<ExplainerPage />} />
          <Route path="/tx-proof" element={<TxProofPage />} />
          <Route path="*" element={<p>Path not resolved</p>} />
        </Routes>
      </HashRouter>
    </main>
  );
}

export default App;
