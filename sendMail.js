require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const {
  SENDGRID_API_KEY,
  SENDER_EMAIL,
  SUPPORT_EMAIL,
  COMPANY_NAME = "203 Celebration Hub"
} = process.env;

if (!SENDGRID_API_KEY) {
  console.warn("[email] SENDGRID_API_KEY manquant. L'envoi de courriels échouera.");
}

let isClientConfigured = false;

const ensureClientConfigured = () => {
  if (!isClientConfigured) {
    sgMail.setApiKey(SENDGRID_API_KEY);
    isClientConfigured = true;
  }
};

const assertEnv = () => {
  if (!SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY non défini dans l'environnement.");
  }
  if (!SENDER_EMAIL) {
    throw new Error("SENDER_EMAIL non défini dans l'environnement.");
  }
};

const buildWelcomeEmail = ({ fullName, email, role, temporaryPassword }) => {
  const displayName = fullName || "Bienvenue";
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Membre";

  const html = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bienvenue chez ${COMPANY_NAME}</title>
      <style>
        :root {
          color-scheme: only light;
        }
        body {
          margin: 0;
          padding: 0;
          background: #0f172a;
          font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
        }
        .wrapper {
          background: linear-gradient(130deg, #1e1b4b, #0f172a 55%, #312e81);
          padding: 48px 0;
        }
        .container {
          width: min(620px, 90vw);
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(15, 23, 42, 0.35);
          overflow: hidden;
        }
        .hero {
          background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.25), transparent 55%),
                      linear-gradient(135deg, #312e81, #1d4ed8);
          padding: 48px 40px 32px;
          color: #f8fafc;
        }
        .hero h1 {
          margin: 0 0 8px;
          font-size: 28px;
          letter-spacing: 0.4px;
        }
        .hero p {
          margin: 8px 0 0;
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.9;
        }
        .content {
          padding: 40px;
        }
        .section-title {
          font-size: 18px;
          margin-bottom: 16px;
          color: #1e293b;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }
        .card {
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.08), transparent 65%), #f8fafc;
          padding: 24px;
          margin-bottom: 32px;
        }
        .credentials {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }
        .credentials div {
          background: #ffffff;
          border-radius: 14px;
          padding: 16px 18px;
          border: 1px solid rgba(148, 163, 184, 0.28);
          box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.15);
        }
        .credentials label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 6px;
        }
        .credentials span {
          font-size: 16px;
          color: #0f172a;
          font-weight: 600;
        }
        .cta {
          text-align: center;
          margin: 32px 0 16px;
        }
        .cta a {
          display: inline-block;
          padding: 14px 26px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          text-decoration: none;
          border-radius: 999px;
          font-weight: 600;
          letter-spacing: 0.4px;
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
        }
        .footer {
          padding: 28px 40px 36px;
          background: #0f172a;
          color: rgba(226, 232, 240, 0.82);
          font-size: 13px;
          line-height: 1.7;
        }
        .footer strong {
          color: #f8fafc;
        }
        .footer a {
          color: #60a5fa;
          text-decoration: none;
        }
        @media (max-width: 540px) {
          .hero, .content, .footer {
            padding: 28px;
          }
          .hero h1 {
            font-size: 24px;
          }
          .credentials {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <section class="hero">
            <h1>Bienvenue, ${displayName} !</h1>
            <p>
              Nous sommes ravis de vous accueillir au sein de la plateforme <strong>${COMPANY_NAME}</strong>.
              Votre profil <strong>${roleLabel}</strong> vient d'être activé avec succès.
            </p>
          </section>

          <section class="content">
            <h2 class="section-title">Vos accès personnalisés</h2>
            <div class="card">
              <div class="credentials">
                <div>
                  <label>Adresse e-mail</label>
                  <span>${email}</span>
                </div>
                <div>
                  <label>Code d'accès</label>
                  <span>${temporaryPassword}</span>
                </div>
                <div>
                  <label>Rôle attribué</label>
                  <span>${roleLabel}</span>
                </div>
              </div>
              <p style="margin: 22px 0 0; font-size: 15px; color: #1e293b; line-height: 1.6;">
                Par mesure de sécurité, nous vous invitons à vous connecter rapidement et à personnaliser votre mot de passe.
                Veillez à conserver vos identifiants dans un endroit protégé.
              </p>
            </div>

            <div class="cta">
              <a href="https://203celebrationhub.com/login.html" target="_blank" rel="noopener">Accéder à mon espace</a>
            </div>

            <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0;">
              Besoin d'assistance ? Notre équipe est à votre écoute pour vous guider dans vos premiers pas.
            </p>
          </section>

          <footer class="footer">
            <strong>${COMPANY_NAME}</strong><br />
            Votre copilote intelligent pour orchestrer chaque célébration avec élégance.<br />
            ${SUPPORT_EMAIL ? `Support : <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a><br />` : ""}
            Merci de faire confiance à notre équipe.
          </footer>
        </div>
      </div>
    </body>
  </html>
  `;

  return {
    subject: `Bienvenue sur ${COMPANY_NAME}`,
    html,
    text: `Bienvenue ${displayName}!\n\nVotre accès est maintenant actif.\n- Email: ${email}\n- Code d'accès: ${temporaryPassword}\n- Rôle: ${roleLabel}\n\nConnectez-vous rapidement et changez votre mot de passe.`
  };
};

