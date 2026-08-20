import { useState } from 'react';
// 1. On retire useNavigate car on ne change plus de page
import { useTrainingPlan } from '../../hooks/useTrainingPlan';

export default function PlanGenerator() {
  const { fetchPlan, loading, error } = useTrainingPlan();

  // Saisie locale des nouveaux paramètres de l'utilisateur
  const [userGoal, setUserGoal] = useState('Préparation Semi-marathon (21 km)');
  const [startDate, setStartDate] = useState('2026-08-03');

  // 2. État pour stocker et afficher le plan sur cette même page
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialise l'ancien plan s'il y en avait un
    setGeneratedPlan(null);

    // Envoi des choix et récupération du plan
    const plan = await fetchPlan({ userGoal, startDate });

    if (plan) {
      // 3. Au lieu de navigate(), on enregistre le résultat dans le state local
      setGeneratedPlan(plan);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Créer mon nouveau plan</h2>

      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Votre Objectif :</label>
          <input
            type="text"
            value={userGoal}
            onChange={(e) => setUserGoal(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date de début :</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#e60000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Génération en cours...' : 'Lancer la génération'}
        </button>
      </form>

      {/* 4. Affichage du plan généré directement sur la même page */}
      {generatedPlan && (
        <div style={{ marginTop: '2.5rem', borderTop: '2px solid #eee', paddingTop: '1.5rem' }}>
          <h3>🎉 Votre plan d'entraînement est prêt !</h3>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              borderRadius: '8px',
              overflowX: 'auto',
              maxHeight: '400px'
            }}
          >
            {JSON.stringify(generatedPlan, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}