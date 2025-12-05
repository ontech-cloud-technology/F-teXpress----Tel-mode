# 🔧 Variables d'Environnement pour Render

## ⚠️ IMPORTANT - Mise à jour requise

Le nouveau système d'emails utilise des noms de variables différents.

## Variables à configurer dans Render

Dans **Settings** > **Environment**, configurez :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `SENDGRID_API_KEY` | `votre_cle_api_sendgrid` | Clé API SendGrid (à obtenir depuis SendGrid dashboard) |
| `SENDER_EMAIL` | `liorangezgeg@gmail.com` | Email expéditeur (⚠️ remplace SENDGRID_FROM_EMAIL) |
| `PORT` | `10000` | Port (optionnel, Render le définit automatiquement) |
| `COMPANY_NAME` | `203 Celebration Hub` | Nom de l'entreprise (optionnel) |
| `SUPPORT_EMAIL` | (vide) | Email support (optionnel) |

## ⚠️ Changement Important

**ANCIEN** : `SENDGRID_FROM_EMAIL`  
**NOUVEAU** : `SENDER_EMAIL`

Si vous avez `SENDGRID_FROM_EMAIL` dans Render, **supprimez-le** et ajoutez `SENDER_EMAIL` à la place.

## Configuration Render

### Build & Deploy
- **Root Directory**: (vide)
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

## ✅ Après Configuration

1. Redéployez : **Manual Deploy** > **Deploy latest commit**
2. Vérifiez les logs pour confirmer le démarrage
3. Testez : `curl https://email-api-cs1c.onrender.com/api/health`