const sendWelcomeEmail = async ({ email, fullName, role, temporaryPassword }) => {
  assertEnv();
  ensureClientConfigured();

  if (!email || !temporaryPassword) {
    throw new Error("L'email de destination et le code d'accès sont requis.");
  }

  const { subject, html, text } = buildWelcomeEmail({
    fullName,
    email,
    role,
    temporaryPassword
  });

  const message = {
    to: email,
    from: SENDER_EMAIL,
    subject,
    text,
    html,
  };

  await sgMail.send(message);
  return { delivered: true, success: true };
};

// Fonction pour les notifications de message (adaptée de l'ancien système)
const sendMessageNotification = async ({ email, recipientName, senderName, message, isPublic, notificationsUrl, birthdayMessage }) => {
  assertEnv();
  ensureClientConfigured();

  if (!email || !recipientName || !senderName || !message) {
    throw new Error("Paramètres manquants: email, recipientName, senderName, message requis");
  }

  const senderInitial = (senderName || 'A')[0].toUpperCase();
  const messageType = isPublic ? 'Public' : 'Secret';
  
  let birthdayMessageSection = '';
  if (birthdayMessage && birthdayMessage.trim() && !birthdayMessage.includes('nouveau message')) {
    birthdayMessageSection = `
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <p style="color: #856404; margin: 0; font-weight: 600;">${birthdayMessage}</p>
    </div>
    `;
  }

  const html = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Nouveau message - ${COMPANY_NAME}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background: #0f172a;
          font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .wrapper {
          background: linear-gradient(130deg, #1e1b4b, #0f172a 55%, #312e81);
          padding: 48px 0;
        }
        .container {
          width: min(620px, 90vw);
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(15, 23, 42, 0.35);
          overflow: hidden;
        }
        .content {
          padding: 40px;
        }
        .message-box {
          background: #f8fafc;
          border-radius: 18px;
          padding: 24px;
          margin: 20px 0;
          border: 1px solid rgba(148, 163, 184, 0.25);
        }
        .sender-info {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .sender-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 20px;
          margin-right: 12px;
        }
        .cta {
          text-align: center;
          margin: 32px 0 16px;
        }
        .cta a {
          display: inline-block;
          padding: 14px 26px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          text-decoration: none;
          border-radius: 999px;
          font-weight: 600;
        }
        .footer {
          padding: 28px 40px 36px;
          background: #0f172a;
          color: rgba(226, 232, 240, 0.82);
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <section class="content">
            <h1 style="font-size: 24px; margin-bottom: 8px;">Salut ${recipientName} ! 👋</h1>
            <p style="color: #64748b; margin-bottom: 20px;">Quelqu'un t'a envoyé un message sur <strong>${COMPANY_NAME}</strong> !</p>
            ${birthdayMessageSection}
            <div class="message-box">
              <div class="sender-info">
                <div class="sender-avatar">${senderInitial}</div>
                <div>
                  <strong>${senderName}</strong><br />
                  <span style="color: #64748b; font-size: 14px;">Message ${messageType}</span>
                </div>
              </div>
              <p style="color: #1e293b; line-height: 1.6; margin: 0;">${message}</p>
            </div>
            <div class="cta">
              <a href="${notificationsUrl || 'https://203celebrationhub.com/eleve.html#notifications'}" target="_blank" rel="noopener">Voir tous mes messages</a>
            </div>
          </section>
          <footer class="footer">
            <strong>${COMPANY_NAME}</strong><br />
            Merci de faire confiance à notre équipe.
          </footer>
        </div>
      </div>
    </body>
  </html>
  `;

  const message = {
    to: email,
    from: SENDER_EMAIL,
    subject: `💌 Nouveau message de ${senderName} sur ${COMPANY_NAME}`,
    html,
    text: `Salut ${recipientName} !\n\n${senderName} t'a envoyé un message sur ${COMPANY_NAME}.\n\nMessage: "${message}"\n\nType: ${messageType}\n\nPour voir tous tes messages, va sur: ${notificationsUrl || 'https://203celebrationhub.com/eleve.html#notifications'}`
  };

  await sgMail.send(message);
  return { delivered: true, success: true };
};

const emailService = {
  sendWelcomeEmail,
  sendMessageNotification
};

module.exports = { emailService, buildWelcomeEmail, sendWelcomeEmail, sendMessageNotification };

