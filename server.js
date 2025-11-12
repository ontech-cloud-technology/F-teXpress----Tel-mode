require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { emailService } = require("./sendMail.js");

const app = express();
const PORT = process.env.PORT || 3001;

const parseAllowedOrigins = () => {
  const { ALLOWED_ORIGINS } = process.env;
  if (!ALLOWED_ORIGINS) return [];
  return ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins();

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: false,
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "email-api" });
});

app.post("/email/welcome", async (req, res) => {
  const { email, fullName, role, temporaryPassword } = req.body || {};

  if (!email || !temporaryPassword) {
    return res.status(400).json({
      error: "Champs requis manquants : email et temporaryPassword sont obligatoires.",
    });
  }

  try {
    const result = await emailService.sendWelcomeEmail({ email, fullName, role, temporaryPassword });
    return res.status(202).json({
      message: "Courriel de bienvenue en file d'attente.",
      success: true,
      result,
    });
  } catch (error) {
    console.error("[email] Échec d'envoi de l'email de bienvenue:", error);
    return res.status(500).json({
      error: "Impossible d'envoyer le courriel de bienvenue.",
      success: false,
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Endpoint compatible avec l'ancien système
app.post("/api/send-welcome-email", async (req, res) => {
  const { email, fullName, tempPassword, loginUrl } = req.body || {};
  const role = req.body.role || 'eleve';

  if (!email || !tempPassword) {
    return res.status(400).json({
      success: false,
      error: "Champs requis manquants : email et tempPassword sont obligatoires.",
    });
  }

  try {
    const result = await emailService.sendWelcomeEmail({ 
      email, 
      fullName: fullName || email, 
      role, 
      temporaryPassword: tempPassword 
    });
    return res.status(202).json({
      success: true,
      message: "Email envoyé avec succès",
      result,
    });
  } catch (error) {
    console.error("[email] Échec d'envoi de l'email de bienvenue:", error);
    return res.status(500).json({
      success: false,
      error: "Impossible d'envoyer le courriel de bienvenue.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/api/send-message-notification", async (req, res) => {
  const { email, recipientName, senderName, message, isPublic, notificationsUrl, birthdayMessage } = req.body || {};

  if (!email || !recipientName || !senderName || !message) {
    return res.status(400).json({
      success: false,
      error: "Paramètres manquants: email, recipientName, senderName, message requis",
    });
  }

  try {
    const result = await emailService.sendMessageNotification({
      email,
      recipientName,
      senderName,
      message,
      isPublic: isPublic || false,
      notificationsUrl,
      birthdayMessage
    });
    return res.status(202).json({
      success: true,
      message: "Notification envoyée avec succès",
      result,
    });
  } catch (error) {
    console.error("[email] Échec d'envoi de la notification:", error);
    return res.status(500).json({
      success: false,
      error: "Impossible d'envoyer la notification.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`📬 Email service prêt sur le port ${PORT}`);
    if (allowedOrigins.length) {
      console.log(`   Origines autorisées: ${allowedOrigins.join(", ")}`);
    } else {
      console.log("   Origine CORS: * (toutes)");
    }
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Endpoints disponibles:`);
    console.log(`  POST http://localhost:${PORT}/api/send-welcome-email`);
    console.log(`  POST http://localhost:${PORT}/api/send-message-notification`);
    console.log(`  GET  http://localhost:${PORT}/api/health`);
    console.log(`${'='.repeat(60)}\n`);
  });
}

module.exports = { app };

