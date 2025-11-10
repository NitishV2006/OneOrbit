
import { useState, useEffect, useCallback } from 'react';
import { User, NewUser } from '../types';
import { storageService } from '../services/storageService';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  signup: (newUser: NewUser) => Promise<boolean>;
  updateUser: (updatedUser: User) => Promise<void>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUserId = sessionStorage.getItem('one-orbit-user-id');
      if (currentUserId) {
        const users = storageService.getUsers();
        const currentUser = users.find(u => u.id === currentUserId);
        if (currentUser) {
          setUser(currentUser);
        }
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const login = useCallback(async (username: string, password?: string): Promise<boolean> => {
    const users = storageService.getUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem('one-orbit-user-id', foundUser.id);
      return true;
    }
    return false;
  }, []);
  
  const signup = useCallback(async (newUser: NewUser): Promise<boolean> => {
    const users = storageService.getUsers();
    if (users.some(u => u.username === newUser.username)) {
        alert('Username already exists!');
        return false;
    }
    
    const userWithId: User = { ...newUser, id: Date.now().toString() };
    const updatedUsers = [...users, userWithId];
    storageService.saveUsers(updatedUsers);
    storageService.initializeUserData(userWithId.id); // Create empty data entry
    
    setUser(userWithId);
    sessionStorage.setItem('one-orbit-user-id', userWithId.id);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('one-orbit-user-id');
  }, []);

  const updateUser = useCallback(async (updatedUser: User): Promise<void> => {
    const users = storageService.getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        storageService.saveUsers(users);
        setUser(updatedUser);
    }
  }, []);


  return { user, loading, login, logout, signup, updateUser };
};
