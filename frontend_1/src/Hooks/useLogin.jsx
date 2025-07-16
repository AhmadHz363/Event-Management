import { useState } from 'react';
import { login as loginAPI } from '../api/auth';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginAPI(email, password);
      // Optional: Save token/user in localStorage here if needed
      return user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
