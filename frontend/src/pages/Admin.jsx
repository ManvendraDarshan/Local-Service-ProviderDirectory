import { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchUnverifiedServices();
  }, []);

  const fetchUnverifiedServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/admin/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyService = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/admin/services/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Service verified!');
      fetchUnverifiedServices();
    } catch (err) {
      alert('Error: ' + err.response.data.detail);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Unverified Services</h2>
      <ul>
        {services.map(service => (
          <li key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <button onClick={() => verifyService(service.id)}>Verify</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;