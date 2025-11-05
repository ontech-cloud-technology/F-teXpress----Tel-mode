# 📋 TODO - Projet 203 Celebration Hub

## 🔐 Phase 1 : Authentification & Sécurité

### Système d'authentification
- [x] Créer la page de connexion (login.html)
- [x] Créer la page d'inscription (signup.html)
- [x] Implémenter la connexion par email/mot de passe
- [x] Implémenter la connexion Google (optionnel)
- [x] Ajouter la fonctionnalité de déconnexion
- [x] Créer un système de redirection selon l'état de connexion
- [x] Ajouter la gestion des erreurs d'authentification
- [x] Implémenter "Mot de passe oublié"

### Gestion des rôles
- [x] Créer la structure de rôles dans Firestore (admin, prof, comité, élève)
- [x] Ajouter le rôle lors de la création d'utilisateur
- [x] Créer une fonction pour vérifier le rôle de l'utilisateur
- [x] Protéger les routes selon les rôles
- [x] Créer un middleware de vérification des permissions

### Sécurité Firestore
- [x] Écrire les règles de sécurité Firestore pour la collection `users`
- [x] Écrire les règles de sécurité pour la collection `birthdays`
- [x] Écrire les règles de sécurité pour la collection `settings`
- [ ] Tester les règles de sécurité
- [ ] Déployer les règles de sécurité

---

## 📊 Phase 2 : Structure de données Firestore

### Collections Firestore
- [x] Créer la collection `users` avec les champs requis
- [x] Créer la collection `birthdays` avec les champs requis
- [x] Créer la collection `settings` pour les paramètres globaux
- [ ] Créer la collection `messages` pour les messages du jour
- [ ] Créer la collection `activities` pour le journal des activités (admin)

### Données de test
- [ ] Ajouter 5-10 utilisateurs de test (différents rôles)
- [ ] Ajouter 20-30 anniversaires de test
- [ ] Configurer les paramètres par défaut (thème, couleurs)
- [ ] Ajouter des messages du jour de test

### Fonctions utilitaires Firebase
- [ ] Créer une fonction pour ajouter un utilisateur
- [ ] Créer une fonction pour modifier un utilisateur
- [ ] Créer une fonction pour supprimer un utilisateur
- [ ] Créer une fonction pour récupérer tous les utilisateurs
- [ ] Créer une fonction pour ajouter un anniversaire
- [ ] Créer une fonction pour modifier un anniversaire
- [ ] Créer une fonction pour supprimer un anniversaire
- [ ] Créer une fonction pour récupérer les anniversaires du mois

---

## 📅 Phase 3 : Calendrier fonctionnel

### Calendrier de base
- [ ] Remplacer le calendrier statique par un calendrier dynamique
- [ ] Implémenter la navigation entre les mois (précédent/suivant)
- [ ] Afficher le mois et l'année actuels
- [ ] Mettre en évidence le jour actuel
- [ ] Gérer les différents nombres de jours par mois
- [ ] Gérer les années bissextiles
- [ ] Afficher les jours de la semaine (Lun, Mar, Mer, etc.)

### Intégration avec Firestore
- [ ] Charger les anniversaires depuis Firestore
- [ ] Afficher les noms sur les jours d'anniversaire
- [ ] Gérer plusieurs anniversaires le même jour
- [ ] Ajouter une icône 🎂 sur les jours d'anniversaire
- [ ] Créer un indicateur visuel pour le jour actuel

### Fonctionnalités avancées du calendrier
- [ ] Vue "Prochains anniversaires" (liste des 5 prochains)
- [ ] Recherche par nom d'élève
- [ ] Filtrage par rôle (élèves seulement, etc.)
- [ ] Vue liste (alternative à la vue calendrier)
- [ ] Compteur "X jours avant l'anniversaire de..."

---

## 👤 Phase 4 : Profils & Fiches utilisateurs

### Page profil individuel
- [ ] Créer la page de profil utilisateur (profile.html)
- [ ] Afficher photo, nom, rôle, date d'anniversaire
- [ ] Afficher la bio de l'utilisateur
- [ ] Permettre à l'utilisateur de modifier sa propre bio
- [ ] Permettre à l'utilisateur de changer sa photo de profil
- [ ] Implémenter l'upload de photo vers Firebase Storage
- [ ] Ajouter la modification du mot de passe
- [ ] Créer une galerie de photos (optionnel)

