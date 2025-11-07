// Remplacez ces valeurs par votre configuration Firebase si elle change
const firebaseConfig = {
    apiKey: "AIzaSyDB6rcdICZkqicjO5R4sKBPOcL4IFkVRzI",
    authDomain: "projet-aniversaire.firebaseapp.com",
    projectId: "projet-aniversaire",
    storageBucket: "projet-aniversaire.firebasestorage.app",
    messagingSenderId: "910528476811",
    appId: "1:910528476811:web:421b250d3e53f8ee89068e"
};

// Initialisation de Firebase
// Utilisez les versions 'compat' pour la compatibilité avec les scripts CDN
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

/**
 * Fonction de connexion de l'utilisateur.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.UserCredential>}
 */
async function signInUser(email, password) {
    // Tente de connecter l'utilisateur via Firebase Auth
    return auth.signInWithEmailAndPassword(email, password);
}

/**
 * Fonction de déconnexion de l'utilisateur.
 */
function signOutUser() {
    return auth.signOut();
}

/**
 * Récupère le rôle et le nom complet d'un utilisateur depuis Firestore en utilisant son UID.
 * @param {string} uid - L'UID de l'utilisateur connecté (depuis Auth).
 * @returns {Promise<Object|null>} Un objet { role: string, name: string } ou null.
 */
async function getUserRole(uid) {
    if (!uid) return null;
    
    // Référence au document utilisateur dans la collection 'users'
    // Nous supposons que le document UID dans 'users' correspond à l'UID dans Auth.
    const docRef = db.collection("users").doc(uid);
    
    try {
        const doc = await docRef.get();

        if (doc.exists) {
            const data = doc.data();
            // Retourne l'objet de données nécessaire pour l'interface
            return { 
                role: data.role || 'eleve', // Rôle par défaut 'eleve' si non défini
                name: data.fullName || 'Utilisateur',
                needsPasswordChange: data.needsPasswordChange || false, // Flag pour changement de mot de passe
                email: data.email || ''
            };
        } else {
            console.warn(`[Firestore] Document utilisateur non trouvé pour UID: ${uid}. Rôle par défaut 'eleve' assigné.`);
            return { role: 'eleve', name: 'Nouvel Élève', needsPasswordChange: false };
        }
    } catch (error) {
        console.error("[Firestore] Erreur lors de la récupération du rôle:", error);
        return { role: 'eleve', name: 'Erreur', needsPasswordChange: false }; // Retour de sécurité
    }
}

/**
 * Obtient tous les utilisateurs de la collection 'users' (pour le calendrier).
 * @returns {Promise<Array<Object>>} Tableau d'objets utilisateur.
 */
async function getAllUsers() {
    const snapshot = await db.collection("users").get();
    return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        // Normaliser le nom si 'fullName' existe, sinon utiliser 'name' ou 'email'
        name: doc.data().fullName || doc.data().name || doc.data().email
    }));
}


// --- Fonctions de Gestion (pour Admin/Comité) ---

/**
 * Ajoute ou modifie les données Firestore d'un utilisateur.
 * Note: Cette fonction NE modifie PAS le mot de passe dans Firebase Auth.
 * @param {string} uid - L'UID de l'utilisateur à modifier.
 * @param {Object} data - Les champs à mettre à jour ({ fullName, role, birthday, etc. }).
 */
async function updateUserData(uid, data) {
    if (!uid) throw new Error("UID de l'utilisateur manquant pour la mise à jour.");
    const userDocRef = db.collection("users").doc(uid);
    
    // Les Firestore Rules vont bloquer cette action si l'utilisateur n'est pas autorisé.
    await userDocRef.set(data, { merge: true }); 
    console.log(`Données utilisateur ${uid} mises à jour.`);
}

/**
 * Supprime un document utilisateur (nécessite le rôle 'admin').
 * @param {string} uid - L'UID de l'utilisateur à supprimer.
 */
async function deleteUserDocument(uid) {
    if (!uid) throw new Error("UID de l'utilisateur manquant pour la suppression.");
    // Note: Pour une solution complète, l'admin devrait aussi supprimer l'utilisateur de Firebase Auth 
    // (ce qui nécessite le Firebase Admin SDK, donc généralement une Cloud Function).
    return db.collection("users").doc(uid).delete();
}

// --- Fonctions de Logging d'Activité ---

/**
 * Enregistre une activité utilisateur dans Firestore.
 * @param {string} userId - UID de l'utilisateur.
 * @param {string} action - Type d'action (ex: 'login', 'button_click', 'update').
 * @param {Object} details - Détails supplémentaires (optionnel).
 */
async function logActivity(userId, action, details = {}) {
    if (!userId) return; // Ne pas logger si pas d'utilisateur

    try {
        // Collecter des informations système
        const logData = {
            userId,
            action,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            jsEnabled: true, // JS fonctionne puisque cette fonction est appelée
            referrer: document.referrer,
            page: window.location.pathname,
            sessionDuration: details.sessionDuration || null,
            modifiedData: details.modifiedData || null,
            elementClicked: details.elementClicked || null,
            description: details.description || '',
            deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
            os: navigator.platform,
            plugins: navigator.plugins ? navigator.plugins.length : 0,
            touchScreen: 'ontouchstart' in window,
            batteryLevel: details.batteryLevel || null,
            connectionSpeed: details.connectionSpeed || null,
            location: details.location || null, // À implémenter si nécessaire
            ...details
        };

        // Récupérer l'IP via une API externe (gratuite)
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (ipResponse.ok) {
                const ipData = await ipResponse.json();
                logData.ip = ipData.ip;
            } else {
                logData.ip = 'Unknown';
            }
        } catch (error) {
            console.warn('Impossible de récupérer l\'IP:', error);
            logData.ip = 'Unknown';
        }

        // Ajouter à Firestore
        await db.collection('activity_logs').add(logData);
        console.log(`Activité loggée: ${action} pour ${userId}`);
    } catch (error) {
        console.error('Erreur lors du logging de l\'activité:', error);
    }
}