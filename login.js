import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if(userDoc.exists()){
      const data = userDoc.data();
      const role = data.role;

      loginMessage.textContent = `Bienvenue ${data.fullName} (${role}) !`;
      loginMessage.style.color = "lightgreen";

      // Redirection selon rôle
      if(role === "eleve") window.location.href = "eleve.html";
      else if(role === "teacher" || role === "professeur") window.location.href = "admin.html";
      else if(role === "admin") window.location.href = "admin.html";
    } else {
      loginMessage.textContent = "Utilisateur non trouvé dans la base de données.";
    }

  } catch(err){
    loginMessage.textContent = err.message;
    loginMessage.style.color = "yellow";
  }
});
