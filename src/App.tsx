import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import Generating from './pages/Generating';
import Preview from './pages/Preview';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/generating" element={<Generating />} />
        <Route path="/preview/:id" element={<Preview />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
