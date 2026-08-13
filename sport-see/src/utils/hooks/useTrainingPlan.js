import { useState } from 'react';
import { generateTrainingPlan } from '../mistralService'; 

export function useTrainingPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlan = async (goalData) => {
    setLoading(true);
    setError(null);

    try {
      // Appel de la fonction API fetch
      const plan = await generateTrainingPlan(goalData);
      return plan;
    } catch (err) {
      // Gestion propre de l'erreur pour la vue
      setError(err.message || "Erreur lors de la génération du plan.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchPlan, loading, error };
}