/**
 * Script pour créer/réinitialiser le compte admin
 * Utilise Firebase Admin SDK pour créer ou mettre à jour le compte admin@ontech.com
 */

const admin = require('firebase-admin');
const serviceAccount = require('./projet-aniversaire-firebase-adminsdk-fbsvc-8ae5158210.json');

// Initialiser Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'projet-aniversaire'
  });
  console.log('✅ Firebase Admin initialisé');
}

const db = admin.firestore();
const auth = admin.auth();

const ADMIN_EMAIL = 'admin@ontech.com';
const ADMIN_PASSWORD = '123456';
const ADMIN_NAME = 'Administrateur';

async function fixAdminAccount() {
  try {
    console.log(`\n🔧 Vérification/création du compte admin: ${ADMIN_EMAIL}`);
    
    // 1. Vérifier si le compte existe dans Firebase Auth
    let userRecord;
    let userExists = false;
    
    try {
      userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
      userExists = true;
      console.log(`   ✅ Compte trouvé dans Firebase Auth (UID: ${userRecord.uid})`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`   ⚠️  Compte non trouvé dans Firebase Auth, création en cours...`);
        userExists = false;
      } else {
        throw error;
      }
    }
    
    // 2. Créer ou mettre à jour le compte dans Firebase Auth
    if (!userExists) {
      // Créer le compte
      userRecord = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
        disabled: false
      });
      console.log(`   ✅ Compte créé dans Firebase Auth (UID: ${userRecord.uid})`);
    } else {
      // Mettre à jour le mot de passe
      try {
        await auth.updateUser(userRecord.uid, {
          password: ADMIN_PASSWORD,
          emailVerified: true,
          disabled: false
        });
        console.log(`   ✅ Mot de passe mis à jour dans Firebase Auth`);
      } catch (updateError) {
        console.log(`   ⚠️  Erreur lors de la mise à jour du mot de passe: ${updateError.message}`);
        // Continuer quand même
      }
    }
    
    // 3. Vérifier/créer le document dans Firestore
    const userRef = db.collection('users').doc(userRecord.uid);
    const userDoc = await userRef.get();
    
    const userData = {
      email: ADMIN_EMAIL,
      fullName: ADMIN_NAME,
      role: 'admin',
      status: 'active',
      disabled: false,
      profileCompleted: true,
      rulesAccepted: true,
      needsPasswordChange: false,
      reputation: 100,
      accountType: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (userDoc.exists) {
      // Mettre à jour le document existant
      await userRef.update({
        ...userData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`   ✅ Document Firestore mis à jour`);
    } else {
      // Créer le document
      await userRef.set(userData);
      console.log(`   ✅ Document Firestore créé`);
    }
    
    console.log(`\n✅ Compte admin configuré avec succès !`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Mot de passe: ${ADMIN_PASSWORD}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`\n🎉 Vous pouvez maintenant vous connecter avec ces identifiants.`);
    
  } catch (error) {
    console.error(`\n❌ Erreur lors de la configuration du compte admin:`, error);
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter le script
fixAdminAccount()
  .then(() => {
    console.log('\n✅ Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });

