# 📊 Guide d'Import Excel/CSV

## Format du fichier Excel/CSV

Pour importer des personnes/anniversaires, créez un fichier Excel (.xlsx) ou CSV avec les colonnes suivantes :

### Colonnes acceptées (au moins une variante par champ)

| Champ | Variantes acceptées | Obligatoire | Exemple |
|-------|-------------------|-------------|---------|
| **Nom** | `Nom`, `Nom Complet`, `fullName`, `name` | ✅ Oui | Jean Dupont |
| **Date** | `Date`, `Anniversaire`, `birthday`, `Date de Naissance` | ✅ Oui | 2009-05-23 ou 23/05/2009 |
| **Fiche** | `Fiche`, `Numéro de Fiche`, `fileNumber` | ❌ Non | 203001 |
| **Classe** | `Classe`, `Numéro de Classe`, `classNumber` | ❌ Non | 501 |
| **Genre** | `Genre`, `Sexe`, `gender` | ❌ Non | F, M, ou A |
| **Info** | `Info`, `Information`, `extraInfo` | ❌ Non | Délégué de classe |

---

## 📝 Exemple de fichier Excel

### Option 1 : Format simple (colonnes en français)

| Nom | Date | Fiche | Classe | Genre | Info |
|-----|------|-------|--------|-------|------|
| Jean Dupont | 23/05/2009 | 203001 | 501 | M | Délégué |
| Marie Martin | 15/03/2009 | 203002 | 501 | F | |
| Alex Dubois | 2009-08-12 | 203003 | 502 | A | |

### Option 2 : Format technique (colonnes en anglais)

| fullName | birthday | fileNumber | classNumber | gender | extraInfo |
|----------|----------|------------|-------------|--------|-----------|
| Jean Dupont | 2009-05-23 | 203001 | 501 | M | Délégué |
| Marie Martin | 2009-03-15 | 203002 | 501 | F | |
| Alex Dubois | 2009-08-12 | 203003 | 502 | A | |

---

## 📅 Formats de date acceptés

- **Format ISO** : `YYYY-MM-DD` (ex: `2009-05-23`) ✅ Recommandé
- **Format français** : `DD/MM/YYYY` (ex: `23/05/2009`) ✅ Accepté

---

## ⚠️ Points importants

1. **Nom et Date obligatoires** : Les lignes sans nom ou sans date seront ignorées
2. **Première ligne = En-têtes** : La première ligne doit contenir les noms des colonnes
3. **Encodage** : Utilisez UTF-8 pour les caractères accentués
4. **Formats multiples** : Le système détecte automatiquement les noms de colonnes

---

## 🎯 Étapes pour importer

1. Préparez votre fichier Excel avec les colonnes ci-dessus
2. Dans l'admin, section "Personnes & Célébrations"
3. Cliquez sur "Importer Excel/CSV"
4. Sélectionnez votre fichier
5. Le système affichera le nombre de personnes importées

---

## 📤 Export PDF

Le bouton "Exporter en PDF" génère un document moderne avec :

- ✅ En-tête coloré avec logo
- ✅ Liste complète triée par date d'anniversaire
- ✅ Cartes individuelles pour chaque personne
- ✅ Toutes les informations (nom, date, fiche, classe, genre)
- ✅ Pagination automatique
- ✅ Pied de page avec numéros de page
- ✅ Design professionnel et moderne

Le fichier sera téléchargé automatiquement avec le nom : `Anniversaires_203_[DATE].pdf`
