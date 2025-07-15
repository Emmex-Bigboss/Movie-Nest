
const apikey = "2e249fd25cbc54d05736ba7a92ab8e16";
const totalSlides = 5;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadCarouselPosters() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&page=1`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const movies = shuffle(data.results)
        .filter(movie => movie.backdrop_path)
        .slice(0, totalSlides);

      const carouselInner = document.querySelector(".carousel-inner");
      carouselInner.innerHTML = "";

      movies.forEach((movie, index) => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) carouselItem.classList.add("active");

        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
        img.className = "d-block w-100";
        img.alt = movie.title;

        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
      });
    })
    .catch(error => {
      console.error("Error loading carousel backdrops:", error);
    });
}

loadCarouselPosters();

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".custom-navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(0, 0, 0, 0.85)";
  } else {
    navbar.style.background = "rgba(0, 0, 0, 0.4)";
  }
});









import {
  getFirestore,
  collection,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

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
const Auth = getAuth(app);
const DB = getFirestore(app);
const userColRef = collection(DB, "user");


const signupformel = document.getElementById("form1");

const handleSignup = async () => {
  const signupButtonEl = document.getElementById("sign-up");
  const errorMessageEl = document.getElementById("error-message");

  signupButtonEl.textContent = "Authenticating...";
  signupButtonEl.disabled = true;

  const usernameInput = document.getElementById("username1");
  const emailInput = document.getElementById("email1");
  const passwordInput = document.getElementById("password1");

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!navigator.onLine) {
    errorMessageEl.textContent = "You're offline. Please check your internet connection.";
    errorMessageEl.style.color = "red";
    signupButtonEl.textContent = "Sign up";
    signupButtonEl.disabled = false;
    return;
  }

  if (!email || !password || !username) {
    errorMessageEl.textContent = "All fields are required";
    errorMessageEl.style.color = "red";
    signupButtonEl.textContent = "Sign up";
    signupButtonEl.disabled = false;
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
    const user = userCredential.user;

    if (!user) {
      errorMessageEl.textContent = "User not created.";
      errorMessageEl.style.color = "red";
      return;
    }

    const newUser = {
      id: user.uid,
      username: username,
      email: email
    };

    const docRef = doc(userColRef, user.uid);
    await setDoc(docRef, newUser);

    try {
      await sendEmailVerification(user);
      console.log("Verification email sent.");
      errorMessageEl.textContent = "Signup successful! Verification email sent.";
      errorMessageEl.style.color = "red";

     
         location.href = "./Dashboard/dashboard.html";
      

    } catch (verifyError) {
      console.error("Failed to send verification email:", verifyError);
      errorMessageEl.textContent = "Signup done, but email not sent.";
      errorMessageEl.style.color = "orange";
    }

  } catch (error) {
    console.log(error);
    let errorMsg = error.message;
    if (error.code === 'auth/email-already-in-use') {
      errorMsg = 'Email is already in use.';
    } else if (error.code === 'auth/invalid-email') {
      errorMsg = 'Invalid email format.';
    } else if (error.code === 'auth/weak-password') {
      errorMsg = 'Password must be at least 6 characters.';
    }
    errorMessageEl.textContent = errorMsg;
    errorMessageEl.style.color = 'red';
  } finally {
    signupButtonEl.textContent = "Sign up";
    signupButtonEl.disabled = false;
  }
};

signupformel.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSignup();
});


const signInBtnEl = document.getElementById("sign-in");
const signInFormEl = document.getElementById("form");
const errorEl = document.getElementById("error-line");

const signIn = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  errorEl.textContent = "";

  if (!email || !password) {
    errorEl.textContent = "Please enter email and password.";
    return;
  }

  signInBtnEl.textContent = "Signing In...";
  signInBtnEl.disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(Auth, email, password);
    const user = userCredential.user;

    if (user) {
     
      window.location.href = "./Dashboard/dashboard.html";
    }
  } catch (error) {
    console.error(error);
    if (error.code === "auth/invalid-email") {
      errorEl.textContent = "Invalid Email";
    } else if (error.code === "auth/missing-password") {
      errorEl.textContent = "Password is missing";
    } else if (error.code === "auth/wrong-password") {
      errorEl.textContent = "Email or password is incorrect";
    } else if (error.code === "auth/user-not-found") {
      errorEl.textContent = "No user found with this email";
    } else {
      errorEl.textContent = "Invalid Credentials.";
    }
  } finally {
    signInBtnEl.textContent = "Sign In";
    signInBtnEl.disabled = false;
  }
};

signInFormEl.addEventListener("submit", (e) => {
  e.preventDefault();
  signIn();
});


 
document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password1");
  const passwordInput1 = document.getElementById("password");
  const toggleIcon = document.getElementById("toggle-eye");
  const toggleIcon1 = document.getElementById("toggle-eye2");

  toggleIcon.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  });

  toggleIcon1.addEventListener("click", () => {
    passwordInput1.type = passwordInput1.type === "password" ? "text" : "password";
  });
  
});

