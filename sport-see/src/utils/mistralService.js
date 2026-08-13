export async function generateTrainingPlan(goalData) {
  const token = localStorage.getItem('token');
  const API_BASE_URL = "http://localhost:8000/api"; // Assure-toi du port et du chemin

  const response = await fetch(`${API_BASE_URL}/training-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(goalData) 
  });

  // 1. On vérifie d'abord si le serveur a répondu avec du HTML (ex: 404 ou 500)
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const textError = await response.text();
    console.error("Réponse non-JSON reçue du serveur :", textError);
    throw new Error(`Le serveur a renvoyé du HTML (Statut: ${response.status}). Vérifie l'URL de l'API.`);
  }

  // 2. Si la réponse n'est pas OK mais est bien en JSON
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || 'Erreur lors de la génération.');
  }

  // 3. Réponse valide
  return await response.json();
}