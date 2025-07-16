import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DashBoard from './pages/Dashboard';
import Ongoing from './pages/Ongoing';
import Finish from './pages/Finish';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/ongoing" element={<Ongoing></Ongoing>} />
        <Route path="/finished" element={<Finish />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
