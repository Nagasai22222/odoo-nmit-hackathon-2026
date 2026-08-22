import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock checking local storage for an existing session on load
    const storedUser = localStorage.getItem('dayflow_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login logic
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // First check dynamically registered users
        const registeredUsers = JSON.parse(localStorage.getItem('dayflow_registered_users') || '[]');
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          setUser(foundUser);
          setRole(foundUser.role || 'employee');
          setIsAuthenticated(true);
          localStorage.setItem('dayflow_user', JSON.stringify(foundUser));
          resolve(foundUser);
        }
        else if (email === 'admin@dayflow.com') {
          const adminUser = { id: 1, name: 'Admin User', email, role: 'admin', employeeId: 'EMP-001' };
          setUser(adminUser);
          setRole('admin');
          setIsAuthenticated(true);
          localStorage.setItem('dayflow_user', JSON.stringify(adminUser));
          resolve(adminUser);
        } else if (email === 'employee@dayflow.com') {
          const empUser = { id: 2, name: 'John Doe', email, role: 'employee', employeeId: 'EMP-002' };
          setUser(empUser);
          setRole('employee');
          setIsAuthenticated(true);
          localStorage.setItem('dayflow_user', JSON.stringify(empUser));
          resolve(empUser);
        } else {
          reject(new Error('Invalid credentials. Check your email and password.'));
        }
      }, 1000);
    });
  };

  const register = async (userData) => {
    // Mock register
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = { ...userData, id: Date.now() };
        
        // Save to a registered list in local storage so they can actually log in later
        const existingUsers = JSON.parse(localStorage.getItem('dayflow_registered_users') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('dayflow_registered_users', JSON.stringify(existingUsers));
        
        // We DO NOT set isAuthenticated here. We just resolve, 
        // which simulates successful backend registration.
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('dayflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
