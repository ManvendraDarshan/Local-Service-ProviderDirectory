import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Search = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState({ category: '', lat: '', lng: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const params = {};
      if (search.category) params.category = search.category;
      if (search.lat && search.lng) {
        params.lat = search.lat;
        params.lng = search.lng;
      }
      const res = await axios.get('http://localhost:8000/services', { params });
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  return (
    <div>
      <h1>Search Services</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Category"
          value={search.category}
          onChange={(e) => setSearch({ ...search, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Latitude"
          value={search.lat}
          onChange={(e) => setSearch({ ...search, lat: e.target.value })}
        />
        <input
          type="number"
          placeholder="Longitude"
          value={search.lng}
          onChange={(e) => setSearch({ ...search, lng: e.target.value })}
        />
        <button type="submit">Search</button>
      </form>
      <div style={{ height: '400px' }}>
        <MapContainer center={[23.2599, 77.4126]} zoom={7} style={{ height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {services.map(service => (
            <Marker key={service.id} position={[service.location_lat, service.location_lng]}>
              <Popup>
                <strong>{service.name}</strong><br />
                {service.description}<br />
                Category: {service.category}<br />
                Verified: {service.is_verified ? 'Yes' : 'No'}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <ul>
        {services.map(service => (
          <li key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>Category: {service.category}</p>
            <p>Verified: {service.is_verified ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;