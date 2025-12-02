# 🎓 Guide Complet du Système - Point de Vue Élève

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Vue d'Ensemble du Système](#vue-densemble-du-système)
3. [Fonctionnalités Principales](#fonctionnalités-principales)
4. [Système de Sécurité](#système-de-sécurité)
5. [Système de Réputation](#système-de-réputation)
6. [Système de Surveillance](#système-de-surveillance)
7. [Statistiques et Classements](#statistiques-et-classements)
8. [Système de Progression et Défis](#système-de-progression-et-défis)
9. [Messagerie Privée](#messagerie-privée)
10. [Calendrier des Anniversaires](#calendrier-des-anniversaires)
11. [Système de Vote](#système-de-vote)
12. [Badges et Récompenses](#badges-et-récompenses)
13. [Notifications et Emails](#notifications-et-emails)
14. [Confidentialité et Données](#confidentialité-et-données)
15. [Règles et Restrictions](#règles-et-restrictions)
16. [FAQ](#faq)

---

## 🎉 Introduction

Bienvenue dans le **203 Celebration Hub** ! Ce guide complet t'explique **TOUT** ce que tu dois savoir sur le système, du point de vue d'un élève. Tu découvriras comment fonctionne chaque fonctionnalité, les systèmes de sécurité en place, la réputation, la surveillance, et bien plus encore.

Ce système a été créé spécialement pour notre classe afin de rendre les célébrations d'anniversaires plus spéciales, créer un esprit d'équipe, et nous récompenser quand on travaille ensemble.

---

## 🌟 Vue d'Ensemble du Système

### Qu'est-ce que le 203 Celebration Hub ?

Le **203 Celebration Hub** est une plateforme en ligne sécurisée qui permet à tous les élèves de la classe de :

- ✅ Voir tous les anniversaires de la classe
- ✅ Envoyer des messages personnalisés pour souhaiter un joyeux anniversaire
- ✅ Suivre notre progression vers un objectif spécial de classe
- ✅ Voter pour choisir nos activités de groupe
- ✅ Gagner des badges et des points
- ✅ Voir des classements et des statistiques
- ✅ Communiquer de manière sécurisée avec les autres élèves

### Architecture du Système

Le système est construit avec :
- **Firebase** : Base de données sécurisée (Google)
- **Firestore** : Stockage des données en temps réel
- **Firebase Authentication** : Système de connexion sécurisé
- **Surveillance automatique** : Filtres et systèmes de sécurité 24/7

---

## 🎯 Fonctionnalités Principales

### 1. Page d'Accueil (`accueil-eleve.html`)

Quand tu te connectes, tu arrives sur ta page d'accueil personnalisée qui affiche :

#### Statistiques Rapides
- **Messages reçus** : Nombre total de messages que tu as reçus
- **Messages envoyés** : Nombre total de messages que tu as envoyés
- **Réputation** : Ta réputation actuelle (sur 100)

#### Prochains Anniversaires
- Liste des 5 prochains anniversaires dans les 7 prochains jours
- Indication si c'est aujourd'hui, demain, ou dans X jours
- Bouton rapide pour souhaiter un joyeux anniversaire

#### Défi de Classe
- Progression vers l'objectif des 9 personnes consécutives
- Barre de progression visuelle
- Lien vers la page de progression complète

#### Actions Rapides
- Voir le calendrier
- Envoyer un message
- Voir mes messages
- Voir les défis

### 2. Calendrier (`eleve.html?view=calendrier`)

Le calendrier te permet de :

#### Vue Mensuelle
- Voir tous les anniversaires du mois
- Navigation entre les mois (précédent/suivant)
- Indicateur visuel (🎂) sur les jours d'anniversaire
- Mise en évidence du jour actuel

#### Détails des Anniversaires
- Cliquer sur un jour pour voir tous les anniversaires de ce jour
- Voir les noms, numéros de dossier, et dates
- Accès rapide pour envoyer un message

#### Navigation
- Sélecteurs de mois et d'année
- Bouton "Aujourd'hui" pour revenir au mois actuel
- Statistiques du mois (nombre d'anniversaires)

### 3. Messagerie (`eleve.html?view=messaging`)

La messagerie est **100% privée** et sécurisée :

#### Envoyer un Message
- Sélectionner un destinataire (par nom ou numéro de dossier)
- Écrire un message personnalisé
- **Règle importante** : Tu ne peux envoyer qu'**UN SEUL message par personne**
- Une fois envoyé, le bouton devient gris et dit "Déjà envoyé ✓"

#### Recevoir des Messages
- Tous tes messages reçus sont affichés dans la section "Messages"
- Badge de notification pour les messages non lus
- Marquer les messages comme lus automatiquement

#### Conversations
- Voir toutes tes conversations
- Historique complet des messages échangés
- Indicateur de messages non lus

### 4. Messages Reçus (`eleve.html?view=notifications`)

Cette section affiche :
- Tous les messages que tu as reçus
- Messages triés par date (plus récents en premier)
- Indicateur visuel pour les messages non lus
- Informations sur l'expéditeur

### 5. Défis et Progression (`progression.html`)

#### Le Défi des 9 Personnes Consécutives

**Objectif** : 9 personnes consécutives doivent recevoir des messages de **TOUS** les élèves de la classe.

**Comment ça fonctionne** :
1. Quand une personne a son anniversaire, si **TOUS** les élèves lui envoient un message → ✅ **C'est un succès !**
2. Si au moins un élève n'a pas envoyé de message → ❌ **On recommence à zéro**
3. Il faut que 9 personnes **de suite** reçoivent des messages de tout le monde
4. Si on réussit pour 8 personnes mais que la 9ème n'a pas reçu tous les messages → On recommence !

**Récompense** : Si on atteint 9 personnes consécutives, on gagne une **activité spéciale pour toute la classe** !

**Suivi de la Progression** :
- Tu peux voir combien de personnes consécutives nous avons réussi
- Tu peux voir qui a reçu tous les messages
- Tu peux voir qui n'a pas encore reçu tous les messages
- Barre de progression visuelle (X/9)

### 6. Système de Vote (`eleve.html?view=vote`)

#### Vote Initial
- Les professeurs créent une liste d'activités possibles
- Tu peux voter pour tes activités préférées
- **Tu ne peux voter qu'UNE SEULE FOIS**
- C'est un vote pour voir quelles activités tu préfères

#### Vote Final
- Plus tard, les professeurs activent le **vote final**
- C'est le vote qui décide vraiment quelle activité on va faire
- Tu votes encore une fois pour ton choix final
- L'activité qui reçoit le plus de votes est celle qu'on fait

#### Résultats
- Tu peux voir les résultats en temps réel
- Pourcentages de votes pour chaque activité
- Nombre total de votes

### 7. Paramètres (`eleve.html?view=settings`)

Dans les paramètres, tu peux :
- Voir ton profil
- Changer ta photo de profil
- Modifier tes informations personnelles
- Voir tes statistiques détaillées
- Gérer tes préférences de notifications

---

## 🔒 Système de Sécurité

### 1. Authentification Sécurisée

#### Connexion
- Tu dois te connecter avec ton **email** et ton **mot de passe**
- Les mots de passe sont **cryptés** (personne ne peut les voir, même les administrateurs)
- Si c'est ta première connexion, tu dois changer ton mot de passe temporaire

#### Protection des Sessions
- Les sessions expirent automatiquement après une période d'inactivité
- Tu dois te reconnecter si tu restes inactif trop longtemps
- Déconnexion automatique pour la sécurité

### 2. Filtre Automatique des Mots Interdits

#### Comment ça fonctionne
- Le système dispose d'un **filtre automatique** qui surveille **TOUS** les messages envoyés
- **Plus de 200 mots interdits** sont détectés automatiquement
- Le filtre fonctionne même si tu essaies de contourner :
  - Variations de mots
  - Accents
  - Caractères spéciaux
  - Combinaisons de lettres

#### Blocage des Messages
- Si tu essaies d'envoyer un message avec un mot interdit, le message est **BLOQUÉ**
- Le message ne peut **PAS** être envoyé
- Tu reçois un message d'erreur t'informant que ton message contient du contenu inapproprié

#### Enregistrement
- Tous les messages bloqués sont automatiquement enregistrés dans un **journal sécurisé**
- Les administrateurs peuvent voir ces messages pour assurer la sécurité
- C'est une protection automatique qui fonctionne **24h/24**, sans intervention nécessaire

### 3. Protection des Données

#### Stockage Sécurisé
- Toutes les données sont stockées sur des **serveurs sécurisés** (Firebase/Google)
- Les données sont **chiffrées** en transit et au repos
- Seuls les élèves de la classe peuvent accéder au système
- Les professeurs et administrateurs ont un accès spécial pour gérer le système

#### Confidentialité des Messages
- Tous les messages sont **privés** entre l'expéditeur et le destinataire
- Personne d'autre ne peut voir tes messages (sauf les administrateurs pour la modération)
- Les messages ne sont pas partagés publiquement

### 4. Règles de Sécurité Firestore

Le système utilise des **règles de sécurité** strictes :
- Tu ne peux lire que les données auxquelles tu as accès
- Tu ne peux modifier que tes propres données
- Les administrateurs ont des permissions spéciales
- Toutes les actions sont vérifiées côté serveur

---

## ⭐ Système de Réputation

### Vue d'Ensemble

Chaque élève commence avec une **réputation de 100/100**. Cette réputation reflète ton comportement dans le système.

### Comment la Réputation Fonctionne

#### Réputation Initiale
- **100 points** : Réputation de départ pour tous les élèves
- Affichée sur ta page d'accueil
- Visible dans les classements

#### Augmentation de la Réputation
- **Comportements positifs** : Maintien ou augmentation de la réputation
- Participation active aux célébrations
- Envoi de messages respectueux et bienveillants
- Respect des règles du système

#### Diminution de la Réputation

**Perte de 5 points** à chaque tentative d'envoi d'un message inapproprié :
- Message bloqué par le filtre automatique
- Tentative de contourner les règles
- Comportement inapproprié détecté

### Conséquences selon la Réputation

#### Réputation ≥ 50/100
- ✅ Tu peux envoyer des messages normalement
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Participation aux défis et activités

#### Réputation < 50/100
- ⚠️ **Tu ne peux plus envoyer de messages**
- ⚠️ Tu dois améliorer ta réputation pour retrouver l'accès
- ⚠️ Les administrateurs sont notifiés

#### Réputation < 20/100
- 🚨 **Risque de devenir "spectateur"**
- 🚨 Accès limité au système
- 🚨 Les administrateurs peuvent prendre des mesures supplémentaires

### Amélioration de la Réputation

Pour améliorer ta réputation :
- Respecte les règles du système
- Envoie des messages respectueux et bienveillants
- Participe activement aux célébrations
- Les administrateurs peuvent aussi ajuster ta réputation si nécessaire

### Visibilité de la Réputation

- Ta réputation est visible sur ta page d'accueil
- Elle apparaît dans les classements (si activés)
- Les administrateurs peuvent voir la réputation de tous les élèves

---

## 👁️ Système de Surveillance

### 1. Surveillance Automatique des Messages

#### Filtrage en Temps Réel
- **Tous les messages** sont analysés automatiquement avant d'être envoyés
- Le système vérifie chaque message contre une liste de plus de 200 mots interdits
- Détection même des tentatives de contournement

#### Enregistrement des Messages Bloqués
- Chaque message bloqué est enregistré avec :
  - Contenu du message
  - Date et heure
  - Identité de l'expéditeur
  - Raison du blocage
- Ces enregistrements sont stockés dans une collection sécurisée `blockedMessages`
- Accessibles uniquement aux administrateurs

### 2. Journalisation des Activités (Activity Logger)

#### Ce qui est Enregistré

Le système enregistre automatiquement **toutes tes activités** sur le site :

**Actions Enregistrées** :
- ✅ Chargement de pages
- ✅ Clics sur les boutons
- ✅ Soumissions de formulaires
- ✅ Changements dans les formulaires
- ✅ Touches du clavier importantes (Enter, Escape, Tab, F5)
- ✅ Défilement de page
- ✅ Changements de focus (quand tu quittes ou reviens sur la page)
- ✅ Erreurs JavaScript
- ✅ Connexion et déconnexion

**Informations Collectées** :
- Page visitée
- Élément cliqué (bouton, lien, etc.)
- Timestamp (date et heure exacte)
- Durée de session
- Informations techniques (navigateur, système d'exploitation, résolution d'écran)

#### Compression et Optimisation

Les données sont **compressées** pour économiser l'espace :
- Codes courts pour les actions (ex: 'pl' pour 'page_load')
- Noms de champs abrégés
- Agrégation des clics similaires
- Envoi en batch (par lots) pour optimiser les performances

#### Informations Système

Une fois par session, le système collecte :
- **User Agent** : Type de navigateur
- **Langue** : Langue de ton navigateur
- **Résolution d'écran** : Taille de ton écran
- **Fuseau horaire** : Ton fuseau horaire
- **Type d'appareil** : Mobile ou Desktop
- **Système d'exploitation** : Windows, Mac, Linux, etc.
- **Adresse IP** : Pour la sécurité (collectée une seule fois par session)
- **État de la batterie** : Si disponible (mobile)
- **Type de connexion** : WiFi, 4G, etc.

#### Stockage

- Toutes les activités sont stockées dans la collection `activity_logs`
- Les informations de session sont stockées dans `session_info`
- Les données sont liées à ton ID utilisateur
- Accessibles uniquement aux administrateurs pour la modération et la sécurité

### 3. Surveillance par les Administrateurs

#### Accès Admin
- Les administrateurs peuvent voir :
  - Tous les messages bloqués
  - Toutes les activités des utilisateurs
  - Les statistiques de comportement
  - Les violations des règles

#### Actions Administratives
- Ajustement de la réputation
- Blocage/déblocage d'utilisateurs
- Consultation des journaux d'activité
- Gestion des messages inappropriés

### 4. Pourquoi cette Surveillance ?

#### Sécurité
- Protection contre les contenus inappropriés
- Détection des comportements problématiques
- Prévention des abus

#### Amélioration du Système
- Comprendre comment le système est utilisé
- Identifier les problèmes techniques
- Améliorer l'expérience utilisateur

#### Conformité
- Respect des règles de la classe
- Protection de tous les utilisateurs
- Traçabilité des actions

---

## 📊 Statistiques et Classements

### 1. Statistiques Personnelles

#### Statistiques Disponibles

**Messages** :
- Messages envoyés (total)
- Messages reçus (total)
- Messages envoyés ce mois
- Messages reçus ce mois

**Activité** :
- Jours actifs (nombre de jours où tu t'es connecté)
- Jours consécutifs (série de jours actifs)
- Plus longue série (record personnel)
- Dernière activité

**Célébrations** :
- Célébrations totales
- Célébrations auxquelles tu as participé
- Messages envoyés pour les célébrations

**Réputation** :
- Réputation actuelle (sur 100)
- Évolution de la réputation

**Points et Niveaux** :
- Points totaux
- Niveau actuel
- Points jusqu'au prochain niveau

**Badges** :
- Liste de tous tes badges obtenus
- Description de chaque badge

### 2. Système de Classements (Leaderboard)

#### Types de Classements

**Classement par Messages Envoyés** :
- Top 10 des élèves qui ont envoyé le plus de messages
- Compte tous les messages envoyés depuis le début
- Mis à jour en temps réel

**Classement par Réputation** :
- Top 10 des élèves avec la meilleure réputation
- Trié par réputation décroissante
- Visible pour encourager les bons comportements

**Classement par Points/Niveau** :
- Top 10 des élèves avec le plus de points
- Affiche aussi le niveau de chaque élève
- Récompense l'engagement et la participation

**Classement par Jours Actifs** :
- Top 10 des élèves les plus actifs
- Compte le nombre de jours où tu t'es connecté
- Encourage la participation régulière

**Classement Mensuel** :
- Top 10 des élèves qui ont envoyé le plus de messages ce mois
- Réinitialisé chaque mois
- Crée une compétition mensuelle saine

#### Ta Position dans les Classements

- Tu peux voir ta position dans chaque classement
- Indication si tu es dans le top 10
- Encouragement à améliorer ta position

### 3. Calcul des Points et Niveaux

#### Système de Points

**Gain de Points** :
- Envoi de messages : Points variables selon l'action
- Participation aux célébrations : Points bonus
- Obtenir des badges : Points de récompense
- Jours actifs consécutifs : Points de série

**Formule de Niveau** :
- Niveau = floor(√(points / 10)) + 1
- Plus tu as de points, plus ton niveau est élevé
- Chaque niveau nécessite de plus en plus de points

#### Exemples de Points

- **Premier message** : 10 points
- **10 messages** : 25 points (badge)
- **50 messages** : 50 points (badge)
- **100 messages** : 100 points (badge)
- **7 jours actifs** : 20 points (badge)
- **30 jours actifs** : 50 points (badge)
- **Série de 7 jours** : 30 points (badge)
- **Série de 30 jours** : 100 points (badge)
- **5 célébrations** : 25 points (badge)
- **10 célébrations** : 50 points (badge)
- **Niveau 5** : 50 points (badge)
- **Niveau 10** : 100 points (badge)

---

## 🎯 Système de Progression et Défis

### 1. Le Défi des 9 Personnes Consécutives

#### Objectif

**9 personnes consécutives** doivent recevoir des messages de **TOUS** les élèves de la classe.

#### Règles du Défi

1. **Ordre Consécutif** :
   - Les anniversaires sont triés par date
   - Il faut que 9 personnes **de suite** (dans l'ordre chronologique) reçoivent tous les messages

2. **Tous les Messages Requis** :
   - Pour qu'une personne compte comme "réussie", **TOUS** les élèves actifs doivent lui avoir envoyé un message
   - Si même un seul élève manque, cette personne ne compte pas

3. **Réinitialisation** :
   - Si une personne dans la séquence ne reçoit pas tous les messages, le compteur **repart à zéro**
   - On recommence depuis le début

4. **Suivi en Temps Réel** :
   - Tu peux voir la progression actuelle (X/9)
   - Tu peux voir qui a reçu tous les messages
   - Tu peux voir qui n'a pas encore reçu tous les messages

#### Récompense

Si on atteint **9 personnes consécutives** :
- 🎉 **Activité spéciale pour toute la classe** !
- C'est un défi d'équipe : il faut que **TOUT LE MONDE** participe pour réussir

#### Pourquoi ce Défi ?

- Encourage la participation de tous
- Crée un esprit d'équipe
- Récompense la collaboration
- Rend les célébrations plus inclusives

### 2. Page de Progression (`progression.html`)

#### Informations Affichées

**Progression Globale** :
- Nombre de personnes consécutives réussies (X/9)
- Barre de progression visuelle
- Pourcentage de complétion

**Détails par Célébration** :
- Liste de toutes les célébrations
- Pour chaque célébration :
  - Nom de la personne
  - Date d'anniversaire
  - Statut : ✅ Complète ou ❌ Incomplète
  - Nombre de messages reçus / Nombre total d'élèves
  - Liste des élèves qui n'ont pas encore envoyé de message

**Statistiques** :
- Nombre total d'élèves actifs
- Nombre total de célébrations
- Pourcentage de célébrations complètes

---

## 💬 Messagerie Privée

### 1. Envoyer un Message

#### Processus d'Envoi

1. **Sélection du Destinataire** :
   - Choisir par nom ou numéro de dossier
   - Liste de tous les élèves actifs
   - Recherche par nom

2. **Écriture du Message** :
   - Zone de texte pour écrire ton message
   - Pas de limite de caractères (mais sois raisonnable)
   - Vérification automatique avant l'envoi

3. **Vérification de Sécurité** :
   - Le système vérifie automatiquement le contenu
   - Détection des mots interdits
   - Blocage si contenu inapproprié

4. **Envoi** :
   - Une fois envoyé, tu ne peux plus modifier le message
   - Le bouton devient gris et dit "Déjà envoyé ✓"
   - Notification envoyée au destinataire

#### Règles Importantes

- **Un seul message par personne** : Tu ne peux envoyer qu'un seul message à chaque élève
- **Messages privés** : Tous les messages sont privés entre toi et le destinataire
- **Pas de modification** : Une fois envoyé, tu ne peux pas modifier ou supprimer ton message
- **Réputation requise** : Si ta réputation est < 50, tu ne peux pas envoyer de messages

### 2. Recevoir des Messages

#### Affichage des Messages

- Tous tes messages reçus sont affichés dans la section "Messages"
- Triés par date (plus récents en premier)
- Indicateur visuel pour les messages non lus
- Informations sur l'expéditeur (nom)

#### Marquer comme Lu

- Les messages sont automatiquement marqués comme lus quand tu les ouvres
- Badge de notification pour les messages non lus
- Compteur de messages non lus

### 3. Conversations

#### Vue des Conversations

- Liste de toutes tes conversations
- Dernier message affiché
- Nombre de messages non lus par conversation
- Tri par date (conversations les plus récentes en premier)

#### Historique

- Voir tous les messages échangés avec une personne
- Chronologie complète
- Distinction visuelle entre messages envoyés et reçus

### 4. Notifications Email

#### Envoi Automatique

Quand tu reçois un message :
- Tu reçois automatiquement un **email de notification**
- L'email contient :
  - Nom de l'expéditeur
  - Extrait du message
  - Lien pour voir le message complet sur le site

#### Avantages

- Tu ne rates jamais un message
- Tu es informé même si tu n'es pas connecté au site
- Crée un sentiment de connexion et de bienveillance

---

## 📅 Calendrier des Anniversaires

### 1. Vue Mensuelle

#### Affichage

- Calendrier mensuel avec tous les jours du mois
- Indicateur visuel (🎂) sur les jours d'anniversaire
- Mise en évidence du jour actuel
- Navigation entre les mois

#### Navigation

- **Boutons** : Mois précédent / Mois suivant
- **Sélecteurs** : Menu déroulant pour choisir le mois et l'année
- **Bouton "Aujourd'hui"** : Revenir rapidement au mois actuel

### 2. Détails des Anniversaires

#### Clic sur un Jour

Quand tu cliques sur un jour avec un anniversaire :
- Modale s'ouvre avec tous les détails
- Liste de toutes les personnes qui ont leur anniversaire ce jour
- Informations affichées :
  - Nom complet
  - Numéro de dossier
  - Date d'anniversaire
  - Bouton pour envoyer un message

#### Informations Affichées

- **Nom** : Nom complet de la personne
- **Numéro de dossier** : Numéro d'identification
- **Date** : Date d'anniversaire complète
- **Actions** : Bouton pour souhaiter un joyeux anniversaire

### 3. Statistiques du Calendrier

#### Compteurs

- **Total d'anniversaires** : Nombre total dans le système
- **Ce mois-ci** : Nombre d'anniversaires ce mois
- **Aujourd'hui** : Nombre d'anniversaires aujourd'hui

### 4. Prochains Anniversaires

#### Vue sur la Page d'Accueil

- Liste des 5 prochains anniversaires dans les 7 prochains jours
- Indication du temps restant :
  - "Aujourd'hui ! 🎉" si c'est aujourd'hui
  - "Demain" si c'est demain
  - "Dans X jours" sinon
- Bouton rapide pour souhaiter un joyeux anniversaire

---

## 🗳️ Système de Vote

### 1. Vote Initial

#### Fonctionnement

- Les professeurs créent une liste d'activités possibles
- Tu peux voir toutes les activités disponibles
- Tu votes pour tes activités préférées
- **Tu ne peux voter qu'UNE SEULE FOIS**

#### Objectif

- C'est un vote pour voir quelles activités tu préfères
- Aide les professeurs à comprendre les préférences de la classe
- Les résultats sont visibles en temps réel

### 2. Vote Final

#### Fonctionnement

- Plus tard, les professeurs activent le **vote final**
- C'est le vote qui décide vraiment quelle activité on va faire
- Tu votes encore une fois pour ton choix final
- **Tu ne peux voter qu'UNE SEULE FOIS**

#### Résultats

- L'activité qui reçoit le plus de votes est celle qu'on fait
- Résultats affichés avec pourcentages
- Nombre total de votes visible

### 3. Affichage des Résultats

#### Informations Affichées

- Liste de toutes les activités
- Nombre de votes pour chaque activité
- Pourcentage de votes
- Barre de progression visuelle
- Activité gagnante mise en évidence

#### Mise à Jour

- Les résultats sont mis à jour en temps réel
- Tu peux voir l'évolution des votes
- Transparence totale du processus

---

## 🏆 Badges et Récompenses

### 1. Système de Badges

#### Types de Badges

**Badges de Messages** :
- 🎯 **Premier Message** : Envoyé ton premier message (10 points)
- 💬 **Messager Actif** : Envoyé 10 messages (25 points)
- 📨 **Grand Communicateur** : Envoyé 50 messages (50 points)
- 📬 **Maître des Messages** : Envoyé 100 messages (100 points)

**Badges d'Activité** :
- 📅 **Semaine Active** : Actif pendant 7 jours (20 points)
- 🗓️ **Mois Actif** : Actif pendant 30 jours (50 points)
- 🔥 **Série de 7** : 7 jours consécutifs (30 points)
- ⚡ **Série Légendaire** : 30 jours consécutifs (100 points)

**Badges de Célébrations** :
- 🎉 **Fêtard** : Participé à 5 célébrations (25 points)
- 👑 **Roi des Fêtes** : Participé à 10 célébrations (50 points)

**Badges de Niveau** :
- ⭐ **Niveau 5** : Atteint le niveau 5 (50 points)
- 🌟 **Niveau 10** : Atteint le niveau 10 (100 points)

### 2. Déblocage des Badges

#### Processus Automatique

- Les badges sont débloqués **automatiquement** quand tu atteins les objectifs
- Tu reçois une notification quand tu débloques un badge
- Les points sont ajoutés automatiquement à ton compte

#### Affichage

- Tous tes badges sont affichés dans ta page de profil
- Icône, nom et description de chaque badge
- Date de déblocage

### 3. Points et Récompenses

#### Gain de Points

- Chaque badge donne des points
- Les points s'accumulent pour augmenter ton niveau
- Plus tu participes, plus tu gagnes de points

#### Utilisation des Points

- Les points déterminent ton niveau
- Les niveaux montrent ton engagement dans le système
- Classements basés sur les points

---

## 🔔 Notifications et Emails

### 1. Notifications sur le Site

#### Badges de Notification

- **Messages non lus** : Badge rouge avec le nombre de messages non lus
- **Nouveaux messages** : Notification en temps réel
- **Badges débloqués** : Notification quand tu débloques un badge

#### Affichage

- Badges de notification dans la sidebar
- Mise à jour en temps réel
- Cliquer pour voir les détails

### 2. Notifications Email

#### Envoi Automatique

Quand tu reçois un message :
- Email automatique avec :
  - Nom de l'expéditeur
  - Extrait du message
  - Lien pour voir le message complet

#### Avantages

- Tu ne rates jamais un message
- Tu es informé même si tu n'es pas connecté
- Crée un sentiment de connexion

### 3. Paramètres de Notifications

#### Contrôle

- Tu peux gérer tes préférences de notifications
- Choisir quelles notifications tu veux recevoir
- Désactiver certaines notifications si nécessaire

---

## 🔐 Confidentialité et Données

### 1. Données Personnelles

#### Données Collectées

**Informations de Profil** :
- Nom complet
- Email
- Numéro de dossier
- Date d'anniversaire
- Photo de profil (optionnelle)

**Données d'Activité** :
- Messages envoyés et reçus
- Pages visitées
- Actions effectuées
- Statistiques d'utilisation

**Données Techniques** :
- Type de navigateur
- Système d'exploitation
- Résolution d'écran
- Adresse IP (pour la sécurité)

#### Utilisation des Données

- **Fonctionnement du système** : Pour que le système fonctionne correctement
- **Sécurité** : Pour protéger tous les utilisateurs
- **Amélioration** : Pour améliorer l'expérience utilisateur
- **Statistiques** : Pour générer des statistiques anonymes

### 2. Confidentialité des Messages

#### Messages Privés

- Tous les messages sont **privés** entre l'expéditeur et le destinataire
- Personne d'autre ne peut voir tes messages
- Les messages ne sont pas partagés publiquement

#### Accès Administrateur

- Les administrateurs peuvent voir les messages pour :
  - Modération et sécurité
  - Détection de contenus inappropriés
  - Résolution de problèmes

### 3. Protection des Données

#### Stockage Sécurisé

- Toutes les données sont stockées sur des **serveurs sécurisés** (Firebase/Google)
- Les données sont **chiffrées** en transit et au repos
- Conformité aux normes de sécurité modernes

#### Accès Restreint

- Seuls les élèves de la classe peuvent accéder au système
- Les professeurs et administrateurs ont un accès spécial
- Protection par authentification

### 4. Droits des Utilisateurs

#### Tes Droits

- **Accès** : Tu peux accéder à toutes tes données
- **Modification** : Tu peux modifier tes informations personnelles
- **Suppression** : Tu peux demander la suppression de tes données (contacter un administrateur)

#### Contact

- Pour toute question sur tes données, contacte un administrateur
- Les administrateurs peuvent t'aider avec tes droits

---

## ⚠️ Règles et Restrictions

### 1. Règles Générales

#### Comportement Attendu

- **Respect** : Sois respectueux envers tous les élèves
- **Bienveillance** : Envoie des messages bienveillants et positifs
- **Participation** : Participe activement aux célébrations
- **Respect des règles** : Respecte toutes les règles du système

#### Comportements Interdits

- ❌ Utiliser des mots inappropriés
- ❌ Essayer de contourner les filtres
- ❌ Envoyer des messages offensants ou blessants
- ❌ Abuser du système

### 2. Restrictions par Réputation

#### Réputation ≥ 50/100
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Peut envoyer des messages
- ✅ Peut participer aux défis

#### Réputation < 50/100
- ⚠️ **Ne peut plus envoyer de messages**
- ⚠️ Accès limité
- ⚠️ Doit améliorer sa réputation

#### Réputation < 20/100
- 🚨 **Risque de devenir "spectateur"**
- 🚨 Accès très limité
- 🚨 Mesures administratives possibles

### 3. Restrictions de Messages

#### Un Message par Personne

- Tu ne peux envoyer qu'**UN SEUL message** à chaque élève
- Une fois envoyé, tu ne peux plus modifier ou supprimer
- Le bouton devient gris et dit "Déjà envoyé ✓"

#### Pourquoi cette Restriction ?

- Équité : Tout le monde a la même chance
- Évite le spam
- Rend les messages plus significatifs

### 4. Restrictions de Vote

#### Un Vote par Type

- **Vote initial** : Un seul vote
- **Vote final** : Un seul vote
- Pas de modification après avoir voté

#### Pourquoi cette Restriction ?

- Équité : Chaque voix compte de la même manière
- Évite la manipulation
- Rend le vote démocratique

---

## ❓ FAQ (Foire Aux Questions)

### Questions Générales

**Q : Comment me connecter au système ?**
R : Utilise ton email et ton mot de passe. Si c'est ta première fois, tu dois changer ton mot de passe temporaire.

**Q : Que faire si j'oublie mon mot de passe ?**
R : Utilise la fonction "Mot de passe oublié" sur la page de connexion, ou contacte un administrateur.

**Q : Puis-je utiliser le système sur mon téléphone ?**
R : Oui ! Le système est **100% responsive** et fonctionne sur mobile, tablette et ordinateur.

### Messages

**Q : Puis-je changer mon message après l'avoir envoyé ?**
R : Non, c'est pour ça qu'il faut bien réfléchir avant d'envoyer. Une fois envoyé, tu ne peux plus modifier.

**Q : Puis-je voir qui m'a envoyé un message secret ?**
R : Oui, tu verras tous tes messages dans la section Messages, même les secrets. Tu verras le nom de l'expéditeur.

**Q : Pourquoi je ne peux envoyer qu'un seul message par personne ?**
R : C'est pour que ce soit équitable pour tout le monde. Chaque élève a la même chance de recevoir des messages.

**Q : Que se passe-t-il si j'essaie d'envoyer un message avec un mot interdit ?**
R : Le message sera **bloqué** et tu ne pourras pas l'envoyer. Tu perdras 5 points de réputation. Le message sera enregistré dans un journal.

### Réputation

**Q : Comment puis-je améliorer ma réputation ?**
R : Respecte les règles, envoie des messages respectueux, et participe activement aux célébrations.

**Q : Que se passe-t-il si ma réputation tombe en dessous de 50 ?**
R : Tu ne pourras plus envoyer de messages jusqu'à ce que ta réputation remonte.

**Q : Qui peut voir ma réputation ?**
R : Ta réputation est visible sur ta page d'accueil et dans les classements (si activés). Les administrateurs peuvent voir la réputation de tous les élèves.

### Défis et Progression

**Q : Que se passe-t-il si on n'atteint pas 9 personnes consécutives ?**
R : On continue d'essayer ! C'est un défi continu, pas une course. L'important est de participer.

**Q : Comment puis-je voir la progression du défi ?**
R : Va dans la section "Défis" ou "Progression" pour voir la progression actuelle et les détails.

**Q : Que se passe-t-il si quelqu'un oublie d'envoyer un message ?**
R : Si même une seule personne oublie, cette célébration ne compte pas dans la séquence consécutive. On recommence à zéro.

### Vote

**Q : Puis-je voter plusieurs fois ?**
R : Non, un seul vote par élève pour être équitable.

**Q : Comment je sais si le vote est activé ?**
R : Si le vote n'est pas activé, tu verras un message qui te le dit. Les professeurs t'informeront quand le vote sera ouvert.

**Q : Puis-je changer mon vote ?**
R : Non, une fois que tu as voté, tu ne peux plus changer. Réfléchis bien avant de voter.

### Badges et Points

**Q : Comment gagner des badges ?**
R : Les badges sont débloqués automatiquement quand tu atteins les objectifs (messages, jours actifs, célébrations, niveaux).

**Q : À quoi servent les points ?**
R : Les points déterminent ton niveau et ta position dans les classements. Plus tu participes, plus tu gagnes de points.

**Q : Comment augmenter mon niveau ?**
R : Gagne des points en participant activement : envoie des messages, sois actif régulièrement, participe aux célébrations, débloque des badges.

### Sécurité et Confidentialité

**Q : Mes messages sont-ils privés ?**
R : Oui, tous les messages sont privés entre toi et le destinataire. Personne d'autre ne peut les voir (sauf les administrateurs pour la modération).

**Q : Qui peut voir mes activités ?**
R : Les administrateurs peuvent voir tes activités pour la sécurité et la modération. Les autres élèves ne peuvent pas voir tes activités.

**Q : Mes données sont-elles sécurisées ?**
R : Oui, toutes les données sont stockées sur des serveurs sécurisés (Firebase/Google) et sont chiffrées.

**Q : Pourquoi le système surveille-t-il mes activités ?**
R : Pour la sécurité de tous, la détection de contenus inappropriés, et l'amélioration du système.

### Problèmes Techniques

**Q : Le site ne charge pas, que faire ?**
R : Vérifie ta connexion internet, rafraîchis la page, ou contacte un administrateur.

**Q : Je ne reçois pas les notifications email, pourquoi ?**
R : Vérifie ton dossier spam, ou contacte un administrateur pour vérifier que ton email est correct.

**Q : Mon message ne s'envoie pas, que faire ?**
R : Vérifie que ta réputation est ≥ 50, que tu n'as pas déjà envoyé un message à cette personne, et que ton message ne contient pas de mots interdits.

---

## 🎓 Conclusion

Ce guide t'a expliqué **TOUT** ce que tu dois savoir sur le système du point de vue d'un élève. Tu as maintenant une compréhension complète de :

- ✅ Toutes les fonctionnalités disponibles
- ✅ Le système de sécurité et de surveillance
- ✅ Le système de réputation et ses conséquences
- ✅ Les règles et restrictions
- ✅ Les statistiques et classements
- ✅ Les défis et la progression
- ✅ La messagerie privée
- ✅ Le calendrier des anniversaires
- ✅ Le système de vote
- ✅ Les badges et récompenses
- ✅ La confidentialité et les données

### Rappels Importants

1. **Respecte les règles** : Le système est conçu pour être sûr et bienveillant
2. **Participe activement** : Plus tu participes, plus tu gagnes de points et de badges
3. **Sois respectueux** : Envoie des messages bienveillants et positifs
4. **Collabore** : Le défi des 9 personnes nécessite la participation de tous
5. **Amuse-toi** : Le système est là pour rendre les célébrations plus spéciales !

### Besoin d'Aide ?

Si tu as des questions ou des problèmes :
- Consulte ce guide
- Contacte un administrateur
- Les professeurs peuvent aussi t'aider

**Bon courage et amuse-toi bien ! 🎉**

---

*Guide créé pour la classe 203 - 2025*
*Système développé par ONTech-Cloud Technology*

