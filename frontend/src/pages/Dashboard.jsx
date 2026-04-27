import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', category: '', location_lat: '', location_lng: '', address: '', phone: ''
  });

  useEffect(() => {
    // Assuming we have a way to get user's services, but for simplicity, skip
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/services', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Service added!');
      setForm({ name: '', description: '', category: '', location_lat: '', location_lng: '', address: '', phone: '' });
    } catch (err) {
      alert('Error: ' + err.response.data.detail);
    }
  };

  return (
    <div>
      <h1>Provider Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Latitude"
          value={form.location_lat}
          onChange={(e) => setForm({ ...form, location_lat: e.target.value })}
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Longitude"
          value={form.location_lng}
          onChange={(e) => setForm({ ...form, location_lng: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <button type="submit">Add Service</button>
      </form>
      {/* List services here */}
    </div>
  );
};

export default Dashboard;