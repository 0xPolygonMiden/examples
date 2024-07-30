import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CodingEnvironment from './pages/CodingEnvironment';
import ExplainerPage from './pages/Explainer';

function App() {
  return (
    <main className="w-full h-screen">
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<CodingEnvironment />} />
          <Route path="/examples/:id" element={<CodingEnvironment />} />
          <Route path="/explainer" element={<ExplainerPage />} />
          <Route path="*" element={<p>Path not resolved</p>} />
        </Routes>
      </HashRouter>
    </main>
  );
}

export default App;