### Fiches élèves
- [ ] Créer une page "Tous les élèves" (students.html)
- [ ] Afficher une grille de cartes avec photo et nom
- [ ] Rendre les cartes cliquables vers le profil
- [ ] Ajouter un filtre de recherche
- [ ] Trier par nom, date d'anniversaire, etc.
- [ ] Ajouter des animations au survol des cartes

---

## 🔧 Phase 5 : Dashboard Admin

### Interface admin
- [x] Créer la page admin (admin.html)
- [ ] Créer le menu de navigation admin
- [x] Ajouter une vérification de rôle (admin uniquement)
- [ ] Créer un tableau de bord avec statistiques

### Gestion des utilisateurs
- [ ] Afficher la liste de tous les utilisateurs
- [ ] Ajouter un bouton "Créer un utilisateur"
- [ ] Créer un formulaire d'ajout d'utilisateur
- [ ] Implémenter la modification d'utilisateur
- [ ] Implémenter la suppression d'utilisateur (avec confirmation)
- [ ] Permettre de changer le rôle d'un utilisateur
- [ ] Ajouter une barre de recherche d'utilisateurs
- [ ] Pagination de la liste (si > 50 utilisateurs)

### Gestion des anniversaires
- [ ] Afficher la liste de tous les anniversaires
- [ ] Créer un formulaire d'ajout d'anniversaire
- [ ] Implémenter la modification d'anniversaire
- [ ] Implémenter la suppression d'anniversaire
- [ ] Associer un anniversaire à un utilisateur existant

### Paramètres globaux
- [ ] Créer une section "Paramètres"
- [ ] Permettre de changer le thème de couleur
- [ ] Permettre de changer le fond d'écran
- [ ] Activer/désactiver les animations
- [ ] Configurer le message du jour
- [ ] Sauvegarder les paramètres dans Firestore

### Journal des activités
- [ ] Créer un système de logging des actions importantes
- [ ] Afficher l'historique des modifications
- [ ] Filtrer par type d'action (ajout, modification, suppression)
- [ ] Afficher qui a fait quelle action et quand

### Export de données
- [ ] Implémenter l'export CSV de la liste des élèves
- [ ] Implémenter l'export CSV des anniversaires
- [ ] Ajouter un bouton de sauvegarde complète (JSON)

---

## 🧑‍🏫 Phase 6 : Dashboard Professeur

### Interface professeur
- [x] Créer la page professeur (teacher.html)
- [ ] Créer le menu de navigation professeur
- [x] Ajouter une vérification de rôle (prof ou admin)

### Fonctionnalités professeur
- [ ] Afficher toutes les fiches d'élèves (lecture seule)
- [ ] Créer un système de "Message du jour"
- [ ] Permettre de modifier le message du jour
- [ ] Afficher les statistiques (anniversaires par mois)
- [ ] Créer un graphique des anniversaires par mois
- [ ] Afficher le "Top 3" des prochains anniversaires
- [ ] Permettre de changer le thème global
- [ ] Créer un mode "Classe fermée" (désactive les interactions)
- [ ] Envoyer un message collectif (optionnel)
- [ ] Voir l'historique des messages du jour

---

## 🎨 Phase 7 : Dashboard Comité

### Interface comité
- [x] Créer la page comité (committee.html)
- [ ] Créer le menu de navigation comité
- [x] Ajouter une vérification de rôle (comité ou admin)

### Fonctionnalités comité
- [ ] Permettre d'ajouter un anniversaire
- [ ] Permettre de modifier un anniversaire
- [ ] Afficher la liste des anniversaires à venir
- [ ] Créer une section "Suggestions" (idées de célébration)
- [ ] Afficher des statistiques simples
- [ ] Créer un calendrier de planification des fêtes

---

## 🎉 Phase 8 : Animations & Effets visuels

### Animations CSS
- [ ] Ajouter des transitions fluides sur les boutons
- [ ] Animer l'apparition des cartes (fade-in, slide-in)
- [ ] Créer des effets de hover sur les éléments cliquables
- [ ] Ajouter une animation de chargement (spinner)
- [ ] Créer des animations pour les modals/popups

