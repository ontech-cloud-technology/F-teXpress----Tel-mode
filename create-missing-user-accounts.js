/**
 * Script pour créer les comptes utilisateurs manquants
 * Pour les célébrations qui ont un fileNumber mais pas de compte utilisateur
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

// Configuration Firebase
const FIREBASE_PROJECT_ID = 'projet-aniversaire';

// Initialiser Firebase Admin
let admin, db, auth;

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
  db = getFirestore(admin);
  auth = getAuth(admin);
} catch (error) {
  console.error('❌ Erreur d\'initialisation Firebase Admin:', error.message);
  process.exit(1);
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
      console.log(`   ✅ Utilisateur créé dans Auth: ${email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        // L'utilisateur existe déjà, récupérer son UID
        userRecord = await auth.getUserByEmail(email);
        console.log(`   ⚠️  Utilisateur existe déjà dans Auth: ${email}`);
      } else {
        throw error;
      }
    }
    
    // 2. Vérifier si le document existe déjà dans Firestore
    const userRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userRef.get();
    
    const userData = {
      email: email,
      fullName: fullName,
      role: 'eleve',
      status: 'active',
      disabled: false,
      profileCompleted: false,
      needsPasswordChange: true,
      reputation: 100,
      accountType: 'standard',
      birthday: birthday,
      fileNumber: fileNumber,
      updatedAt: FieldValue.serverTimestamp()
    };
    
    // Ajouter les champs optionnels
    if (classNumber) userData.classNumber = classNumber;
    if (gender) userData.gender = gender;
    
    if (userDoc.exists) {
      // Mettre à jour seulement les champs manquants
      const existingData = userDoc.data();
      const updateData = { ...userData };
      
      // Garder les champs existants importants
      if (existingData.createdAt) updateData.createdAt = existingData.createdAt;
      else updateData.createdAt = FieldValue.serverTimestamp();
      
      await userRef.update(updateData);
      console.log(`   ✅ Document Firestore mis à jour: ${email}`);
    } else {
      userData.createdAt = FieldValue.serverTimestamp();
      await userRef.set(userData);
      console.log(`   ✅ Document Firestore créé: ${email}`);
    }
    
    return userRecord.uid;
  } catch (error) {
    console.error(`   ❌ Erreur création compte pour ${email}:`, error.message);
    return null;
  }
}

/**
 * Crée les comptes utilisateurs manquants
 */
async function createMissingAccounts() {
  console.log('🔍 Recherche des célébrations avec fileNumber mais sans compte utilisateur...\n');
  
  try {
    // Récupérer toutes les célébrations avec fileNumber
    const celebrationsSnapshot = await db.collection('celebrations')
      .where('fileNumber', '!=', null)
      .get();
    
    const celebrations = celebrationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📊 Célébrations avec fileNumber trouvées: ${celebrations.length}\n`);
    
    let created = 0;
    let alreadyExists = 0;
    let errors = 0;
    let noFileNumber = 0;
    
    for (const celeb of celebrations) {
      const fileNumber = celeb.fileNumber;
      
      if (!fileNumber) {
        noFileNumber++;
        continue;
      }
      
      const email = `${fileNumber}@cslaval.qc.ca`;
      
      // Vérifier si un compte utilisateur existe déjà (par email dans Firestore)
      const usersSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (!usersSnapshot.empty) {
        alreadyExists++;
        console.log(`⏭️  ${celeb.fullName} (${email}) - Compte existe déjà`);
        continue;
      }
      
      // Vérifier aussi dans Firebase Auth
      let userExists = false;
      try {
        await auth.getUserByEmail(email);
        userExists = true;
      } catch (error) {
        if (error.code !== 'auth/user-not-found') {
          throw error;
        }
      }
      
      if (userExists) {
        alreadyExists++;
        console.log(`⏭️  ${celeb.fullName} (${email}) - Compte existe dans Auth mais pas dans Firestore`);
        // Créer quand même le document Firestore
        try {
          const userRecord = await auth.getUserByEmail(email);
          const userRef = db.collection('users').doc(userRecord.uid);
          const userData = {
            email: email,
            fullName: celeb.fullName,
            role: 'eleve',
            status: 'active',
            disabled: false,
            profileCompleted: false,
            needsPasswordChange: true,
            reputation: 100,
            accountType: 'standard',
            birthday: celeb.birthday,
            fileNumber: fileNumber,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
          };
          if (celeb.classNumber) userData.classNumber = celeb.classNumber;
          if (celeb.gender) userData.gender = celeb.gender;
          await userRef.set(userData);
          created++;
          console.log(`   ✅ Document Firestore créé pour ${email}`);
        } catch (error) {
          console.error(`   ❌ Erreur création document: ${error.message}`);
          errors++;
        }
        continue;
      }
      
      // Créer le compte
      console.log(`📝 Création du compte pour: ${celeb.fullName} (${email})`);
      const uid = await createUserAccount(
        fileNumber,
        celeb.fullName,
        celeb.birthday,
        celeb.classNumber,
        celeb.gender
      );
      
      if (uid) {
        created++;
      } else {
        errors++;
      }
      console.log('');
    }
    
    console.log('\n📊 Résumé:');
    console.log(`   ✅ Comptes créés: ${created}`);
    console.log(`   ⏭️  Comptes existants: ${alreadyExists}`);
    console.log(`   ❌ Erreurs: ${errors}`);
    console.log(`   ⚠️  Sans fileNumber: ${noFileNumber}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des comptes:', error);
    throw error;
  }
}

// Exécuter la création des comptes manquants
console.log('🚀 Démarrage de la création des comptes utilisateurs manquants...\n');
createMissingAccounts()
  .then(() => {
    console.log('\n✅ Création des comptes terminée avec succès!');
    console.log('\n💡 Les élèves peuvent maintenant se connecter avec:');
    console.log('   Email: [Numéro de Fiche]@cslaval.qc.ca');
    console.log('   Mot de passe: Login123');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de la création des comptes:', error);
    process.exit(1);
  });

