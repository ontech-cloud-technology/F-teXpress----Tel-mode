# Page de Présentation Administrative

Cette page permet de présenter un PowerPoint de manière professionnelle avec des contrôles de navigation.

## 🔐 Accès

- **URL**: `presentation-admin.html`
- **Code d'accès**: `203ADMIN2024` (configurable dans le fichier)

## 📋 Fonctionnalités

- ✅ Authentification par code secret
- ✅ Affichage plein écran des slides
- ✅ Navigation avec boutons (Précédent/Suivant)
- ✅ Navigation au clavier (flèches ← →)
- ✅ Compteur de slides (X / Y)
- ✅ Mode plein écran optimisé pour présentation

## 🚀 Configuration

### 1. Convertir le PowerPoint en images

Le fichier `Bienvenue-au-203-Celebration-Hub.pptx` doit être converti en images PNG.

#### Option A: Script automatique Node.js (RECOMMANDÉ) ⚡

```bash
# Installer les dépendances (macOS)
brew install --cask libreoffice
brew install poppler

# Exécuter le script automatique
npm run convert-pptx
# ou directement:
node convert-pptx-to-slides.js
```

Le script va automatiquement:
1. ✅ Convertir le PPTX en PDF avec LibreOffice
2. ✅ Convertir le PDF en images PNG (une par slide)
3. ✅ Nommer les fichiers: slide-1.png, slide-2.png, etc.
4. ✅ Nettoyer les fichiers temporaires

#### Option B: Script bash (alternative)

```bash
# Installer les dépendances (macOS)
brew install --cask libreoffice
brew install poppler

# Exécuter le script
./convert-pptx.sh
```

#### Option B: Conversion manuelle

1. Ouvrir le PowerPoint
2. Exporter chaque slide en PNG (Fichier → Exporter → Changer le type de fichier → PNG)
3. Ou utiliser "Enregistrer sous" → Images → PNG
4. Placer les images dans le dossier `presentation-slides/`
5. Nommer les fichiers: `slide-1.png`, `slide-2.png`, `slide-3.png`, etc.

#### Option C: Utiliser PowerPoint en ligne

1. Uploader le fichier sur Google Slides ou PowerPoint Online
2. Exporter chaque slide en PNG
3. Télécharger et placer dans `presentation-slides/`

### 2. Structure des fichiers

```
presentation-slides/
├── slide-1.png
├── slide-2.png
├── slide-3.png
└── ...
```

### 3. Modifier le code d'accès

Éditer `presentation-admin.html` et changer la ligne:

```javascript
const ADMIN_ACCESS_CODE = '203ADMIN2024'; // Votre code ici
```

## 🎮 Utilisation

### Navigation

- **Boutons**: Cliquer sur "Précédent" ou "Suivant"
- **Clavier**: 
  - Flèche droite → ou Espace : Slide suivante
  - Flèche gauche ← : Slide précédente
  - ESC : Quitter la présentation

### Présentation

1. Ouvrir `presentation-admin.html` dans le navigateur
2. Entrer le code d'accès
3. Utiliser les contrôles pour naviguer
4. Mode plein écran recommandé (F11)

## 🔧 Personnalisation

### Changer le dossier des slides

Modifier dans `presentation-admin.html`:

```javascript
const SLIDES_DIR = 'presentation-slides/'; // Votre dossier ici
```

### Ajuster la qualité des images

Pour une meilleure qualité, exporter les slides en haute résolution (300 DPI recommandé).

## 📝 Notes

- Les images doivent être au format PNG pour une meilleure qualité
- Le format de nommage est strict: `slide-1.png`, `slide-2.png`, etc.
- La page fonctionne hors ligne une fois les images chargées
- Compatible avec tous les navigateurs modernes

