import React, { useState, useEffect } from 'react';
import './assets/LoginForm.css';

import Navbar from './Admin-DoDostawy/components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Footer from './components-all/Footer';
import Cookies from 'js-cookie';


const secretKey = import.meta.env.VITE_SECRET_KEY;

const apiUrl = import.meta.env.VITE_LINK;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState([]);
  



  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = Cookies.get('user_token'); // Отримання токену з кукі
      if (token) {
        try {
          const decryptedToken = CryptoJS.AES.decrypt(token, secretKey).toString(CryptoJS.enc.Utf8);
          const config = {
            headers: { Authorization: `Bearer ${decryptedToken}` }
          };
          const validationResponse = await axios.get(`${apiUrl}api/token/validate`, config);
          console.log(validationResponse)
          if (validationResponse.status === 200) {
            // Якщо токен дійсний, робимо редирект на /dashboard-admin/zamowienia
            navigate("/dashboard-admin/zamowienia");
          }
        } catch (error) {
          console.error("Token validation error", error);
          // Не робимо нічого, користувач залишиться на сторінці логіну
        }
      }
    };
  
    checkTokenValidity();
  }, [navigate]);
  
  const handleLogin = async (event) => {
    // Prevent default form submission
    event.preventDefault();
    
    setLoading(true);
    setError('');
    const loginData = { email, password };
  
    try {
      const response = await axios.post(`${apiUrl}api/login`, loginData);
      console.log(response)
     
      // Save the encrypted token in a cookie
      const userData = {
        email: response.data.user.email,
        short_name: response.data.user.short_name,
        id: response.data.user.id,
        // Додайте інші дані користувача, які вам потрібні, у цей об'єкт
      };
      const userDataJSON = JSON.stringify(userData);
      
  
      // Збережіть рядок JSON користувача у куках
      Cookies.set('user_data', userDataJSON, { expires: 31, path: '/' });
  
      // Збережіть токен у куках
      const encryptedToken = CryptoJS.AES.encrypt(response.data.access_token, secretKey).toString();
      Cookies.set('user_token', encryptedToken, { expires: 7, path: '/' });
  

      // Save user roles to state
      const roles = response.data.roles;
      const userStatus = response.data.user.statuses; // Assuming this is an array of strings based on your message

      setUserRoles(roles);

      if (roles.includes('admin-restaurant') && userStatus === 'Nie Działa') {
        setError('Dostęp zabroniony. Twój status to Nie Działa.');
        return;
      }
      
      // Navigate based on the user's role
      if (roles.includes('main-admin')) {
        navigate('/dashboard-admin/zamowienia');
      } else if (roles.includes('admin-restaurant')) {
        navigate('/dashboard-admin-restaurant/zamowienia');
      } else {
        setError('No valid role found.');
      }
  
    } catch (error) {
      console.error('Błąd logowania', error);
      setError('Błąd logowania. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="centering-container">
        <div className="box">
          <form onSubmit={handleLogin}>
            {/* Email input */}
            <div className="overlap-group" style={{ marginBottom: '10px' }}>
              <input
                className="gmail-com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
              />
              <FontAwesomeIcon className="icon-envelope" icon={faEnvelope} style={{ paddingRight: '9px' }}/>
              <div className="text-wrapper">Adress e-mail</div>
              <div className="line"></div>
            </div>
            
            {/* Password input */}
            <div className="overlap-group">
              <input
                type="password"
                className="gmail-com"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
              />
              <FontAwesomeIcon className="icon-envelope" icon={faLock} style={{ paddingRight: '9px' }}/>
              <div className="text-wrapper">Hasło</div>
              <div className="line"></div>
            </div>
            
            {/* Login button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Ładowanie...' : 'Zaloguj sie'}
            </button>
            
            {/* Error message */}
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Login;