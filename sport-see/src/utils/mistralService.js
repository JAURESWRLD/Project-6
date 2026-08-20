export async function generateTrainingPlan(goalData) {
  const storedUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("sportsee_user") || "null");
    } catch {
      return null;
    }
  })();

  const token = storedUser?.token || "";
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${API_BASE_URL}/training-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(goalData),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const textError = await response.text();
    console.error("Réponse non-JSON reçue du serveur :", textError);
    throw new Error(
      `Le serveur a renvoyé du HTML (Statut: ${response.status}). Vérifie l'URL de l'API.`
    );
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || errorData.error || "Erreur lors de la génération.");
  }

  return await response.json();
}
