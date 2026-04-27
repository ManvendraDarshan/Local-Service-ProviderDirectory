import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to LSPD</h1>
      <p>Local Service Provider Directory for Madhya Pradesh</p>
      <nav>
        <Link to="/auth">Login/Register</Link> | 
        <Link to="/search">Search Services</Link> | 
        <Link to="/dashboard">Provider Dashboard</Link> | 
        <Link to="/admin">Admin Panel</Link>
      </nav>
    </div>
  );
};

export default Home;