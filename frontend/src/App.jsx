import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register'; // Admin Register
import UserRegister from './pages/UserRegister'; // User Register
import CustomerManagement from './pages/CustomerManagement'; // Admin Dashboard
import UserDashboard from './pages/UserDashboard'; // User Dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/dashboard" element={<CustomerManagement />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;