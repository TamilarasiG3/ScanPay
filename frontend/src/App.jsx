import { Link, Route, Routes } from 'react-router-dom';
import AdminAuthPage from './pages/AdminAuthPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ShopPage from './pages/ShopPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => (
  <>
    <nav className="topnav">
      <Link to="/">ScanPay</Link>
      <div>
        <Link to="/admin/login">Admin</Link>
      </div>
    </nav>
    <Routes>
      <Route path="/" element={<main className="container"><section className="panel"><h1>ScanPay Billing</h1><p>Use Admin to create your shop and products.</p></section></main>} />
      <Route path="/admin/signup" element={<AdminAuthPage mode="signup" />} />
      <Route path="/admin/login" element={<AdminAuthPage mode="login" />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/shop/:shopSlug" element={<ShopPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
    </Routes>
  </>
);

export default App;
