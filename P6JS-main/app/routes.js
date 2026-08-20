const express = require("express");
const jwt = require("jsonwebtoken");

const users = require("./data.json");

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

const getUserById = (userId) => {
  return users.find((user) => user.id === userId);
};

const router = express.Router();

const { authenticateToken, generateToken } = require("./middleware");

/**
 * POST /api/login
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }

  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  return res.json({
    token,
    userId: user.id,
  });
});

/**
 * GET /api/user-info
 */
router.get("/user-info", authenticateToken, (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user;
  const user = getUserById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const runningData = user.runningData || [];

  const totalDistance = runningData.reduce(
    (sum, session) => sum + session.distance,
    0
  ).toFixed(1);
  const totalSessions = runningData.length;
  const totalDuration = runningData.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const totalCalories = runningData.reduce(
    (sum, session) => sum + (session.caloriesBurned || 0),
    0
  );
  const sortedDates = runningData
    .map((session) => new Date(session.date))
    .sort((a, b) => a - b);
  const totalRestDays = sortedDates.length
    ? Math.max(
        Math.floor(
          (sortedDates[sortedDates.length - 1] - sortedDates[0]) /
            (1000 * 60 * 60 * 24)
        ) + 1 - runningData.length,
        0
      )
    : 0;

  const userProfile = {
    firstName: user.userInfos.firstName,
    lastName: user.userInfos.lastName,
    createdAt: user.userInfos.createdAt,
    age: user.userInfos.age,
    gender: user.userInfos.gender,
    weight: user.userInfos.weight,
    height: user.userInfos.height,
    profilePicture: user.userInfos.profilePicture,
  };

  return res.json({
    profile: userProfile,
    statistics: {
      totalDistance,
      totalSessions,
      totalDuration,
      totalCalories,
      totalRestDays,
    },
  });
});

/**
 * GET /api/user-activity
 */
router.get("/user-activity", authenticateToken, (req, res) => {
  const { startWeek, endWeek } = req.query;
  
  if (!startWeek || !endWeek) {
    return res.status(400).json({ message: "startWeek and endWeek are required" });
  }

  const userId = req.user?.userId || req.user?.id || req.user;
  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const runningData = user.runningData || [];

  const startDate = new Date(startWeek);
  const endDate = new Date(endWeek);
  const now = new Date();
  
  const filteredSessions = runningData.filter((session) => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= endDate && sessionDate <= now;
  });

  const sortedSessions = filteredSessions.sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  return res.json(sortedSessions);
});

/**
 * POST /api/training-plan
 */
router.post("/training-plan", authenticateToken, async (req, res) => {
  try {
    const { userGoal, startDate } = req.body;

    if (!userGoal || !startDate) {
      return res.status(400).json({ message: "userGoal and startDate are required" });
    }

    // Récupération sécurisée du userId extrait par authenticateToken
    const userId = req.user?.userId || req.user?.id || req.user;
    const user = getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const runningData = user.runningData || [];

    const lastRuns = runningData
      .slice(-3)
      .map((session) => ({
        date: session.date,
        distKm: session.distance,
        pace: session.pace || "N/A",
      }));

    const totalDist = runningData.reduce((sum, s) => sum + s.distance, 0);
    const avgWeeklyKm = runningData.length > 0 ? (totalDist / runningData.length).toFixed(1) : 0;
    const longestRunKm = runningData.length > 0 ? Math.max(...runningData.map((s) => s.distance)) : 0;

    const snapshot = {
      userGoal,
      startDate,
      recentStats: {
        avgWeeklyKm: Number(avgWeeklyKm),
        avgPace: runningData.length > 0 ? runningData[runningData.length - 1]?.pace || "5'30/km" : "Non spécifiée",
        longestRunKm,
      },
      lastRuns,
    };

    const promptContent = `
### PROFIL UTILISATEUR
- Objectif: ${snapshot.userGoal}
- Date début: ${snapshot.startDate}
- Stats globales: ${snapshot.recentStats.avgWeeklyKm} km/semaine | Allure hab: ${snapshot.recentStats.avgPace} | Plus longue sortie: ${snapshot.recentStats.longestRunKm} km

### 3 DERNIÈRES SÉANCES
${snapshot.lastRuns.length > 0 
  ? snapshot.lastRuns.map((r) => `- ${r.date}: ${r.distKm} km @ ${r.pace}`).join("\n")
  : "Aucune séance enregistrée."}

### FORMAT ATTENDU :
Renvoie EXCLUSIVEMENT un JSON valide.
IMPORTANT: Pour TOUTES les séances (y compris le fractionné), tu dois obligatoirement calculer et fournir une valeur numérique pour target_distance_km (distance totale estimée incluant échauffement) et une allure cible moyenne pour target_pace. Seule la séance de repos complet accepte la valeur 0.
`;

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "MISTRAL_API_KEY is not defined on server" });
    }

    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Tu es un coach sportif professionnel pour SportSee. Génère un plan d'entraînement sur 6 semaines personnalisé en JSON strict.",
          },
          {
            role: "user",
            content: promptContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      await response.text();
      return res.status(response.status).json({ message: "Mistral API Error" });
    }

    const data = await response.json();

    const parsedPlan = JSON.parse(data.choices[0].message.content);

    return res.json(parsedPlan);
  } catch (error) {
    console.error("Erreur génération plan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;