### Animations JavaScript
- [ ] Implémenter des confettis le jour d'un anniversaire
- [ ] Ajouter des ballons animés (canvas ou bibliothèque)
- [ ] Créer un effet de lumière au survol d'un nom
- [ ] Ajouter une animation "Happy Birthday" pour le jour même
- [ ] Créer un effet de particules en arrière-plan

### Effets spéciaux
- [ ] Ajouter un compte à rebours avant un anniversaire
- [ ] Créer une "Surprise du jour" (citation/blague aléatoire)
- [ ] Implémenter un système de notifications visuelles
- [ ] Ajouter des sons (optionnel, avec bouton mute)

---

## 🎨 Phase 9 : Thèmes & Personnalisation

### Système de thèmes
- [ ] Créer un thème clair
- [ ] Créer un thème sombre
- [ ] Créer 3-5 thèmes de couleurs prédéfinis
- [ ] Permettre la création de thème personnalisé (admin)
- [ ] Sauvegarder le thème choisi dans Firestore
- [ ] Appliquer le thème à toutes les pages
- [ ] Créer un sélecteur de thème dans la navbar

### Personnalisation visuelle
- [ ] Permettre de changer la police de caractères
- [ ] Permettre de changer l'arrière-plan (couleur ou image)
- [ ] Ajouter des arrière-plans animés (Lottie ou CSS)
- [ ] Créer un thème spécial pour un jour donné
- [ ] Ajouter des emojis et stickers d'anniversaire personnalisables

---

## 📱 Phase 10 : Responsive Design

### Mobile
- [ ] Adapter le calendrier pour mobile (vue verticale)
- [ ] Rendre la navigation mobile-friendly (menu hamburger)
- [ ] Optimiser les formulaires pour mobile
- [ ] Adapter les tableaux de bord pour petits écrans
- [ ] Tester sur différentes tailles d'écran (320px, 375px, 414px)

### Tablette
- [ ] Adapter le layout pour tablettes (768px - 1024px)
- [ ] Optimiser la grille du calendrier pour tablette
- [ ] Tester l'orientation portrait et paysage

### Desktop
- [ ] Optimiser pour grands écrans (1920px+)
- [ ] Créer une sidebar fixe pour la navigation
- [ ] Utiliser l'espace disponible efficacement

---

## 🔔 Phase 11 : Notifications & Messages

### Système de notifications
- [ ] Créer une zone de notifications dans la navbar
- [ ] Afficher une notification le jour d'un anniversaire
- [ ] Créer des notifications pour les actions importantes
- [ ] Permettre de marquer les notifications comme lues
- [ ] Sauvegarder les notifications dans Firestore

### Messages du jour
- [ ] Créer une section "Message du jour" sur la page d'accueil
- [ ] Permettre au professeur de modifier le message
- [ ] Afficher le message avec une animation
- [ ] Créer un historique des messages

---

## 📸 Phase 12 : Galerie & Souvenirs

### Page souvenirs
- [ ] Créer une page "Souvenirs" (memories.html)
- [ ] Permettre l'upload de photos de groupe
- [ ] Créer une galerie avec lightbox
- [ ] Ajouter des légendes aux photos
- [ ] Permettre de liker/commenter les photos (optionnel)
- [ ] Organiser par événement ou date

---

## 🔍 Phase 13 : Recherche & Filtres

### Fonctionnalités de recherche
- [ ] Créer une barre de recherche globale
- [ ] Rechercher par nom d'élève
- [ ] Rechercher par date d'anniversaire
- [ ] Rechercher par mois
- [ ] Afficher les résultats en temps réel

### Filtres avancés
- [ ] Filtrer par rôle (élève, prof, comité)
- [ ] Filtrer par mois d'anniversaire
- [ ] Trier par ordre alphabétique
- [ ] Trier par date d'anniversaire
- [ ] Combiner plusieurs filtres

---

## 📊 Phase 14 : Statistiques & Rapports

### Statistiques générales
- [ ] Nombre total d'utilisateurs
- [ ] Nombre d'utilisateurs par rôle
- [ ] Nombre d'anniversaires par mois (graphique)
- [ ] Mois avec le plus d'anniversaires
- [ ] Prochain anniversaire

### Rapports
- [ ] Créer un rapport mensuel des anniversaires
- [ ] Créer un rapport annuel
- [ ] Export PDF des rapports (optionnel)
- [ ] Graphiques interactifs (Chart.js ou similaire)

---

## ⚡ Phase 15 : Performance & Optimisation

