/**
 * Script d'import automatique depuis FêteXpress.csv
 * Lit le fichier CSV et importe toutes les données dans Firestore
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Configuration Firebase
const FIREBASE_PROJECT_ID = 'projet-aniversaire';

// Initialiser Firebase Admin
let admin, db, auth;

// Essayer d'utiliser un fichier de service account s'il existe
// Chercher plusieurs noms possibles
const possibleServiceAccountPaths = [
  'firebase-service-account-key.json',
  'projet-aniversaire-firebase-adminsdk-*.json'
];

let serviceAccount = null;
let serviceAccountPath = null;

// Chercher un fichier JSON qui ressemble à un service account
const files = fs.readdirSync(__dirname);
for (const file of files) {
  if (file.endsWith('.json') && file.includes('firebase-adminsdk')) {
    const fullPath = path.join(__dirname, file);
    try {
      const content = require(fullPath);
      // Vérifier que c'est bien un service account
      if (content.type === 'service_account' && content.project_id === FIREBASE_PROJECT_ID) {
        serviceAccount = content;
        serviceAccountPath = fullPath;
        console.log(`📁 Fichier de service account trouvé: ${file}`);
        break;
      }
    } catch (error) {
      // Ignorer les fichiers JSON invalides
    }
  }
}

// Si pas trouvé, essayer le nom standard
if (!serviceAccount) {
  const standardPath = path.join(__dirname, 'firebase-service-account-key.json');
  if (fs.existsSync(standardPath)) {
    try {
      serviceAccount = require(standardPath);
      serviceAccountPath = standardPath;
      console.log('📁 Fichier de service account trouvé: firebase-service-account-key.json');
    } catch (error) {
      console.warn('⚠️  Impossible de charger le fichier de service account:', error.message);
    }
  }
}

try {
  if (serviceAccount) {
    // Utiliser le fichier de service account
    const adminModule = require('firebase-admin');
    admin = initializeApp({
      credential: adminModule.credential.cert(serviceAccount),
      projectId: FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin initialisé avec fichier de service account');
  } else {
    // Essayer avec les credentials par défaut (variable d'environnement)
    admin = initializeApp({
      projectId: FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin initialisé avec credentials par défaut');
  }
  db = getFirestore(admin);
  auth = getAuth(admin);
} catch (error) {
  console.error('❌ Erreur d\'initialisation Firebase Admin:', error.message);
  console.error('\n💡 Ce script nécessite Firebase Admin SDK avec des credentials.');
  console.error('\n📋 Options pour configurer les credentials:');
  console.error('\n   1. Télécharger la clé de service Firebase:');
  console.error('      https://console.firebase.google.com/project/projet-aniversaire/settings/serviceaccounts/adminsdk');
  console.error('      Sauvegarder comme: firebase-service-account-key.json');
  console.error('\n   2. OU configurer la variable d\'environnement:');
  console.error('      export GOOGLE_APPLICATION_CREDENTIALS="/chemin/vers/service-account-key.json"');
  console.error('\n   3. OU utiliser l\'interface admin.html pour importer manuellement');
  process.exit(1);
}

/**
 * Parse une ligne CSV simple (gère les guillemets)
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

/**
 * Normalise une date (DD/MM/YYYY vers YYYY-MM-DD ou garde YYYY-MM-DD)
 */
function normalizeDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  
  const trimmed = dateStr.trim();
  
  // Si déjà au format ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Si format français (DD/MM/YYYY)
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
  }
  
  return trimmed;
}

/**
 * Détecte les colonnes depuis l'en-tête
 */
function detectColumns(headerRow) {
  const columns = {};
  headerRow.forEach((col, index) => {
    const colLower = col.toLowerCase().trim();
    
    // Nom
    if (colLower === 'nom' || colLower === 'nom complet' || colLower === 'fullname' || colLower === 'name') {
      columns.fullName = index;
    }
    // Date
    else if (colLower === 'date' || colLower === 'anniversaire' || colLower === 'birthday' || colLower === 'date de naissance') {
      columns.birthday = index;
    }
    // Fiche
    else if (colLower === 'fiche' || colLower === 'numéro de fiche' || colLower === 'filenumber') {
      columns.fileNumber = index;
    }
    // Classe
    else if (colLower === 'classe' || colLower === 'numéro de classe' || colLower === 'classnumber') {
      columns.classNumber = index;
    }
    // Genre
    else if (colLower === 'genre' || colLower === 'sexe' || colLower === 'gender') {
      columns.gender = index;
    }
    // Info
    else if (colLower === 'info' || colLower === 'information' || colLower === 'extrainfo') {
      columns.extraInfo = index;
    }
  });
  
  return columns;
}

/**
 * Crée un compte utilisateur dans Firebase Auth et Firestore
 */
async function createUserAccount(fileNumber, fullName, birthday, classNumber, gender) {
  if (!fileNumber) return null;
  
  const email = `${fileNumber}@cslaval.qc.ca`;
  const tempPassword = 'Login123';
  
  try {
    // 1. Créer l'utilisateur dans Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: email,
        password: tempPassword,
        emailVerified: false,
        disabled: false
      });
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        // L'utilisateur existe déjà, récupérer son UID
        userRecord = await auth.getUserByEmail(email);
      } else {
        throw error;
      }
    }
    
    // 2. Créer/mettre à jour le document dans Firestore
    const userData = {
      email: email,
      fullName: fullName,
      role: 'eleve',
      status: 'active',
      disabled: false,
      profileCompleted: false,
      needsPasswordChange: true, // Flag pour indiquer que le mot de passe doit être changé
      reputation: 100,
      accountType: 'standard',
      birthday: birthday,
      fileNumber: fileNumber,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    // Ajouter les champs optionnels
    if (classNumber) userData.classNumber = classNumber;
    if (gender) userData.gender = gender;
    
    const userRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      await userRef.update({
        ...userData,
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
      await userRef.set(userData);
    }
    
    return userRecord.uid;
  } catch (error) {
    console.error(`   ⚠️  Erreur création compte pour ${email}:`, error.message);
    return null;
  }
}

