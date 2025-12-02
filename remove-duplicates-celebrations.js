/**
 * Script pour supprimer les doublons dans la collection celebrations
 * Garde la première occurrence et supprime les autres
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Configuration Firebase
const FIREBASE_PROJECT_ID = 'projet-aniversaire';

// Initialiser Firebase Admin
let admin, db;

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
} catch (error) {
  console.error('❌ Erreur d\'initialisation Firebase Admin:', error.message);
  process.exit(1);
}

/**
 * Supprime les doublons dans la collection celebrations
 */
async function removeDuplicates() {
  console.log('🔍 Recherche des doublons...\n');
  
  try {
    // Récupérer toutes les célébrations
    const snapshot = await db.collection('celebrations').get();
    const celebrations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📊 Total de célébrations trouvées: ${celebrations.length}`);
    
    // Grouper par nom et date d'anniversaire
    const groups = {};
    const duplicates = [];
    
    celebrations.forEach(celeb => {
      const key = `${celeb.fullName || ''}_${celeb.birthday || ''}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(celeb);
    });
    
    // Identifier les doublons (groupes avec plus d'un élément)
    Object.keys(groups).forEach(key => {
      if (groups[key].length > 1) {
        // Garder le premier (le plus ancien ou celui avec createdAt le plus ancien)
        const sorted = groups[key].sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return aTime - bTime;
        });
        
        const toKeep = sorted[0];
        const toDelete = sorted.slice(1);
        
        duplicates.push({
          key: key,
          keep: toKeep,
          delete: toDelete
        });
      }
    });
    
    console.log(`\n⚠️  Groupes de doublons trouvés: ${duplicates.length}\n`);
    
    if (duplicates.length === 0) {
      console.log('✅ Aucun doublon trouvé !');
      return;
    }
    
    let deleted = 0;
    
    // Supprimer les doublons
    for (const dup of duplicates) {
      console.log(`📝 ${dup.key}:`);
      console.log(`   ✅ Garde: ${dup.keep.id} (${dup.keep.fullName} - ${dup.keep.birthday})`);
      
      for (const item of dup.delete) {
        try {
          await db.collection('celebrations').doc(item.id).delete();
          deleted++;
          console.log(`   🗑️  Supprimé: ${item.id} (${item.fullName} - ${item.birthday})`);
        } catch (error) {
          console.error(`   ❌ Erreur lors de la suppression de ${item.id}:`, error.message);
        }
      }
      console.log('');
    }
    
    console.log('\n📊 Résumé:');
    console.log(`   ✅ Célébrations conservées: ${celebrations.length - deleted}`);
    console.log(`   🗑️  Doublons supprimés: ${deleted}`);
    console.log(`   📝 Total initial: ${celebrations.length}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des doublons:', error);
    throw error;
  }
}

// Exécuter la suppression des doublons
console.log('🚀 Démarrage de la suppression des doublons...\n');
removeDuplicates()
  .then(() => {
    console.log('\n✅ Suppression des doublons terminée avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors de la suppression des doublons:', error);
    process.exit(1);
  });

