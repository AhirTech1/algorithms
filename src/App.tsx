import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home, AlgorithmPage } from './pages';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="algorithm/:algorithmId" element={<AlgorithmPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