/**
 * Teste la connexion à Firestore
 */
async function testConnection() {
  try {
    // Essayer de lire une collection pour tester la connexion
    const testRef = db.collection('celebrations').limit(1);
    await testRef.get();
    console.log('✅ Connexion à Firestore réussie\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à Firestore:', error.message);
    console.error('\n💡 Vérifiez vos credentials Firebase Admin SDK');
    return false;
  }
}

/**
 * Importe les données depuis le CSV
 */
async function importFromCSV() {
  // Tester la connexion d'abord
  const connected = await testConnection();
  if (!connected) {
    process.exit(1);
  }
  
  const csvPath = path.join(__dirname, 'FêteXpress.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Fichier introuvable: ${csvPath}`);
    process.exit(1);
  }
  
  console.log(`📖 Lecture du fichier: ${csvPath}`);
  
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    console.error('❌ Le fichier CSV est vide');
    process.exit(1);
  }
  
  // Parser l'en-tête
  const headerRow = parseCSVLine(lines[0]);
  const columns = detectColumns(headerRow);
  
  console.log('📋 Colonnes détectées:', columns);
  
  if (columns.fullName === undefined || columns.birthday === undefined) {
    console.error('❌ Colonnes obligatoires manquantes (Nom et Date)');
    console.error('   Colonnes trouvées:', headerRow);
    process.exit(1);
  }
  
  let imported = 0;
  let errors = 0;
  let skipped = 0;
  let duplicates = 0;
  let accountsCreated = 0;
  let accountsSkipped = 0;
  
  // Traiter chaque ligne (sauf l'en-tête)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const row = parseCSVLine(line);
    
    // Extraire les données selon les colonnes détectées
    const fullName = columns.fullName !== undefined ? (row[columns.fullName] || '').trim() : '';
    const birthday = columns.birthday !== undefined ? (row[columns.birthday] || '').trim() : '';
    const fileNumber = columns.fileNumber !== undefined ? (row[columns.fileNumber] || '').trim() : '';
    const classNumber = columns.classNumber !== undefined ? (row[columns.classNumber] || '').trim() : '';
    const gender = columns.gender !== undefined ? (row[columns.gender] || '').trim() : '';
    const extraInfo = columns.extraInfo !== undefined ? (row[columns.extraInfo] || '').trim() : '';
    
    // Vérifier que le nom et la date sont présents
    if (!fullName || !birthday) {
      skipped++;
      console.log(`⏭️  Ligne ${i + 1} ignorée (nom ou date manquant)`);
      continue;
    }
    
    // Normaliser la date
    const normalizedDate = normalizeDate(birthday);
    if (!normalizedDate) {
      errors++;
      console.log(`❌ Ligne ${i + 1} ignorée (date invalide: ${birthday})`);
      continue;
    }
    
    try {
      // Vérifier si une célébration avec le même nom et la même date existe déjà
      const existingCelebrations = await db.collection('celebrations')
        .where('fullName', '==', fullName)
        .where('birthday', '==', normalizedDate)
        .limit(1)
        .get();
      
      if (!existingCelebrations.empty) {
        duplicates++;
        console.log(`⚠️  ${i + 1}. ${fullName} (${normalizedDate}) - Doublon ignoré`);
        continue;
      }
      
      // Préparer les données
      const celebData = {
        fullName: fullName,
        birthday: normalizedDate,
        createdAt: FieldValue.serverTimestamp()
      };
      
      // Ajouter les champs optionnels s'ils existent
      if (fileNumber) celebData.fileNumber = fileNumber;
      if (classNumber) celebData.classNumber = classNumber;
      if (gender) celebData.gender = gender;
      if (extraInfo) celebData.extraInfo = extraInfo;
      
      // Ajouter à Firestore
      await db.collection('celebrations').add(celebData);
      
      // Créer le compte utilisateur si fileNumber est présent
      if (fileNumber) {
        const uid = await createUserAccount(fileNumber, fullName, normalizedDate, classNumber, gender);
        if (uid) {
          accountsCreated++;
          console.log(`   👤 Compte créé: ${fileNumber}@cslaval.qc.ca`);
        } else {
          accountsSkipped++;
        }
      }
      
      imported++;
      console.log(`✅ ${i + 1}. ${fullName} (${normalizedDate})`);
      
    } catch (error) {
      errors++;
      console.error(`❌ Erreur ligne ${i + 1} (${fullName}):`, error.message);
    }
  }
  
  console.log('\n📊 Résumé de l\'import:');
  console.log(`   ✅ Célébrations importées: ${imported}`);
  console.log(`   👤 Comptes utilisateurs créés: ${accountsCreated}`);
  console.log(`   ⚠️  Doublons ignorés: ${duplicates}`);
  console.log(`   ⏭️  Ignorés: ${skipped}`);
  console.log(`   ❌ Erreurs: ${errors}`);
  console.log(`   📝 Total traité: ${imported + duplicates + skipped + errors}`);
  if (accountsSkipped > 0) {
    console.log(`   ⚠️  Comptes non créés (déjà existants ou erreur): ${accountsSkipped}`);
  }
}

// Exécuter l'import
console.log('🚀 Démarrage de l\'import depuis FêteXpress.csv...\n');
importFromCSV()
  .then(() => {
    console.log('\n✅ Import terminé avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de l\'import:', error);
    process.exit(1);
  });

