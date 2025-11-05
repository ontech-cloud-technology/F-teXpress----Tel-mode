# 📅 Calendrier des Fêtes - Documentation

## 🎯 Vue d'ensemble

Page calendrier interactive et moderne qui affiche tous les anniversaires de la classe 203 dans un format mensuel visuel.

---

## ✨ Fonctionnalités

### 📆 **Calendrier Interactif**
- ✅ Vue mensuelle avec grille 7x7 (Dim-Sam)
- ✅ Navigation mois précédent/suivant
- ✅ Sélecteurs de mois et d'année (±5 ans)
- ✅ Bouton "Aujourd'hui" pour revenir à la date actuelle
- ✅ Jours du mois précédent/suivant affichés en transparence
- ✅ Jour actuel mis en évidence avec bordure colorée

### 🎂 **Affichage des Anniversaires**
- ✅ Jours avec anniversaires : fond dégradé coloré
- ✅ Indicateur du nombre d'anniversaires par jour (🎂 X)
- ✅ Effet hover sur les jours cliquables
- ✅ Animation de zoom au survol

### 🔍 **Modale de Détails**
Quand on clique sur un jour avec anniversaire(s) :
- ✅ Affichage de la date complète
- ✅ Liste de toutes les personnes nées ce jour
- ✅ Pour chaque personne :
  - Nom complet
  - Âge calculé automatiquement
  - Numéro de fiche
  - Numéro de classe
  - Genre
  - Information supplémentaire
  - Emoji festif 🎉

### 📊 **Statistiques en Temps Réel**
Trois cartes statistiques :
1. **Total** : Nombre total d'anniversaires enregistrés
2. **Ce mois-ci** : Anniversaires du mois affiché
3. **Aujourd'hui** : Anniversaires du jour même

### 🔄 **Synchronisation Automatique**
- ✅ Connexion en temps réel avec Firestore
- ✅ Mise à jour automatique quand un anniversaire est ajouté/modifié/supprimé
- ✅ Pas besoin de rafraîchir la page

---

## 🎨 Design

### Couleurs
- **Fond principal** : Dégradé violet foncé (`#1a0f30` → `#2c1a4b`)
- **Couleur primaire** : Corail (`#ff6f61`)
- **Couleur secondaire** : Jaune doré (`#f9c74f`)
- **Jours avec anniversaires** : Dégradé primaire/secondaire

### Responsive
- ✅ Desktop : Calendrier spacieux avec sidebar
- ✅ Tablet : Adaptation automatique
- ✅ Mobile : Grille compacte, texte réduit

---

## 🔐 Accès et Navigation

### Rôles Autorisés
- ✅ **Tous les utilisateurs connectés** (admin, comité, professeur, élève)

### Navigation Intelligente
Le lien "Tableau de Bord" dans la sidebar s'adapte au rôle :
- **Admin** → `admin.html` (Dashboard Admin)
- **Comité** → `committee.html` (Gestion Comité)
- **Professeur** → `teacher.html` (Professeur)
- **Élève** → `eleve.html` (Mon Profil)

### Liens vers le Calendrier
Depuis les pages suivantes, le lien "Calendrier des Fêtes" redirige vers `calendrier.html` :
- ✅ `admin.html`
- ✅ `committee.html`
- ✅ `teacher.html` (si créé)
- ✅ `eleve.html` (si mis à jour)

---

## 🎮 Utilisation

### Navigation dans le Calendrier

#### Méthode 1 : Boutons
- **Mois Précédent** : Flèche gauche
- **Mois Suivant** : Flèche droite
- **Aujourd'hui** : Revenir au mois actuel

#### Méthode 2 : Sélecteurs
- **Menu déroulant Mois** : Choisir parmi les 12 mois
- **Menu déroulant Année** : Choisir l'année (±5 ans)

### Voir les Détails
1. Repérer un jour avec l'indicateur 🎂
2. Cliquer sur le jour
3. La modale s'ouvre avec tous les détails
4. Cliquer sur ✕ ou en dehors pour fermer

---

## 📱 Interface

