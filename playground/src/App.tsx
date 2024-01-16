import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CodingEnvironment from './pages/CodingEnvironment';
import InstructionTable from './pages/InstructionTable';
import ExplainerPage from './pages/Explainer';

function App() {
  return (
    <main className="bg-primary w-full h-full">
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<CodingEnvironment />} />
          <Route path="/examples" element={<CodingEnvironment />} />
          <Route path="/instruction-set" element={<InstructionTable />} />
          <Route path="/explainer" element={<ExplainerPage />} />
          <Route path="*" element={<p>Path not resolved</p>} />
        </Routes>
      </HashRouter>
    </main>
  );
}

export default App;
