import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import DashBoard from './pages/Dashboard';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