### Optimisation du code
- [ ] Minifier le CSS
- [ ] Minifier le JavaScript
- [ ] Optimiser les images (compression)
- [ ] Lazy loading des images
- [ ] Mettre en cache les données Firestore

### Performance
- [ ] Tester les temps de chargement
- [ ] Optimiser les requêtes Firestore (indexation)
- [ ] Réduire le nombre de lectures Firestore
- [ ] Implémenter la pagination pour les grandes listes
- [ ] Utiliser des listeners Firestore efficacement

---

## 🧪 Phase 16 : Tests & Débogage

### Tests fonctionnels
- [ ] Tester la connexion/déconnexion
- [ ] Tester l'ajout/modification/suppression d'utilisateurs
- [ ] Tester l'ajout/modification/suppression d'anniversaires
- [ ] Tester les permissions par rôle
- [ ] Tester le calendrier (navigation, affichage)
- [ ] Tester sur différents navigateurs (Chrome, Firefox, Safari)

### Débogage
- [ ] Corriger les erreurs de console
- [ ] Gérer les cas d'erreur (réseau, Firebase, etc.)
- [ ] Ajouter des messages d'erreur clairs pour l'utilisateur
- [ ] Tester avec des données invalides
- [ ] Vérifier la sécurité (XSS, injection, etc.)

---

## 📚 Phase 17 : Documentation

### Documentation utilisateur
- [ ] Créer un guide d'utilisation pour les élèves
- [ ] Créer un guide pour les professeurs
- [ ] Créer un guide pour le comité
- [ ] Créer un guide admin complet
- [ ] Ajouter des tooltips dans l'interface

### Documentation technique
- [ ] Documenter la structure du code
- [ ] Documenter les fonctions Firebase
- [ ] Créer un README.md complet
- [ ] Documenter la structure Firestore
- [ ] Documenter les règles de sécurité

---

## 🚀 Phase 18 : Déploiement

### Préparation au déploiement
- [ ] Vérifier que toutes les fonctionnalités marchent
- [ ] Nettoyer le code (supprimer les console.log, etc.)
- [ ] Vérifier les clés API (ne pas exposer de secrets)
- [ ] Optimiser les assets (images, CSS, JS)

### Firebase Hosting
- [ ] Installer Firebase CLI (`npm install -g firebase-tools`)
- [ ] Initialiser Firebase Hosting (`firebase init hosting`)
- [ ] Configurer le fichier firebase.json
- [ ] Déployer sur Firebase Hosting (`firebase deploy`)
- [ ] Tester le site déployé
- [ ] Configurer un domaine personnalisé (optionnel)

### CI/CD (optionnel)
- [ ] Créer un repository GitHub
- [ ] Configurer GitHub Actions
- [ ] Déploiement automatique à chaque push
- [ ] Tester le workflow CI/CD

---

## ✨ Phase 19 : Fonctionnalités bonus

### Fonctionnalités supplémentaires
- [ ] Mode hors ligne (PWA)
- [ ] Notifications push (anniversaires à venir)
- [ ] Intégration calendrier Google (export)
- [ ] Système de badges/récompenses
- [ ] Quiz sur les anniversaires
- [ ] Générateur de cartes d'anniversaire
- [ ] Playlist Spotify pour les fêtes
- [ ] Sondages pour organiser les fêtes

---

## 🎯 Phase 20 : Finitions & Polish

### Derniers détails
- [ ] Vérifier l'orthographe et la grammaire
- [ ] Uniformiser les styles sur toutes les pages
- [ ] Ajouter des meta tags pour le SEO
- [ ] Ajouter un favicon
- [ ] Créer une page 404 personnalisée
- [ ] Ajouter une page "À propos"
- [ ] Ajouter une page "Contact"
- [ ] Créer un footer avec liens utiles

### Accessibilité
- [ ] Vérifier les contrastes de couleurs (WCAG)
- [ ] Ajouter des attributs ARIA
- [ ] Tester la navigation au clavier
- [ ] Ajouter des alt text aux images
- [ ] Tester avec un lecteur d'écran

---

## 📝 Notes

- **Priorité haute** : Phases 1-5
- **Priorité moyenne** : Phases 6-15
- **Priorité basse** : Phases 16-20

**Total estimé : 150+ tâches**

---

*Dernière mise à jour : 4 novembre 2025*
