import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDBJ08yEXTxKBCn-klx77sfuPGl5pnekA",
  authDomain: "movie-nest-1.firebaseapp.com",
  projectId: "movie-nest-1",
  storageBucket: "movie-nest-1.firebasestorage.app",
  messagingSenderId: "623628514100",
  appId: "1:623628514100:web:1eddafd5b8a85e0030eb61",
  measurementId: "G-0YJGHY4K7V",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  if (!movieId) {
    alert("No movie ID found in URL");
    return;
  }

  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");
  const starRating = document.getElementById("star-rating");
  const commentList = document.getElementById("comment-list");

  let currentUser = null;

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
  });

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please sign in to comment.");
      return;
    }

    const commentText = commentInput.value.trim();
    const ratingValue = parseInt(starRating.value);

    if (!commentText || !ratingValue) {
      alert("Add a comment and choose a rating.");
      return;
    }

    try {
      await addDoc(collection(db, "movieComments", movieId, "comments"), {
        displayName: currentUser.displayName || currentUser.email,
        email: currentUser.email,
        uid: currentUser.uid,
        comment: commentText,
        rating: ratingValue,
        timestamp: serverTimestamp(),
      });

      commentForm.reset();
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Try again later.");
    }
  });

  const commentQuery = query(
    collection(db, "movieComments", movieId, "comments"),
    orderBy("timestamp", "desc")
  );

  onSnapshot(commentQuery, (snapshot) => {
    commentList.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);

      const commentHTML = document.createElement("div");
      commentHTML.classList.add("mb-3");
      commentHTML.innerHTML = `
        <strong>${data.displayName || data.email}</strong> <span style="color: gold;">${stars}</span><br>
        <p>${data.comment}</p>
        <hr>
      `;
      commentList.appendChild(commentHTML);
    });
  });
});
