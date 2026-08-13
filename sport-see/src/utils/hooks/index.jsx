import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export const useFetch = (url, options = {}) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: user?.token ? `Bearer ${user.token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, user]);

  return { data, loading, error };
};
