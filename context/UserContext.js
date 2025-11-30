import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const setUser = (userData) => {
    setUsuario(userData);
  };

  const login = (userData) => {
    setUsuario(userData);
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <UserContext.Provider value={{ usuario, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};
