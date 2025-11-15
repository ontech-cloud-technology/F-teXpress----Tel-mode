#!/bin/bash

# Script pour convertir un PowerPoint en images
# Nécessite LibreOffice ou ImageMagick

set -e

PPTX_FILE="Bienvenue-au-203-Celebration-Hub.pptx"
OUTPUT_DIR="presentation-slides"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Conversion du PowerPoint en images...${NC}"

# Créer le dossier de sortie
mkdir -p "$OUTPUT_DIR"

# Vérifier si le fichier existe
if [ ! -f "$PPTX_FILE" ]; then
    echo -e "${RED}Erreur: Fichier $PPTX_FILE introuvable${NC}"
    exit 1
fi

# Méthode 1: Utiliser LibreOffice (recommandé)
if command -v libreoffice &> /dev/null; then
    echo -e "${GREEN}Utilisation de LibreOffice...${NC}"
    libreoffice --headless --convert-to pdf "$PPTX_FILE" --outdir /tmp/
    PDF_FILE="/tmp/$(basename "$PPTX_FILE" .pptx).pdf"
    
    if command -v pdftoppm &> /dev/null; then
        pdftoppm -png -r 150 "$PDF_FILE" "$OUTPUT_DIR/slide-"
        # Renommer les fichiers pour avoir slide-1.png, slide-2.png, etc.
        counter=1
        for file in "$OUTPUT_DIR"/slide-*.png; do
            if [ -f "$file" ]; then
                mv "$file" "$OUTPUT_DIR/slide-$counter.png"
                ((counter++))
            fi
        done
        echo -e "${GREEN}✓ Conversion terminée! ${counter} slides créées${NC}"
    else
        echo -e "${RED}Erreur: pdftoppm non installé. Installez poppler-utils${NC}"
        exit 1
    fi
# Méthode 2: Utiliser unzip et ImageMagick (alternative)
elif command -v unzip &> /dev/null && command -v convert &> /dev/null; then
    echo -e "${YELLOW}Méthode alternative: extraction et conversion...${NC}"
    TEMP_DIR=$(mktemp -d)
    unzip -q "$PPTX_FILE" -d "$TEMP_DIR"
    
    # Extraire les images des slides
    counter=1
    for slide in "$TEMP_DIR/ppt/slides"/*.xml; do
        if [ -f "$slide" ]; then
            # Cette méthode est plus complexe, nécessite un parsing XML
            echo -e "${YELLOW}Méthode alternative non implémentée complètement${NC}"
            echo -e "${YELLOW}Veuillez installer LibreOffice pour une conversion automatique${NC}"
            rm -rf "$TEMP_DIR"
            exit 1
        fi
    done
    rm -rf "$TEMP_DIR"
else
    echo -e "${RED}Erreur: Aucun outil de conversion trouvé${NC}"
    echo -e "${YELLOW}Options:${NC}"
    echo "  1. Installer LibreOffice: brew install --cask libreoffice"
    echo "  2. Installer poppler-utils: brew install poppler"
    echo "  3. Ou convertir manuellement le PPTX en images PNG"
    exit 1
fi

echo -e "${GREEN}✓ Slides disponibles dans: $OUTPUT_DIR/${NC}"

