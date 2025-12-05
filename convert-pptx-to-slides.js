#!/usr/bin/env node

/**
 * Script pour convertir automatiquement un PowerPoint en images PNG
 * Une image par slide
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Chercher le fichier dans plusieurs emplacements possibles
const possiblePaths = [
    'Bienvenue-au-203-Celebration-Hub.pptx',
    'presentation-slides/Bienvenue-au-203-Celebration-Hub.pptx',
    './Bienvenue-au-203-Celebration-Hub.pptx',
    './presentation-slides/Bienvenue-au-203-Celebration-Hub.pptx'
];

let PPTX_FILE = null;
for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
        PPTX_FILE = filePath;
        break;
    }
}

const OUTPUT_DIR = 'presentation-slides';

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

function checkCommand(command) {
    try {
        execSync(`which ${command}`, { stdio: 'ignore' });
        return true;
    } catch {
        // Vérifier aussi soffice pour LibreOffice
        if (command === 'libreoffice') {
            try {
                execSync(`which soffice`, { stdio: 'ignore' });
                return true;
            } catch {
                return false;
            }
        }
        return false;
    }
}

function checkFile(file) {
    return fs.existsSync(file);
}

async function convertWithLibreOffice() {
    log('📄 Conversion PPTX → PDF avec LibreOffice...', 'blue');
    
    const tempDir = path.join(__dirname, 'temp-conversion');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    
    try {
        // Convertir PPTX en PDF (utiliser soffice qui est la vraie commande LibreOffice)
        const libreOfficeCmd = checkCommand('soffice') ? 'soffice' : (checkCommand('libreoffice') ? 'libreoffice' : '/opt/homebrew/bin/soffice');
        const env = { ...process.env, PATH: '/opt/homebrew/bin:' + (process.env.PATH || '') };
        execSync(`${libreOfficeCmd} --headless --convert-to pdf --outdir "${tempDir}" "${PPTX_FILE}"`, {
            stdio: 'inherit',
            env: env
        });
        
        const pdfFile = path.join(tempDir, path.basename(PPTX_FILE, '.pptx') + '.pdf');
        
        if (!checkFile(pdfFile)) {
            throw new Error('PDF non créé');
        }
        
        log('✅ PDF créé avec succès', 'green');
        return pdfFile;
    } catch (error) {
        log(`❌ Erreur lors de la conversion PDF: ${error.message}`, 'red');
        throw error;
    }
}

async function convertPDFToImages(pdfFile) {
    log('🖼️  Conversion PDF → Images PNG...', 'blue');
    
    // Créer le dossier de sortie
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    let method = null;
    
    // Méthode 1: pdftoppm (poppler-utils)
    if (checkCommand('pdftoppm')) {
        method = 'pdftoppm';
        log('Utilisation de pdftoppm...', 'cyan');
        
        try {
            // Convertir en PNG haute résolution
            execSync(`pdftoppm -png -r 300 "${pdfFile}" "${path.join(OUTPUT_DIR, 'slide')}"`, {
                stdio: 'inherit'
            });
            
            // Renommer les fichiers pour avoir slide-1.png, slide-2.png, etc.
            const files = fs.readdirSync(OUTPUT_DIR)
                .filter(f => f.startsWith('slide-') && f.endsWith('.png'))
                .sort();
            
            files.forEach((file, index) => {
                const oldPath = path.join(OUTPUT_DIR, file);
                const newPath = path.join(OUTPUT_DIR, `slide-${index + 1}.png`);
                if (oldPath !== newPath) {
                    fs.renameSync(oldPath, newPath);
                }
            });
            
            log('✅ Images créées avec pdftoppm', 'green');
            return true;
        } catch (error) {
            log(`❌ Erreur avec pdftoppm: ${error.message}`, 'red');
            method = null;
        }
    }
    
    // Méthode 2: ImageMagick convert
    if (!method && checkCommand('convert')) {
        method = 'imagemagick';
        log('Utilisation de ImageMagick...', 'cyan');
        
        try {
            execSync(`convert -density 300 "${pdfFile}" -quality 100 "${path.join(OUTPUT_DIR, 'slide-%d.png')}"`, {
                stdio: 'inherit'
            });
            
            // Renommer pour avoir slide-1.png, slide-2.png, etc.
            const files = fs.readdirSync(OUTPUT_DIR)
                .filter(f => f.startsWith('slide-') && f.endsWith('.png'))
                .sort((a, b) => {
                    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                    return numA - numB;
                });
            
            files.forEach((file, index) => {
                const oldPath = path.join(OUTPUT_DIR, file);
                const newPath = path.join(OUTPUT_DIR, `slide-${index + 1}.png`);
                if (oldPath !== newPath && !fs.existsSync(newPath)) {
                    fs.renameSync(oldPath, newPath);
                }
            });
            
            log('✅ Images créées avec ImageMagick', 'green');
            return true;
        } catch (error) {
            log(`❌ Erreur avec ImageMagick: ${error.message}`, 'red');
            method = null;
        }
    }
    
    // Méthode 3: Python avec pdf2image (si disponible)
    if (!method && checkCommand('python3')) {
        method = 'python';
        log('Tentative avec Python pdf2image...', 'cyan');
        
        try {
            // Vérifier si pdf2image est installé
            execSync('python3 -c "import pdf2image"', { stdio: 'ignore' });
            
            const pythonScript = `
from pdf2image import convert_from_path
import os

pdf_path = "${pdfFile}"
output_dir = "${OUTPUT_DIR}"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

images = convert_from_path(pdf_path, dpi=300)

for i, image in enumerate(images, 1):
    image.save(os.path.join(output_dir, f'slide-{i}.png'), 'PNG')

print(f"Converted {len(images)} slides")
`;
            
            execSync(`python3 -c "${pythonScript.replace(/\n/g, '; ')}"`, {
                stdio: 'inherit'
            });
            
            log('✅ Images créées avec Python', 'green');
            return true;
        } catch (error) {
            log(`❌ Python/pdf2image non disponible: ${error.message}`, 'yellow');
            method = null;
        }
    }
    
    return false;
}

async function main() {
    log('\n🚀 Conversion automatique du PowerPoint en images\n', 'cyan');
    
    // Vérifier que le fichier existe
    if (!checkFile(PPTX_FILE)) {
        log(`❌ Fichier introuvable: ${PPTX_FILE}`, 'red');
        log('\n📋 Instructions:', 'yellow');
        log('1. Assurez-vous que le fichier PowerPoint est dans le même dossier que ce script');
        log('2. Ou modifiez la variable PPTX_FILE dans le script', 'yellow');
        process.exit(1);
    }
    
    log(`✅ Fichier trouvé: ${PPTX_FILE}`, 'green');
    
    // Vérifier les outils disponibles
    const hasLibreOffice = checkCommand('soffice') || checkCommand('libreoffice');
    const hasPdfToPpm = checkCommand('pdftoppm');
    const hasImageMagick = checkCommand('convert');
    const hasPython = checkCommand('python3');
    
    log('\n🔧 Outils disponibles:', 'cyan');
    log(`  LibreOffice: ${hasLibreOffice ? '✅' : '❌'}`, hasLibreOffice ? 'green' : 'red');
    log(`  pdftoppm: ${hasPdfToPpm ? '✅' : '❌'}`, hasPdfToPpm ? 'green' : 'red');
    log(`  ImageMagick: ${hasImageMagick ? '✅' : '❌'}`, hasImageMagick ? 'green' : 'red');
    log(`  Python3: ${hasPython ? '✅' : '❌'}`, hasPython ? 'green' : 'red');
    
    if (!hasLibreOffice) {
        log('\n⚠️  LibreOffice n\'est pas installé', 'yellow');
        log('Installation (macOS): brew install --cask libreoffice', 'yellow');
        log('Installation (Linux): sudo apt-get install libreoffice', 'yellow');
        process.exit(1);
    }
    
    try {
        // Étape 1: Convertir PPTX en PDF
        const pdfFile = await convertWithLibreOffice();
        
        // Étape 2: Convertir PDF en images
        const success = await convertPDFToImages(pdfFile);
        
        if (!success) {
            log('\n❌ Aucune méthode de conversion PDF→PNG disponible', 'red');
            log('\n📋 Installation requise:', 'yellow');
            log('  Option 1: brew install poppler (pour pdftoppm)', 'yellow');
            log('  Option 2: brew install imagemagick (pour convert)', 'yellow');
            log('  Option 3: pip3 install pdf2image (pour Python)', 'yellow');
            process.exit(1);
        }
        
        // Compter les slides créées
        const slides = fs.readdirSync(OUTPUT_DIR)
            .filter(f => f.startsWith('slide-') && f.endsWith('.png'))
            .length;
        
        log(`\n✅ Conversion terminée! ${slides} slides créées dans ${OUTPUT_DIR}/`, 'green');
        log('\n🎉 Vous pouvez maintenant utiliser presentation-admin.html', 'cyan');
        
        // Nettoyer le dossier temporaire
        const tempDir = path.join(__dirname, 'temp-conversion');
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        
    } catch (error) {
        log(`\n❌ Erreur: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Exécuter le script
main().catch(error => {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    process.exit(1);
});

