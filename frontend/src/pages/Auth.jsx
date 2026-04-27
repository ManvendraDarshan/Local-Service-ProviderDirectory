import { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', email: '', role: 'customer' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:8000/token', new URLSearchParams({
          username: form.username,
          password: form.password
        }));
        localStorage.setItem('token', res.data.access_token);
        alert('Logged in!');
      } else {
        const res = await axios.post('http://localhost:8000/register', form);
        localStorage.setItem('token', res.data.access_token);
        alert('Registered!');
      }
    } catch (err) {
      alert('Error: ' + err.response.data.detail);
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        {!isLogin && (
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {!isLogin && (
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="customer">Customer</option>
            <option value="provider">Provider</option>
          </select>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
};

export default Auth;