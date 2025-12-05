# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [1.3.0] - 2024-12-XX

### Ajouté
- Page de démo interactive (`demo.html`) accessible depuis `index.html`
- Système de démo avec données mockées pour présenter l'interface élève
- Design moderne et professionnel avec glassmorphism
- Animations de fond avec gradients flottants
- Scrollbar personnalisée avec gradient
- Système d'animations fade-in pour les transitions

### Modifié
- **Refonte complète du design** de toutes les pages principales :
  - Nouvelle palette de couleurs moderne (Indigo #6366f1, Violet #8b5cf6, Rose #ec4899)
  - Fond sombre (#0f172a) avec dégradés animés
  - Glassmorphism appliqué sur toutes les cartes et modales
  - Sidebar modernisée avec effets hover et barres latérales actives
  - Headers améliorés avec icônes et gradients
  - Boutons avec effets glow et animations
- `index.html` : Design modernisé, ajout de liens vers la démo
- `admin.html` : Application du nouveau design moderne
- `eleve.html` : Application du nouveau design moderne
- `demo.html` : Nouvelle page de démo avec interface élève complète

### Amélioré
- Expérience utilisateur avec animations fluides
- Cohérence visuelle entre toutes les pages
- Design professionnel et moderne
- Accessibilité améliorée avec meilleurs contrastes

## [1.2.0] - 2024-12-XX

### Ajouté
- Page unifiée de configuration de profil (`profile-config.html`) remplaçant les pages séparées
- Système multi-étapes avec barre de progression pour la configuration du profil
- Étape complète dédiée aux règles et conditions d'utilisation (identique à `rules-acceptance.html`)
- Support de la configuration de profil pour les administrateurs et professeurs
- 20 questions de profil organisées en 4 étapes
- 10 champs d'informations supplémentaires
- Gestion intégrée de la photo de profil, thème, et liste de souhaits
- Bouton "Mon Profil" dans l'interface admin pour voir son propre profil
- Vérification automatique pour éviter de refaire le formulaire si déjà complété

### Modifié
- Logique de redirection dans `login.html` : vérification unique du profil complété
- `student-profile.html` : affichage complet des 20 questions + 10 informations supplémentaires
- `admin.html` : ajout du bouton pour voir son propre profil
- Le profil n'est demandé qu'une seule fois lors de la première connexion
- Messages de redirection adaptés selon l'état du profil

### Corrigé
- Erreur "Assignment to constant variable" dans la sauvegarde du profil
- Redirection des admins vers la page élève au lieu de admin
- Message de redirection affichant toujours "formulaire" même après complétion
- Accessibilité : ajout du champ username caché pour les formulaires de mot de passe
- Gestion d'erreur améliorée pour l'upload de photos (bucket Supabase)

## [1.1.0] - 2024-11-15

### Ajouté
- Page de présentation administrative (`presentation-admin.html`)
- Système de conversion automatique PowerPoint en images PNG
- Scripts de conversion (`convert-pptx-to-slides.js`, `convert-pptx.sh`)
- Script d'installation automatique des dépendances (`install-and-convert.sh`)
- Documentation complète du système de présentation (`PRESENTATION_README.md`)
- Lien vers la présentation dans la sidebar admin
- Navigation au clavier pour la présentation (flèches, espace, ESC)

### Modifié
- `.gitignore` pour exclure les fichiers volumineux de présentation
- `package.json` avec nouveaux scripts npm pour la conversion

## [1.0.0] - 2024-01-XX

### Ajouté
- Système de gestion des anniversaires
- Système de messages entre élèves
- Système de progression (9 personnes consécutives)
- Système de vote pour les activités
- Système de réputation et de modération
- Filtre de mots interdits (200+ mots)
- Page d'acceptation des règles
- Gestion des profils d'élèves avec visibilité
- Système de tracking des fêtes pour les admins
- Envoi d'emails automatiques (SendGrid)
- Dashboard administrateur complet
- Système de logs d'activité

### Modifié
- Interface utilisateur améliorée
- Design responsive et moderne

### Sécurité
- Validation des messages avec filtrage de contenu
- Système de réputation pour maintenir un environnement respectueux
- Gestion des statuts utilisateurs (actif, bloqué, spectateur)

