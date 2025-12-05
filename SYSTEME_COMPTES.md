# 🔐 Système de Création Automatique de Comptes Utilisateurs

## 📋 Vue d'ensemble

Le système permet aux administrateurs de créer automatiquement des comptes utilisateurs lors de l'ajout d'une personne dans la section "Célébrations".

---

## ✨ Fonctionnalités

### 1️⃣ **Ajout d'une Personne avec Compte Automatique**

Dans la section **"Personnes & Célébrations"** de l'admin :

#### Formulaire d'ajout :
- ✅ Nom Complet
- ✅ Date de Naissance
- ✅ **Numéro de Fiche** (obligatoire pour créer un compte)
- ✅ Numéro de Classe
- ✅ Genre
- ✅ Information Supplémentaire
- ✅ **Case à cocher : "Créer un compte utilisateur automatiquement"**

#### Si la case est cochée :
Le système crée automatiquement :
- **Email** : `[Numéro de Fiche]@cslaval.qc.ca`
  - Exemple : Si le numéro de fiche est `2030014`, l'email sera `2030014@cslaval.qc.ca`
- **Rôle** : `eleve` (automatique)
- **Mot de passe temporaire** : `login123`
- **Flag** : `needsPasswordChange: true` (dans Firestore)

---

## 🔄 Workflow de Première Connexion

### Étape 1 : L'élève se connecte
1. L'élève va sur `login.html`
2. Entre son email : `2030014@cslaval.qc.ca`
3. Entre le mot de passe temporaire : `login123`

### Étape 2 : Détection du mot de passe temporaire
Le système détecte que :
- ✅ Le mot de passe entré est `login123`
- ✅ Le flag `needsPasswordChange` est `true` dans Firestore

### Étape 3 : Redirection vers changement de mot de passe
- L'élève est automatiquement redirigé vers `change-password.html`
- Message : "Vous devez définir un nouveau mot de passe"

### Étape 4 : Définition du nouveau mot de passe
L'élève doit :
- ✅ Entrer un nouveau mot de passe (minimum 6 caractères)
- ✅ Confirmer le mot de passe
- ❌ Ne peut pas utiliser `login123` comme nouveau mot de passe

### Étape 5 : Validation et redirection
- Le mot de passe est mis à jour dans Firebase Auth
- Le flag `needsPasswordChange` est mis à `false` dans Firestore
- L'élève est redirigé vers `eleve.html` (calendrier)

---

## 🔒 Sécurité

### Protections en place :
1. **Mot de passe temporaire unique** : `login123` ne peut être utilisé qu'une seule fois
2. **Validation côté client** : Minimum 6 caractères
3. **Validation côté serveur** : Firebase Auth vérifie la complexité
4. **Flag de sécurité** : `needsPasswordChange` empêche l'accès normal tant que le mot de passe n'est pas changé
5. **Session temporaire** : Les infos sont stockées en `sessionStorage` uniquement

### Gestion des erreurs :
- ✅ Email déjà utilisé → Message informatif
- ✅ Numéro de fiche manquant → Pas de création de compte
- ✅ Mots de passe non identiques → Erreur de validation
- ✅ Mot de passe trop court → Erreur de validation

---

## 📊 Structure Firestore

### Collection `users`
```javascript
{
  uid: "abc123...",
  fullName: "Jean Dupont",
  email: "2030014@cslaval.qc.ca",
  role: "eleve",
  needsPasswordChange: true, // false après changement
  createdAt: Timestamp
}
```

### Collection `celebrations`
```javascript
{
  fullName: "Jean Dupont",
  birthday: "2009-05-23",
  fileNumber: "2030014",
  classNumber: "14",
  gender: "M",
  extraInfo: "",
  createdAt: Timestamp
}
```

---

## 🎯 Cas d'utilisation

### Scénario 1 : Ajout d'un élève avec compte
1. Admin coche la case "Créer un compte utilisateur"
2. Remplit le numéro de fiche : `2030014`
3. Soumet le formulaire
4. ✅ Personne ajoutée dans `celebrations`
5. ✅ Compte créé avec email `2030014@cslaval.qc.ca`
6. ✅ Message : "Personne et compte utilisateur créés avec succès !"

### Scénario 2 : Ajout d'un élève sans compte
1. Admin ne coche PAS la case
2. Soumet le formulaire
3. ✅ Personne ajoutée dans `celebrations`
4. ❌ Aucun compte utilisateur créé
5. ✅ Message : "Personne ajoutée avec succès !"

### Scénario 3 : Première connexion d'un élève
1. Élève entre `2030014@cslaval.qc.ca` et `login123`
2. ✅ Connexion réussie
3. ✅ Redirection automatique vers `change-password.html`
4. Élève définit son nouveau mot de passe
5. ✅ Redirection vers `eleve.html`

### Scénario 4 : Connexion normale (après changement)
1. Élève entre `2030014@cslaval.qc.ca` et son nouveau mot de passe
2. ✅ Connexion réussie
3. ✅ Redirection directe vers `eleve.html`
4. ❌ Pas de demande de changement de mot de passe

---

## 📝 Notes pour les Administrateurs

### Format de l'email :
- **Toujours** : `[NuméroFiche]@cslaval.qc.ca`
- Exemple : `2030014@cslaval.qc.ca`

### Mot de passe temporaire :
- **Toujours** : `login123`
- À communiquer aux élèves lors de la création du compte

### Informations à fournir aux élèves :
```
Votre compte a été créé !

Email : [NuméroFiche]@cslaval.qc.ca
Mot de passe temporaire : login123

⚠️ Vous devrez définir un nouveau mot de passe lors de votre première connexion.
```

---

## 🚀 Avantages du Système

1. ✅ **Automatisation** : Création de comptes en un clic
2. ✅ **Sécurité** : Changement de mot de passe obligatoire
3. ✅ **Simplicité** : Email basé sur le numéro de fiche (facile à retenir)
4. ✅ **Flexibilité** : Possibilité d'ajouter des personnes sans créer de compte
5. ✅ **Traçabilité** : Tous les comptes sont liés à un numéro de fiche unique
