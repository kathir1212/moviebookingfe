// src/hooks/useVerifyAdmin.js

import { useState, useEffect } from 'react';
import axios from 'axios';

function useVerifyAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("No token provided.");
      setLoading(false);
      return;
    }

    // Make a request to verify the admin status
    axios
      .get('/api/verify-admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Assuming response contains a property `isAdmin` to check the role
        if (response.data.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response ? err.response.data.message : "Something went wrong");
        setLoading(false);
      });
  }, []);

  return { isAdmin, loading, error };
}

export default useVerifyAdmin;
