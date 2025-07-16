
const apiKey = "2e249fd25cbc54d05736ba7a92ab8e16";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type") || "movie";

const backdrop = document.getElementById("backdrop");
const poster = document.getElementById("poster");
const titleEl = document.getElementById("title");
const overviewEl = document.getElementById("overview");
const castList = document.getElementById("cast-list");
const genresEl = document.getElementById("genres");
const releaseDateEl = document.getElementById("release-date");
const ratingEl = document.getElementById("rating");
const trailerBtn = document.getElementById("trailer-btn");
const trailerIframe = document.getElementById("trailerIframe");

if (!id || !type) {
  titleEl.textContent = "Missing movie/show ID or type in URL.";
} else if (type !== "movie" && type !== "tv") {
  titleEl.textContent = "Invalid type in URL.";
} else {
  fetchDetails();
  fetchCast();
  fetchTrailer();
}

async function fetchDetails() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    const title = data.title || data.name || "No Title";
    titleEl.textContent = title;
    overviewEl.textContent = data.overview || "No overview available.";
    backdrop.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;
    poster.src = data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";
    poster.alt = title;

    genresEl.textContent = data.genres?.map(g => g.name).join(", ") || "No genres";
    releaseDateEl.textContent = data.release_date || data.first_air_date || "N/A";
    ratingEl.textContent = data.vote_average ? `${data.vote_average.toFixed(1)} / 10` : "Not Rated";
  } catch (err) {
    console.error("Failed to fetch details:", err);
    titleEl.textContent = "Failed to load details.";
  }
}

async function fetchCast() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}&language=en-US`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const cast = data.cast?.slice(0, 20) || [];

    castList.innerHTML = "";
    if (cast.length === 0) {
      castList.innerHTML = "<li>No cast information available.</li>";
      return;
    }

    cast.forEach((actor) => {
      const li = document.createElement("li");
      li.className = "d-flex align-items-start gap-3 mb-3";

      const link = document.createElement("a");
      link.href = `./cast.html?id=${actor.id}`;
      link.className = "d-flex text-decoration-none text-light";
      link.style.gap = "15px";

      const img = document.createElement("img");
      img.src = actor.profile_path
        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
        : "https://via.placeholder.com/80x100?text=No+Image";
      img.alt = actor.name;
      img.style = "width: 80px; height: 100px; object-fit: cover;";
      img.classList.add("rounded");

      const info = document.createElement("div");
      info.innerHTML = `
        <strong>${actor.name}</strong><br>
        <small>as <em>${actor.character || "N/A"}</em></small>
      `;

      link.appendChild(img);
      link.appendChild(info);
      li.appendChild(link);
      castList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch cast:", err);
    castList.innerHTML = "<li>Failed to load cast information.</li>";
  }
}

async function fetchTrailer() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    const trailer = data.results.find(
      vid => vid.type === "Trailer" && vid.site === "YouTube"
    );

    if (trailer) {
      trailerBtn.style.display = "inline-block";
      trailerBtn.addEventListener("click", () => {
        trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        const modal = new bootstrap.Modal(document.getElementById("trailerModal"));
        modal.show();
      });
    } else {
      trailerBtn.style.display = "none";
    }
  } catch (err) {
    console.error("Failed to fetch trailer:", err);
    trailerBtn.style.display = "none";
  }
}

