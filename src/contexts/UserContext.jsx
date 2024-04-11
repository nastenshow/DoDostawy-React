import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState([]);

  const updateUserRoles = (roles) => {
    setUserRoles(roles);
  };

  return (
    <UserContext.Provider value={{ userRoles, updateUserRoles }}>
      {children}
    </UserContext.Provider>
  );
};