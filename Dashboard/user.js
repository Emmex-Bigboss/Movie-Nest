import {
    getFirestore,
    collection,
    doc,
    getDoc,
    addDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCDBJ08yEXTxKBCn-klx77sfuPGl5pnekA",
    authDomain: "movie-nest-1.firebaseapp.com",
    projectId: "movie-nest-1",
    storageBucket: "movie-nest-1.firebasestorage.app",
    messagingSenderId: "623628514100",
    appId: "1:623628514100:web:1eddafd5b8a85e0030eb61",
    measurementId: "G-0YJGHY4K7V"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userColRef = collection(db, "user");
const subColRef = collection(db, "subscribers");

const displayUser = document.getElementById("avatar-name1");
const displayUser2 = document.getElementById("avatar-name2");
const avatarImg = document.getElementById("avatar-image1");
const avatarImg2 = document.getElementById("avatar-image2");


function getInitials(username) {
    if (!username || typeof username !== "string") return "U";

    const parts = username.replace(/[._]/g, " ").trim().split(/\s+/);
    let initials = "";

    for (let i = 0; i < parts.length && initials.length < 2; i++) {
        if (parts[i].length > 0) {
            initials += parts[i][0];
        }
    }

    return initials.toUpperCase();
}

let currentuser;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentuser = user;
        try {
            displayUser.textContent = "Loading...";
            displayUser2.textContent = "Loading...";
            const docRef = doc(userColRef, user.uid);
            const userCredential = await getDoc(docRef);

            let username = user.displayName || "User";
            if (userCredential.exists()) {
                const userData = userCredential.data();
                username = userData?.username || username;
            }

            const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1);
            const initials = getInitials(username);
            const avatarURL = `https://ui-avatars.com/api/?name=${initials}&background=000000&color=ffffff&bold=true`;

            displayUser.textContent = `Hi, ${capitalizedName}`;
            displayUser2.textContent = `Hi, ${capitalizedName}`;
            avatarImg.src = avatarURL;
            avatarImg2.src = avatarURL;

        } catch (error) {
            console.error("Error getting user data:", error);
            displayUser.textContent = "Hi, User";
            displayUser2.textContent = "Hi, User";
            avatarImg.src = avatarImg2.src = `https://ui-avatars.com/api/?name=User&background=000000&color=ffffff&bold=true`;
        }
    } else {
        window.location.href = "../index.html";
    }
});


const subscriber = document.getElementById("subscribe");
const btnel = document.getElementById("but-sub");
const subform = document.getElementById("sub");

const addNewSubscriber = async () => {
    btnel.textContent = "Submitting...";
    btnel.disabled = true;

    const email = subscriber.value.trim();
    const newsub = { Email: email };

    try {
        const userSubsRef = collection(subColRef, currentuser.uid, "Subs");
        const docSnapShot = await addDoc(userSubsRef, newsub);
        alert("Email Submitted");
    } catch (error) {
        console.error("Error adding subscriber:", error);
        alert("Something went wrong.");
    } finally {
        btnel.textContent = "Submit";
        btnel.disabled = false;
    }
};

subform.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewSubscriber();
});


const logout = document.getElementById("logoutbtn");

logout.addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "../index.html";
    } catch (error) {
        console.error("Error signing out:", error);
    }
});