### Sidebar (Menu Latéral)
```
203 Hub
├── 📅 Calendrier des Fêtes (actif)
├── 📊 Tableau de Bord (selon rôle)
└── 🚪 Déconnexion
    Connecté: [Nom] ([Rôle])
```

### Contrôles du Calendrier
```
[← Mois Précédent]  [Janvier 2025]  [Mois Suivant →]
                     [Aujourd'hui]

Mois: [Sélecteur ▼]    Année: [Sélecteur ▼]
```

### Grille du Calendrier
```
Dim  Lun  Mar  Mer  Jeu  Ven  Sam
 29   30   31    1    2    3    4
  5    6    7    8    9   10   11
 12   13   14   15   16   17   18
 19   20   21   22   23   24   25
 26   27   28   29   30   31    1
```

### Statistiques
```
🎂              📅              🎁
 42         Ce Mois-ci      Aujourd'hui
Total           8               2
```

---

## 🔧 Fonctionnalités Techniques

### Calcul Automatique
- **Âge** : Calculé en temps réel (année actuelle - année de naissance)
- **Jour de la semaine** : Positionné automatiquement dans la grille
- **Mois précédent/suivant** : Jours affichés en transparence

### Performance
- ✅ Listener Firestore unique (pas de rechargement multiple)
- ✅ Rendu optimisé du calendrier
- ✅ Mise à jour ciblée des statistiques

### Gestion des Données
- **Format de date** : `YYYY-MM-DD` (ex: `2009-05-23`)
- **Parsing** : Split sur `-` pour extraire année/mois/jour
- **Validation** : Vérification de la présence et du format

---

## 🎯 Cas d'Usage

### Scénario 1 : Consulter les anniversaires du mois
1. Ouvrir `calendrier.html`
2. Le mois actuel s'affiche automatiquement
3. Les jours avec anniversaires sont colorés
4. La statistique "Ce mois-ci" indique le nombre

### Scénario 2 : Voir un anniversaire spécifique
1. Repérer le jour coloré avec 🎂
2. Cliquer dessus
3. Lire les informations détaillées
4. Fermer la modale

### Scénario 3 : Naviguer dans le temps
1. Utiliser les flèches ou les sélecteurs
2. Explorer les mois passés/futurs
3. Cliquer sur "Aujourd'hui" pour revenir

### Scénario 4 : Vérifier les anniversaires d'aujourd'hui
1. Regarder la statistique "Aujourd'hui"
2. Si > 0, le jour actuel est coloré
3. Cliquer pour voir les détails

---

## 🎨 Indicateurs Visuels

### Couleurs des Jours
- **Gris foncé** : Jour normal sans anniversaire
- **Dégradé coloré** : Jour avec anniversaire(s)
- **Bordure rouge** : Jour actuel (aujourd'hui)
- **Transparent** : Jours du mois précédent/suivant

### Icônes
- 🎂 : Indicateur d'anniversaire
- 🎉 : Emoji festif dans la modale
- 📅 : Calendrier
- 🎁 : Cadeau/célébration

---

## 📝 Notes Importantes

### Format des Dates
Les dates doivent être au format `YYYY-MM-DD` dans Firestore pour être correctement affichées.

### Années Affichées
Le sélecteur d'année affiche :
- **5 ans avant** l'année actuelle
- **Année actuelle**
- **5 ans après** l'année actuelle

### Calcul de l'Âge
L'âge est calculé comme : `Année affichée - Année de naissance`

Exemple : Si on affiche 2025 et la personne est née en 2009 → 16 ans

---

## 🚀 Avantages

1. ✅ **Visuel et Intuitif** : Format calendrier familier
2. ✅ **Interactif** : Clics, hovers, animations
3. ✅ **Complet** : Toutes les informations disponibles
4. ✅ **Temps Réel** : Synchronisation automatique
5. ✅ **Responsive** : Fonctionne sur tous les appareils
6. ✅ **Accessible** : Tous les rôles peuvent y accéder
7. ✅ **Moderne** : Design élégant et professionnel
