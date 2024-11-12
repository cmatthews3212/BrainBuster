import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../utils/auth';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

const Login = () => {
  const [login, { error }] = useMutation(LOGIN);
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: '', password: '' });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
      navigate('/')
    } catch (e) {
      console.error('Error logging in:', e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="container" style={{ backgroundColor: '#A7FFEB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-form" style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', width: '400px' }}>
        <h2 style={{ color: '#7E57C2', marginBottom: '1rem', textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formState.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formState.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button 
            type="submit"
            style={{ 
              backgroundColor: '#FF4081', 
              color: '#FFFFFF', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              width: '100%',
              marginBottom: '1rem'
            }}
          >
            Login
          </button>
          <div style={{ textAlign: 'center' }}>
            <Link to="/signup" style={{ color: '#7E57C2', textDecoration: 'none' }}>
              Need an account? Sign up →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
