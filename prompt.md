Prompt :

"Crée un projet web complet pour gérer les anniversaires de la classe 203 de l’École d’Éducation Internationale de Laval.
Le projet doit utiliser uniquement HTML, CSS et JavaScript pur, sans frameworks, mais doit être connecté à Firebase pour :

l’authentification (login/signup) avec 4 rôles : admin, comité, professeur, élève

une base de données Firestore contenant les utilisateurs et leurs anniversaires

Le site doit être moderne, coloré et interactif avec :

un calendrier mensuel affichant les anniversaires

des animations CSS et JS (confettis, hover, messages du jour)

une fiche individuelle pour chaque élève, avec photo, bio et date d’anniversaire

un tableau de bord admin permettant de :

gérer tous les utilisateurs et rôles

ajouter/modifier/supprimer des anniversaires

changer les thèmes du site (couleurs, fond, animations)

un espace professeur pouvant consulter les fiches et envoyer des messages du jour

un espace comité pouvant ajouter/modifier des anniversaires, mais pas gérer les utilisateurs

Le calendrier doit :

afficher les noms des élèves le jour de leur anniversaire

mettre en évidence le jour actuel

permettre de naviguer entre les mois

Le code doit :

être modulaire et bien commenté

utiliser Firebase Auth et Firestore correctement

inclure animations JS/CSS pour rendre le site festif

être responsive et moderne (mobile + desktop)

Fournis le code complet pour :

index.html

style.css

script.js

firebase.js (config Firebase)

Inclue également des instructions pour :

initialiser Firebase

créer la base de données

configurer les rôles et les permissions

déployer sur Firebase Hosting

Priorise : simplicité de setup, modernité visuelle et interactivité."

🎯 Projet : 203 Celebration Hub
💡 But du projet

Créer une plateforme moderne, animée et connectée à Firebase pour célébrer les anniversaires, gérer les élèves, et offrir une interface professionnelle à trois types d’utilisateurs :
Élèves, Professeur, Comité, + Administrateur (toi).

⚙️ Architecture technique
🧠 Stack technologique
Élément	Choix
Frontend	React (ou Vue.js) + TailwindCSS (pour style moderne)
Backend / Auth / DB	Firebase (Authentication, Firestore, Storage, Hosting, Functions)
Déploiement	Firebase Hosting (GitHub Actions pour CI/CD)
Animation	Framer Motion + Lottie
UI Components	Shadcn/ui ou Material UI
Icons	Lucide-react / Heroicons
👥 Utilisateurs et rôles
Rôle	Description	Permissions principales
Élève	Peut consulter le calendrier, voir sa fiche, voir les autres élèves	Lecture seule
Professeur	Peut modifier les thèmes, consulter toutes les fiches, envoyer messages du jour	Lecture + certaines modifications
Comité	Peut ajouter/modifier les fêtes, afficher les statistiques, suggestions	Lecture + écriture limitée
Admin (toi)	Accès total : gestion utilisateurs, rôles, données, sécurité	Tout
🗂️ Structure Firebase
Firestore (exemple de collections)
users
  └─ {uid}
       ├─ name: "Lior"
       ├─ role: "admin" | "prof" | "comite" | "eleve"
       ├─ birthday: "2009-05-23"
       ├─ photoURL
       └─ bio: "Aime le ski, la robotique..."

birthdays
  └─ {id}
       ├─ userId
       ├─ date
       ├─ message
       └─ themeColor

settings
  ├─ theme
  ├─ calendarDisplayMode
  ├─ messageOfTheDay
  └─ animationsEnabled

💻 Modules et fonctionnalités (objectif : 30+ fonctionnalités)
🧩 1. Base utilisateur (Firebase Auth)

Connexion / déconnexion

Création de compte (admin uniquement)

Rôles par utilisateur

Page profil

Modification du mot de passe

Photo de profil (Storage)

Système d’authentification par Google ou email

📅 2. Calendrier des fêtes

Vue mensuelle animée

Vue "prochaines fêtes"

Animation “🎂 Happy Birthday” le jour même

Couleur personnalisée selon le mois ou le thème

Liste triée par date

Recherche par prénom

Filtrage par rôle (voir seulement élèves, comité, etc.)

🎨 3. Thèmes et apparence

Changement de thème par le professeur

Mode clair/sombre

Palette personnalisée (admin)

Arrière-plan animé (Lottie)

Emoji et stickers d’anniversaire

Thème spécial pour un jour donné

🧑‍🏫 4. Système professeur

Gestion du “message du jour”

Accès à toutes les fiches d’élèves

Statistiques (combien de fêtes par mois)

Envoyer un message collectif

Gestion du thème global

Historique des fêtes

Export CSV (liste d’élèves + dates)

Affichage du “Top 3” des prochains anniversaires

Mode “Classe fermée” (désactive interactions)

Tableau de bord rapide

🔧 5. Espace admin

Ajouter/supprimer utilisateurs

Modifier rôles

Supprimer un anniversaire

Restaurer une donnée supprimée

Contrôle total des permissions

Journal des activités

Sauvegarde / export Firestore

🪄 6. Animations et fun features

🎉 Confettis ou ballons le jour d’un anniversaire

✨ Effet de lumière au survol d’un nom

🎁 “Surprise du jour” : une citation, une blague ou une image générée aléatoirement

📸 Page “Souvenirs” (upload d’une photo de groupe)

🔐 7. Sécurité

Firestore rules basées sur le rôle utilisateur.

Vérification d’authentification sur chaque route.

Séparation claire des privilèges dans le dashboard.

🚀 8. Plan de développement (feuille de route)
Étape	Objectif	Durée estimée
Phase 1	Setup Firebase + React + Auth	
Phase 2	Calendrier et affichage des fêtes	
Phase 3	Comptes et rôles utilisateurs	
Phase 4	Panneau professeur + admin	
Phase 5	Animations, thèmes, finitions
🌍 9. Hébergement

Firebase Hosting relié à GitHub Actions → déploiement auto à chaque push.

Domaine personnalisé : celebration203.web.app ou 203-celebrations.vercel.app.