
import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  id: string;
  name: string;
  username: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (name: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem("finance-tracker-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("finance-tracker-user");
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("finance-tracker-users") || "[]");
    
    // Find the user with matching credentials
    const foundUser = users.find(
      (u: any) => u.username === username && u.password === password
    );
    
    if (foundUser) {
      // Create a user object without the password
      const loggedInUser = {
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username
      };
      
      setUser(loggedInUser);
      localStorage.setItem("finance-tracker-user", JSON.stringify(loggedInUser));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, username: string, password: string): Promise<boolean> => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("finance-tracker-users") || "[]");
    
    // Check if username already exists
    if (users.some((u: any) => u.username === username)) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      username,
      password
    };
    
    // Add to users list
    users.push(newUser);
    localStorage.setItem("finance-tracker-users", JSON.stringify(users));
    
    // Log user in automatically
    const loggedInUser = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username
    };
    
    setUser(loggedInUser);
    localStorage.setItem("finance-tracker-user", JSON.stringify(loggedInUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("finance-tracker-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
