import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { UserContext } from '../../contexts/UserContext';

const secretKey = import.meta.env.VITE_SECRET_KEY;
const apiUrl = import.meta.env.VITE_LINK;

const decryptToken = (encryptedToken) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
  
    return null;
  }
};

const clearCookie = (name) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

const checkTokenValidity = async (token) => {
  try {
    const response = await axios.get(`${apiUrl}api/token/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200;
  } catch (error) {
    
    return false;
  }
};

const getUserRoles = async (token) => {
  try {
    const response = await axios.get(`${apiUrl}api/token/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.roles.map(role => role.name);
  } catch (error) {
   
    return [];
  }
};

const navigateBasedOnRole = (currentUserRoles, navigate, location) => {
  if (currentUserRoles.includes('main-admin')) {
    navigate('/dashboard-admin/zamowienia');
  } else if (currentUserRoles.includes('admin-restaurant')) {
    navigate('/dashboard-admin-restaurant/zamowienia');
  } else {
    navigate('/login', { state: { from: location }, replace: true }); // Переведення на сторінку "Не авторизовано"
  }
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { userRoles, updateUserRoles } = useContext(UserContext);

  useEffect(() => {
    let intervalId;

    const validateTokenAndRole = async () => {
      const encryptedToken = document.cookie.replace(/(?:(?:^|.*;\s*)user_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
      if (!encryptedToken) {
        clearCookie('user_token'); // Clear the cookie if not found
        navigate('/login', { state: { from: location }, replace: true });
        return;
      }
    
      const token = decryptToken(encryptedToken);
      if (token && await checkTokenValidity(token)) {
        const roles = await getUserRoles(token);
        
        if (roles.length === 0) {
         
          clearCookie('user_token'); // Clear the cookie if no roles are found
          navigate('/login', { state: { from: location }, replace: true });
          clearInterval(intervalId);
          return;
        }
    
        updateUserRoles(roles);
    
        const hasPermission = roles.some(role => allowedRoles.includes(role));
        if (!hasPermission) {
          navigateBasedOnRole(roles, navigate, location);
          clearInterval(intervalId);
        } else {
          setIsValidating(false); // Користувач має дозвіл, зупинити валідацію
        }
      } else {
      
        clearCookie('user_token'); // Clear the cookie if the token is invalid or expired
        navigate('/login', { state: { from: location }, replace: true });
        clearInterval(intervalId);
      }
    };

    validateTokenAndRole();

    // Set interval to repeat every 20 seconds
    intervalId = setInterval(validateTokenAndRole, 20000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedRoles, navigate, location]);

  if (isValidating) {
    return null; // You might want to render a loading spinner or similar here
  }

  return children;
};

export default PrivateRoute;