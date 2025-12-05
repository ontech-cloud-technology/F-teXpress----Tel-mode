/**
 * Script pour réinitialiser tous les mots de passe des élèves à 'Login123'
 * Utile si les mots de passe ont été modifiés ou sont incorrects
 */

const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

// Configuration Firebase
const FIREBASE_PROJECT_ID = 'projet-aniversaire';
const DEFAULT_PASSWORD = 'Login123';

// Initialiser Firebase Admin
let admin, auth;

// Chercher un fichier JSON qui ressemble à un service account
const files = fs.readdirSync(__dirname);
let serviceAccount = null;

for (const file of files) {
  if (file.endsWith('.json') && file.includes('firebase-adminsdk')) {
    const fullPath = path.join(__dirname, file);
    try {
      const content = require(fullPath);
      if (content.type === 'service_account' && content.project_id === FIREBASE_PROJECT_ID) {
        serviceAccount = content;
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
      console.log('📁 Fichier de service account trouvé: firebase-service-account-key.json');
    } catch (error) {
      console.warn('⚠️  Impossible de charger le fichier de service account:', error.message);
    }
  }
}

try {
  if (serviceAccount) {
    const adminModule = require('firebase-admin');
    admin = initializeApp({
      credential: adminModule.credential.cert(serviceAccount),
      projectId: FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin initialisé avec fichier de service account');
  } else {
    admin = initializeApp({
      projectId: FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin initialisé avec credentials par défaut');
  }
  auth = getAuth(admin);
} catch (error) {
  console.error('❌ Erreur d\'initialisation Firebase Admin:', error.message);
  process.exit(1);
}

/**
 * Réinitialise tous les mots de passe des élèves
 */
async function resetAllPasswords() {
  console.log(`🔐 Réinitialisation de tous les mots de passe à '${DEFAULT_PASSWORD}'...\n`);
  
  try {
    // Récupérer tous les utilisateurs
    let nextPageToken;
    let totalUsers = 0;
    let resetCount = 0;
    let errorCount = 0;
    
    do {
      const listUsersResult = await auth.listUsers(1000, nextPageToken);
      nextPageToken = listUsersResult.pageToken;
      
      for (const userRecord of listUsersResult.users) {
        totalUsers++;
        
        // Vérifier si c'est un email d'élève (format: [fileNumber]@cslaval.qc.ca)
        if (userRecord.email && userRecord.email.endsWith('@cslaval.qc.ca')) {
          try {
            await auth.updateUser(userRecord.uid, {
              password: DEFAULT_PASSWORD
            });
            resetCount++;
            console.log(`✅ ${userRecord.email} - Mot de passe réinitialisé`);
          } catch (error) {
            errorCount++;
            console.error(`❌ ${userRecord.email} - Erreur: ${error.message}`);
          }
        }
      }
    } while (nextPageToken);
    
    console.log('\n📊 Résumé:');
    console.log(`   📝 Total d'utilisateurs: ${totalUsers}`);
    console.log(`   ✅ Mots de passe réinitialisés: ${resetCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  }
}

// Exécuter la réinitialisation
console.log('🚀 Démarrage de la réinitialisation des mots de passe...\n');
resetAllPasswords()
  .then(() => {
    console.log('\n✅ Réinitialisation terminée avec succès!');
    console.log(`\n💡 Tous les élèves peuvent maintenant se connecter avec:`);
    console.log(`   Mot de passe: ${DEFAULT_PASSWORD}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de la réinitialisation:', error);
    process.exit(1);
  });

