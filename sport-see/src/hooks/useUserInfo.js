import { useEffect, useState } from "react";
import { fetchUserInfo } from "../services/userServices";

export const useUserInfo = (enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!enabled) {
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setLoading(true);
    setError(null);

    fetchUserInfo()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return { data, loading, error };
};
