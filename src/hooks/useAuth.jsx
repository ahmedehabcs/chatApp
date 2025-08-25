import { useState, useEffect } from 'react';
import API from '../api/index.js';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await API.get('/auth/me');
        console.log("useAuth", res.data.user.publicKey);
        setUser(res.data.user.publicKey);
      } catch (error) {
        console.error('Failed to get current user:', error);
      } finally {
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  return { user, loading };
}