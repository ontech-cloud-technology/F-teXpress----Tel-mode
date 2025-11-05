import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

async function createUser(email, password, fullName, role) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "users", uid), {
      fullName,
      email,
      role
    });

    console.log("Utilisateur créé :", fullName);
  } catch(err) {
    console.error(err);
  }
}

// Exemple : créer un élève pour test
createUser("eleve@mail.com", "motdepasse123", "Jean Dupont", "eleve");
