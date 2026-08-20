import { useState, useEffect } from "react";
import { fetchUserActivities } from "../services/activityServices";

export const useUserActivities = (startDate, endDate) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(Boolean(startDate && endDate));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadActivities = async () => {
      if (!startDate || !endDate) {
        if (isMounted) {
          setData([]);
          setError(null);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const res = await fetchUserActivities(startDate, endDate);
        if (isMounted) {
          setData(res);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  return { data, loading, error };
};