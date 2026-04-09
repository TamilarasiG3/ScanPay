import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const AdminAuthPage = ({ mode }) => {
  const [form, setForm] = useState({ name: '', shopName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = mode === 'signup' ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);
      login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <main className="container">
      <form className="panel" onSubmit={submit}>
        <h2>{mode === 'signup' ? 'Shop Owner Signup' : 'Admin Login'}</h2>
        {mode === 'signup' && (
          <>
            <input placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Shop name" required value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
          </>
        )}
        <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === 'signup' ? 'Create Account' : 'Login'}</button>
        {mode === 'signup' ? (
          <p>Already have an account? <Link to="/admin/login">Login</Link></p>
        ) : (
          <p>Need account? <Link to="/admin/signup">Signup</Link></p>
        )}
      </form>
    </main>
  );
};

export default AdminAuthPage;
