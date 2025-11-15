#!/bin/bash

# Script pour installer les dépendances et convertir automatiquement le PowerPoint

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Installation et conversion automatique du PowerPoint${NC}\n"

# Détecter le système d'exploitation
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
else
    echo -e "${RED}❌ Système d'exploitation non supporté${NC}"
    exit 1
fi

echo -e "${BLUE}Système détecté: ${OS}${NC}\n"

# Vérifier et installer LibreOffice
if ! command -v libreoffice &> /dev/null; then
    echo -e "${YELLOW}⚠️  LibreOffice n'est pas installé${NC}"
    echo -e "${BLUE}Installation de LibreOffice...${NC}"
    
    if [ "$OS" == "macos" ]; then
        if ! command -v brew &> /dev/null; then
            echo -e "${RED}❌ Homebrew n'est pas installé${NC}"
            echo -e "${YELLOW}Installez Homebrew: https://brew.sh${NC}"
            exit 1
        fi
        brew install --cask libreoffice
    elif [ "$OS" == "linux" ]; then
        sudo apt-get update
        sudo apt-get install -y libreoffice
    fi
else
    echo -e "${GREEN}✅ LibreOffice est déjà installé${NC}"
fi

# Vérifier et installer poppler (pour pdftoppm)
if ! command -v pdftoppm &> /dev/null; then
    echo -e "${YELLOW}⚠️  poppler-utils n'est pas installé${NC}"
    echo -e "${BLUE}Installation de poppler...${NC}"
    
    if [ "$OS" == "macos" ]; then
        brew install poppler
    elif [ "$OS" == "linux" ]; then
        sudo apt-get install -y poppler-utils
    fi
else
    echo -e "${GREEN}✅ poppler-utils est déjà installé${NC}"
fi

echo -e "\n${GREEN}✅ Toutes les dépendances sont installées${NC}\n"

# Exécuter le script de conversion Node.js
echo -e "${BLUE}🔄 Conversion du PowerPoint en images...${NC}\n"

if [ -f "convert-pptx-to-slides.js" ]; then
    node convert-pptx-to-slides.js
else
    echo -e "${RED}❌ Script de conversion introuvable${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Conversion terminée!${NC}"

