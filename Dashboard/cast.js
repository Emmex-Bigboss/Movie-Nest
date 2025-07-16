const apiKey = "2e249fd25cbc54d05736ba7a92ab8e16";
const personId = new URLSearchParams(window.location.search).get("id");

const profile = document.getElementById("profile");
const nameEl = document.getElementById("person-name");
const knownFor = document.getElementById("known-for");
const knownCredits = document.getElementById("known-credits");
const gender = document.getElementById("gender");
const birthday = document.getElementById("birthday");
const birthplace = document.getElementById("birthplace");
const aliases = document.getElementById("aliases");
const biography = document.getElementById("biography");
const knownWorks = document.getElementById("known-works");


fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}&language=en-US`)
  .then(res => res.json())
  .then(data => {
    nameEl.textContent = data.name;
    biography.textContent = data.biography || "No biography available.";
    profile.src = data.profile_path
      ? `https://image.tmdb.org/t/p/w300${data.profile_path}`
      : "https://via.placeholder.com/300x450?text=No+Image";
    profile.alt = data.name;

    knownFor.textContent = data.known_for_department || "N/A";
    gender.textContent = data.gender === 1 ? "Female" : data.gender === 2 ? "Male" : "Other/Unknown";
    birthday.textContent = data.birthday || "N/A";
    birthplace.textContent = data.place_of_birth || "N/A";
    aliases.textContent = data.also_known_as?.join(", ") || "N/A";
  });


fetch(`https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${apiKey}&language=en-US`)
  .then(res => res.json())
  .then(data => {
    const works = data.cast.slice(0, 50); 
    knownCredits.textContent = data.cast.length;

    works.forEach(work => {
      const title = work.title || work.name || "Untitled";
      const poster = work.poster_path
        ? `https://image.tmdb.org/t/p/w300${work.poster_path}`
        : "https://via.placeholder.com/300x450?text=No+Image";

      const col = document.createElement("div");
      col.className = "col-6 col-sm-6 col-md-3 mb-4";


      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${poster}" class="card-img-top" alt="${title}">
          <div class="card-body p-2">
            <h6 class="card-title text-center mb-0" style="font-size: 0.95rem;">${title}</h6>
          </div>
        </div>
      `;

      knownWorks.appendChild(col);
    });
  });




  const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', (e) => {
  e.preventDefault(); // prevent form submit
  const query = searchInput.value.trim();
  if (query) {
    fetchMultiSearch(query);
  }
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchBtn.click();
  }
});

async function fetchMultiSearch(query, pages = 3) {
  try {
    let allResults = [];

    for (let page = 1; page <= pages; page++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await response.json();
      if (data.results) {
        allResults = allResults.concat(data.results);
      }

      if (page >= data.total_pages) break; // Stop if no more pages
    }

    if (allResults.length > 0) {
      displayResults(allResults);
    } else {
      showMessage('No results found.');
    }
  } catch (error) {
    console.error(error);
    showMessage('Error fetching data.');
  }
}

function showMessage(message) {
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `<p>${message}</p>`;
  const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));
  resultsModal.show();
}

function displayResults(results) {
  const modalBody = document.getElementById('modalBody');
  const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

  modalBody.innerHTML = results
    .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
    .map(item => {
      let title = '';
      let releaseDate = '';
      let overview = item.overview || 'No description available.';
      let mediaType = item.media_type;
      let posterPath = item.poster_path
        ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
        : 'https://via.placeholder.com/100x150?text=No+Image';

      if (mediaType === 'movie') {
        title = item.title || 'Untitled Movie';
        releaseDate = item.release_date ? `(${item.release_date.slice(0, 4)})` : '';
      } else if (mediaType === 'tv') {
        title = item.name || 'Untitled TV Show';
        releaseDate = item.first_air_date ? `(${item.first_air_date.slice(0, 4)})` : '';
      }

      const shortOverview = overview.length > 150 ? overview.slice(0, 150) + '...' : overview;
      const detailsLink = `./comment.html?id=${item.id}&type=${mediaType}`;

      return `
        <div class="result-item d-flex gap-3 mb-3">
          <img src="${posterPath}" alt="${title}" class="rounded" style="width: 100px; height: 150px; object-fit: cover;" />
          <div class="result-details">
            <h5>${title} ${releaseDate} <small class="text-muted">[${mediaType.toUpperCase()}]</small></h5>
            <p style="font-size: 0.9rem;">${shortOverview}</p>
            <a href="${detailsLink}" class="btn btn-sm btn-outline-light mt-1">Read More</a>
          </div>
        </div>
      `;
    }).join('');

  resultsModal.show();
}




// const searchInput = document.getElementById('searchInput');
const suggestionsBox = document.getElementById('suggestions');

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();

  if (query.length < 2) {
    suggestionsBox.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      showSuggestions(data.results);
    } else {
      suggestionsBox.innerHTML = '<div class="p-2 text-muted">No matches found</div>';
    }
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    suggestionsBox.innerHTML = '<div class="p-2 text-danger">Error fetching suggestions</div>';
  }
});

function showSuggestions(results) {
  const filtered = results.filter(item =>
    (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
  );

  suggestionsBox.innerHTML = filtered.slice(0, 10).map(item => {
    const title = item.title || item.name || 'Untitled';
    const type = item.media_type;
    const release = item.release_date || item.first_air_date || '';
    const year = release.slice(0, 4);
    const poster = `https://image.tmdb.org/t/p/w92${item.poster_path}`;
    const link = `./comment.html?id=${item.id}&type=${type}`;

    return `
      <a href="${link}">
        <img src="${poster}" alt="${title}" />
        <div>
          <strong>${title}</strong><br>
          <small>(${year}) [${type.toUpperCase()}]</small>
        </div>
      </a>
    `;
  }).join('');
}


document.addEventListener('pointerdown', (e) => {
  if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
    suggestionsBox.innerHTML = '';
  }
});













