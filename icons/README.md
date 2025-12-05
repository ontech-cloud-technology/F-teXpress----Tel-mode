# Icônes PWA pour Fête Express

Ce dossier contient toutes les icônes nécessaires pour l'installation de l'application en Progressive Web App (PWA).

## ✅ Icônes générées

Toutes les icônes suivantes ont été générées automatiquement :

1. **icon-72.png** - 72x72 pixels (Android)
2. **icon-96.png** - 96x96 pixels (Android)
3. **icon-128.png** - 128x128 pixels (Android)
4. **icon-144.png** - 144x144 pixels (Android)
5. **icon-152.png** - 152x152 pixels (iOS)
6. **icon-192.png** - 192x192 pixels (Android/iOS - Minimum requis)
7. **icon-384.png** - 384x384 pixels (Android)
8. **icon-512.png** - 512x512 pixels (Android/iOS - Minimum requis)

## 🎨 Source SVG

Le fichier **icon-source.svg** contient le design original de l'icône (gâteau avec bougies sur fond dégradé indigo-violet-rose).

## 🔄 Régénérer les icônes

Si vous modifiez le SVG source, vous pouvez régénérer toutes les icônes avec :

```bash
npm run generate-icons
```

Ou directement :

```bash
node generate-icons.js
```

**Note:** Le script nécessite `sharp` qui est installé comme dépendance de développement.

## Comment créer les icônes

### Option 1 : Utiliser un outil en ligne
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

### Option 2 : Créer manuellement
1. Créez une image carrée avec un fond transparent ou coloré
2. Ajoutez le logo/icône de Fête Express (gâteau, célébration, etc.)
3. Redimensionnez à 192x192 et 512x512 pixels
4. Enregistrez au format PNG

### Option 3 : Utiliser une image existante
Si vous avez déjà un logo, vous pouvez le redimensionner :
- Utilisez un outil comme [ImageMagick](https://imagemagick.org/) ou [GIMP](https://www.gimp.org/)
- Ou un service en ligne comme [ResizeImage.net](https://www.resizeimage.net/)

## Design recommandé

- **Couleur de fond** : #6366f1 (indigo) ou dégradé indigo-violet
- **Icône** : Gâteau, bougies, ou logo Fête Express
- **Style** : Moderne, arrondi, adapté aux écrans d'accueil iOS et Android

## Vérification

Une fois les icônes créées, vérifiez que :
- Les fichiers sont bien nommés `icon-192.png` et `icon-512.png`
- Ils sont dans le dossier `/icons/`
- Les chemins dans `manifest.json` sont corrects (`/icons/icon-192.png`)

