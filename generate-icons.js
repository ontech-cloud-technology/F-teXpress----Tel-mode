#!/usr/bin/env node

/**
 * Script pour générer toutes les tailles d'icônes PWA à partir du SVG source
 * Nécessite: npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ICONS_DIR = path.join(__dirname, 'icons');
const SVG_SOURCE = path.join(ICONS_DIR, 'icon-source.svg');

// Tailles d'icônes requises
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Couleurs pour la console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function generateIcons() {
    try {
        // Vérifier que le SVG source existe
        if (!fs.existsSync(SVG_SOURCE)) {
            log(`❌ Fichier SVG source introuvable: ${SVG_SOURCE}`, 'red');
            process.exit(1);
        }

        log('🎨 Génération des icônes PWA...', 'cyan');
        log(`📁 Dossier de sortie: ${ICONS_DIR}`, 'blue');

        // Générer chaque taille d'icône
        for (const size of ICON_SIZES) {
            const outputPath = path.join(ICONS_DIR, `icon-${size}.png`);
            
            try {
                await sharp(SVG_SOURCE)
                    .resize(size, size, {
                        fit: 'contain',
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    })
                    .png()
                    .toFile(outputPath);
                
                log(`✅ Créé: icon-${size}.png (${size}x${size})`, 'green');
            } catch (error) {
                log(`❌ Erreur lors de la création de icon-${size}.png: ${error.message}`, 'red');
            }
        }

        log('\n✨ Toutes les icônes ont été générées avec succès!', 'green');
        log(`📦 ${ICON_SIZES.length} fichiers créés dans ${ICONS_DIR}`, 'cyan');
        
    } catch (error) {
        log(`❌ Erreur: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Vérifier si sharp est installé
try {
    require.resolve('sharp');
    generateIcons();
} catch (e) {
    log('📦 Installation de sharp...', 'yellow');
    log('Exécutez: npm install sharp', 'yellow');
    log('Puis relancez: node generate-icons.js', 'yellow');
    process.exit(1);
}

