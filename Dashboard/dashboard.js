const apiKey = '2e249fd25cbc54d05736ba7a92ab8e16'; 


(() => {
  const KEY = '2e249fd25cbc54d05736ba7a92ab8e16';
  const container = document.getElementById('movie-container');
  const modal = new bootstrap.Modal(document.getElementById('movieModal'));

  const titleEl = document.getElementById('movieModalLabel');
  const overviewEl = document.getElementById('modalOverview');
  const ratingEl = document.getElementById('modalRating');
  const genresEl = document.getElementById('modalGenres');
  const dateEl = document.getElementById('modalReleaseDate');
  const trailerBtn = document.getElementById('trailerButton');
  const backdropWrapper = document.getElementById('modalBackdropWrapper');
  const commentLink = document.getElementById('comets');

  async function fetchGenres() {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY}`);
    const { genres } = await res.json();
    return genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
  }

  async function fetchTrailer(id) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${KEY}`);
    const { results } = await res.json();
    const video = results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    return video ? `https://www.youtube.com/watch?v=${video.key}` : null;
  }

  async function fetchTrendingMovies() {
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${KEY}`;
    
    const [genreMap, res] = await Promise.all([
      fetchGenres(),
      fetch(url).then(r => r.json())
    ]);

    if (!res.results?.length) return console.warn('No trending movies found.');

    res.results.slice(0, 30).forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';  // Same as sitcom-card style
      card.innerHTML = `
        <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
        'https://via.placeholder.com/180x270?text=No+Image'}">
        <p class="movie-title">${movie.title}</p>
      `;

      card.addEventListener('click', async () => {
        titleEl.textContent = movie.title;
        overviewEl.textContent = movie.overview || 'No overview available.';
        ratingEl.textContent = `★ ${movie.vote_average?.toFixed(1) || '—'}`;
        dateEl.textContent = movie.release_date || '—';
        genresEl.textContent = movie.genre_ids.map(id => genreMap[id]).join(', ') || '—';

        // Handle backdrop image
        if (movie.backdrop_path) {
          backdropWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${movie.backdrop_path})`;
        } else {
          backdropWrapper.style.backgroundImage = 'none';
        }

        // Handle trailer button
        const trailer = await fetchTrailer(movie.id);
        if (trailer) {
          trailerBtn.href = trailer;
          trailerBtn.style.display = 'inline-block';
        } else {
          trailerBtn.style.display = 'none';
        }

        // Handle comment link
        if (commentLink) {
          commentLink.href = `./comment.html?id=${movie.id}&type=movie`;
          commentLink.classList.remove('d-none');
        }

        modal.show();
      });

      container.appendChild(card);
    });
  }

  fetchTrendingMovies();
})();







(() => {
  const apiKey = '2e249fd25cbc54d05736ba7a92ab8e16';
  const container = document.getElementById('Upcoming');
  const modal = new bootstrap.Modal(document.getElementById('upcomingModal'));

  const titleEl = document.getElementById('upcomingModalTitle');
  const overviewEl = document.getElementById('upcomingOverview');
  const dateEl = document.getElementById('upcomingRelease');
  const ratingEl = document.getElementById('upcomingRating');
  const genresEl = document.getElementById('upcomingGenres');
  const trailerBtn = document.getElementById('upcomingtrailer');
  const backdropEl = document.getElementById('upcomingBackdropWrapper');
  const commentLink = document.getElementById('comets2');

  async function fetchGenres() {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
      const data = await res.json();
      return data.genres.reduce((acc, g) => {
        acc[g.id] = g.name;
        return acc;
      }, {});
    } catch (err) {
      console.error('Fetch genres error:', err);
      return {};
    }
  }

  async function fetchTrailer(movieId) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
      const data = await res.json();
      const vid = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      return vid ? `https://www.youtube.com/watch?v=${vid.key}` : null;
    } catch {
      return null;
    }
  }

  async function fetchUpcomingMovies() {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`);
      const data = await res.json();
      if (!Array.isArray(data.results) || data.results.length === 0) {
        console.warn('No upcoming movies found');
        return;
      }
      const movies = data.results.slice(0, 20);
      display(movies);
    } catch (err) {
      console.error('Fetch upcoming error:', err);
    }
  }

  async function display(movies) {
    const genres = await fetchGenres();
    container.innerHTML = '';

    movies.forEach(movie => {
      const card = document.createElement('div');
      card.classList.add('text-center');
      card.style.width = '150px';
      card.style.flex = '0 0 auto';

      const img = document.createElement('img');
      img.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/150x225?text=No+Image';
      img.alt = movie.title;
      img.classList.add('rounded');
      img.style.cursor = 'pointer';
      img.style.width = '100%';

      const p = document.createElement('p');
         p.className = 'up-title';
      p.textContent = movie.title;
      p.classList.add('mt-2', 'fw-semibold', 'text-white');
      p.style.fontSize = '0.85rem';

      card.appendChild(img);
      card.appendChild(p);

      card.addEventListener('click', async () => {
        titleEl.textContent = movie.title;
        overviewEl.textContent = movie.overview || 'No overview available.';
        dateEl.textContent = movie.release_date || 'Unknown';
        ratingEl.textContent = movie.vote_average || 'N/A';
        genresEl.textContent = movie.genre_ids.map(id => genres[id]).join(', ') || '—';

        // Set backdrop image as background
        if (movie.backdrop_path) {
          backdropEl.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        } else {
          backdropEl.style.backgroundImage = 'url(https://via.placeholder.com/500x300?text=No+Backdrop)';
        }

        // Set trailer link
        const trailer = await fetchTrailer(movie.id);
        if (trailer) {
          trailerBtn.href = trailer;
          trailerBtn.style.display = 'inline-block';
          trailerBtn.classList.remove('disabled', 'd-none');
        } else {
          trailerBtn.href = '#';
          trailerBtn.style.display = 'none';
          trailerBtn.classList.add('disabled');
        }

        // Set comment link
        if (commentLink) {
          commentLink.href = `./comment.html?id=${movie.id}&type=movie`;
          commentLink.classList.remove("d-none");
        }

        modal.show();
      });

      container.appendChild(card);
    });
  }

  fetchUpcomingMovies();
})();














































const tvContainer = document.getElementById('tv-container');
const tvModal = new bootstrap.Modal(document.getElementById('tvModal'));
const tvTrailerButton = document.getElementById('tvTrailerButton');
const tvBackdropWrapper = document.getElementById('tvBackdropWrapper');
const newlink1 = document.getElementById('comets1'); 

async function fetchTrendingTVShows() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`);
    const data = await response.json();
    const shows = data.results;

    tvContainer.innerHTML = ''; // Clear any previous content

    shows.forEach(show => {
      const card = document.createElement('div');
      card.classList.add('tv-card');
      card.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : 'https://via.placeholder.com/180x270?text=No+Image';
      img.alt = show.name;
      img.classList.add('img-fluid');

      const title = document.createElement('h6');
      title.textContent = show.name;

      card.appendChild(img);
      card.appendChild(title);
      tvContainer.appendChild(card);

      card.addEventListener('click', async () => {
        document.getElementById('tvModalLabel').textContent = show.name;
        document.getElementById('tvOverview').textContent = show.overview || 'No description available.';
        document.getElementById('tvAirDate').textContent = show.first_air_date || 'N/A';
        document.getElementById('tvRating').textContent = show.vote_average ? `★ ${show.vote_average.toFixed(1)}` : 'N/A';

        // Set backdrop as background image on div
        if (show.backdrop_path) {
          tvBackdropWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${show.backdrop_path})`;
        } else {
          tvBackdropWrapper.style.backgroundImage = 'none';
        }

        newlink1.href = `./comment.html?id=${show.id}&type=tv`;
        newlink1.classList.remove("d-none");

        tvTrailerButton.classList.add('d-none');

        try {
          const trailerRes = await fetch(`https://api.themoviedb.org/3/tv/${show.id}/videos?api_key=${apiKey}`);
          const trailerData = await trailerRes.json();
          const youtubeTrailer = trailerData.results.find(video =>
            video.site === "YouTube" && video.type === "Trailer"
          );

          if (youtubeTrailer) {
            tvTrailerButton.href = `https://www.youtube.com/watch?v=${youtubeTrailer.key}`;
            tvTrailerButton.classList.remove('d-none');
          }
        } catch (err) {
          console.warn('No trailer found for this show:', err);
        }

        tvModal.show();
      });
    });
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
  }
}

fetchTrendingTVShows();




const topMovieContainer = document.getElementById('topmovie-container');
const topTrendingModal = new bootstrap.Modal(document.getElementById('topTrendingModal'));
const topTrendingModalTitle = document.getElementById('topTrendingModalTitle');
const topTrendingModalGenres = document.getElementById('topTrendingModalGenres');
const topTrendingModalDate = document.getElementById('topTrendingModalDate');
const topTrendingModalRating = document.getElementById('topTrendingModalRating');
const topTrendingModalOverview = document.getElementById('topTrendingModalOverview');
const topTrendingTrailerBtn = document.getElementById('topTrendingTrailerBtn');
const topBackdrop = document.getElementById('topTrendingBackdrop');
const toplink = document.getElementById('comets4');

async function fetchTopTrendingMovies() {
  try {
    const lastFetch = localStorage.getItem('lastTopTrendingFetch');
    const now = new Date().getTime();
    let movies;

    if (!lastFetch || now - lastFetch > 86400000) {
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`);
      const data = await response.json();
      movies = data.results;
      localStorage.setItem('lastTopTrendingFetch', now);
      localStorage.setItem('topTrendingMovies', JSON.stringify(movies));
    } else {
      movies = JSON.parse(localStorage.getItem('topTrendingMovies'));
    }

    topMovieContainer.innerHTML = '';

    movies.forEach(movie => {
      const card = document.createElement('div');
      card.classList.add('tv-card'); // Reusing the same card class for consistency
      card.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/180x270?text=No+Image';
      img.alt = movie.title;
      img.classList.add('img-fluid');

      const title = document.createElement('h6');
      title.textContent = movie.title;

      card.appendChild(img);
      card.appendChild(title);
      topMovieContainer.appendChild(card);

      card.addEventListener('click', () => showTopTrendingModal(movie.id));
    });
  } catch (error) {
    console.error('Error fetching Top Trending Movies:', error);
  }
}

async function showTopTrendingModal(movieId) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
    const movie = await response.json();

    topTrendingModalTitle.textContent = movie.title;
    topTrendingModalGenres.textContent = movie.genres.map(g => g.name).join(', ') || 'N/A';
    topTrendingModalDate.textContent = movie.release_date || 'N/A';
    topTrendingModalRating.textContent = movie.vote_average ? `★ ${movie.vote_average.toFixed(1)}` : 'N/A';
    topTrendingModalOverview.textContent = movie.overview || 'No description available.';

    // Set backdrop as background image in a div
    topBackdrop.style.backgroundImage = movie.backdrop_path
      ? `url('https://image.tmdb.org/t/p/w780${movie.backdrop_path}')`
      : `url('https://via.placeholder.com/780x439?text=No+Image')`;

    topBackdrop.style.backgroundSize = 'cover';
    topBackdrop.style.backgroundPosition = 'center';

    // Show comment link
    toplink.href = `./comment.html?id=${movie.id}&type=movie`;
    toplink.classList.remove("d-none");

    // Hide trailer button first
    topTrendingTrailerBtn.classList.add('d-none');

    try {
      const trailerRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
      const trailerData = await trailerRes.json();
      const trailer = trailerData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

      if (trailer) {
        topTrendingTrailerBtn.href = `https://www.youtube.com/watch?v=${trailer.key}`;
        topTrendingTrailerBtn.classList.remove('d-none');
      }
    } catch (trailerError) {
      console.warn('No trailer found:', trailerError);
    }

    topTrendingModal.show();
  } catch (error) {
    console.error('Error loading movie details:', error);
  }
}

fetchTopTrendingMovies();





























 const trailerContainer = document.getElementById('trailer-container');

    async function fetchLatestTrailers() {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`);
        const data = await res.json();

        for (const movie of data.results.slice(0, 10)) {
          const movieId = movie.id;

          const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
          const videoData = await videoRes.json();

          const trailer = videoData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

          if (trailer) {
            const trailerCard = document.createElement('div');
            trailerCard.classList.add('trailer-card');

            trailerCard.innerHTML = `
              <iframe
                src="https://www.youtube.com/embed/${trailer.key}?enablejsapi=1&rel=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
              <div class="trailer-title">${trailer.name}</div>
            `;

            const iframe = trailerCard.querySelector('iframe');

            trailerCard.addEventListener('mouseenter', () => {
              iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&rel=0&enablejsapi=1`;
            });

            trailerCard.addEventListener('mouseleave', () => {
              iframe.src = `https://www.youtube.com/embed/${trailer.key}?enablejsapi=1&rel=0`;
            });

            trailerContainer.appendChild(trailerCard);
          }
        }
      } catch (error) {
        console.error("Error fetching trailers:", error);
        trailerContainer.innerHTML = "<p>Failed to load trailers.</p>";
      }
    }

    fetchLatestTrailers();








    const nollyMovieContainer = document.getElementById('nolly-movies');

const nollyModal = new bootstrap.Modal(document.getElementById('nollyModal'));
const nollyTitle = document.getElementById('nollyModalLabel');
const nollyOverview = document.getElementById('nollyOverview');
const nollyRating = document.getElementById('nollyRating');
const nollyGenres = document.getElementById('nollyGenres');
const nollyReleaseDate = document.getElementById('nollyReleaseDate');
const nollyTrailerBtn = document.getElementById('nollyTrailerBtn');
const nollylink = document.getElementById('cometsng');
const nollyBackdropWrapper = document.getElementById('nollyBackdropWrapper');  // Updated here

async function fetchNollyGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching genres:', error);
    return {};
  }
}

async function fetchNollyTrailer(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const trailer = data.results.find(
      vid => vid.type === 'Trailer' && vid.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return null;
  }
}

async function fetchNollyMovies() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=NG&sort_by=popularity.desc`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      console.warn('No Nigerian movies found.');
      return;
    }
    displayNollyMovies(data.results);
  } catch (error) {
    console.error('Error fetching Nigerian movies:', error);
  }
}

async function displayNollyMovies(movies) {
  const genreMap = await fetchNollyGenres();
  nollyMovieContainer.innerHTML = ''; // Clear container before adding new cards

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('nolly-card');

    const img = document.createElement('img');
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/180x270?text=No+Image';
    img.alt = movie.title;
    card.appendChild(img);

    const title = document.createElement('p');
    title.className = 'nolly-title';
    title.textContent = movie.title;
    card.appendChild(title);

    card.style.cursor = 'pointer';

    card.addEventListener('click', async () => {
      nollyTitle.textContent = movie.title;
      nollyOverview.textContent = movie.overview || 'No overview available.';
      nollyRating.textContent = movie.vote_average ?? 'N/A';
      nollyReleaseDate.textContent = movie.release_date || 'Unknown';
      nollyGenres.textContent = movie.genre_ids.length
        ? movie.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ')
        : 'Unknown';

      // Set backdrop as background image on the wrapper div:
      if (movie.backdrop_path) {
        nollyBackdropWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${movie.backdrop_path})`;
      } else {
        nollyBackdropWrapper.style.backgroundImage = 'url(https://via.placeholder.com/780x250?text=No+Backdrop)';
      }

      const trailerLink = await fetchNollyTrailer(movie.id);
      if (trailerLink) {
        nollyTrailerBtn.href = trailerLink;
        nollyTrailerBtn.style.display = 'inline-block';
      } else {
        nollyTrailerBtn.style.display = 'none';
        nollyTrailerBtn.href = '#';
      }

      nollylink.href = `./comment.html?id=${movie.id}&type=movie`;
      nollylink.classList.remove('d-none');

      nollyModal.show();
    });

    nollyMovieContainer.appendChild(card);
  });
}

fetchNollyMovies();





(() => {
  const kdramaApiKey = '2e249fd25cbc54d05736ba7a92ab8e16';

  const kdramaContainer = document.getElementById('kdrama-container');

  const kdramaModal = new bootstrap.Modal(document.getElementById('kdramaModal'));
  const kdramaTitle = document.getElementById('kdramaModalLabel');      // updated here
  const kdramaOverview = document.getElementById('kdramaOverview');
  const kdramaRating = document.getElementById('kdramaRating');
  const kdramaGenres = document.getElementById('kdramaGenres');
  const kdramaFirstAirDate = document.getElementById('kdramaFirstAirDate');
  const kdramaTrailerBtn = document.getElementById('kdramaTrailerBtn');
  const kdramaBackdropWrapper = document.getElementById('kdramaBackdropWrapper');
  const kdlink = document.getElementById("cometskd");

  async function fetchKdramas() {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${kdramaApiKey}&with_origin_country=KR&with_genres=18&sort_by=popularity.desc`;
    const res = await fetch(url);
    const data = await res.json();
    displayKdramas(data.results);
  }

  async function fetchKdramaGenres() {
    const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${kdramaApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }

  async function fetchKdramaTrailer(tvId) {
    const url = `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${kdramaApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const trailer = data.results.find(
      vid => vid.type === 'Trailer' && vid.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }

  async function displayKdramas(kdramas) {
    const genreMap = await fetchKdramaGenres();

    kdramas.forEach(show => {
      const card = document.createElement('div');
      card.classList.add('kdrama-card');

      const img = document.createElement('img');
      img.src = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : 'https://via.placeholder.com/180x270?text=No+Image';
      card.appendChild(img);

      const title = document.createElement('p');
      title.className = 'kdrama-title';
      title.textContent = show.name;
      card.appendChild(title);

      card.style.cursor = 'pointer';

      card.addEventListener('click', async () => {
        kdramaTitle.textContent = show.name;
        kdramaOverview.textContent = show.overview || 'No overview available.';
        kdramaRating.textContent = show.vote_average ?? 'N/A';
        kdramaFirstAirDate.textContent = show.first_air_date || 'Unknown';
        kdramaGenres.textContent = show.genre_ids.length
          ? show.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ')
          : 'Unknown';

        if (show.backdrop_path) {
          kdramaBackdropWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${show.backdrop_path})`;
        } else {
          kdramaBackdropWrapper.style.backgroundImage = 'url(https://via.placeholder.com/780x250?text=No+Backdrop)';
        }

        const trailerLink = await fetchKdramaTrailer(show.id);
        if (trailerLink) {
          kdramaTrailerBtn.href = trailerLink;
          kdramaTrailerBtn.style.display = 'inline-block';
        } else {
          kdramaTrailerBtn.style.display = 'none';
          kdramaTrailerBtn.href = '#';
        }

        kdlink.href = `./comment.html?id=${show.id}&type=tv`;
        kdlink.classList.remove("d-none");

        kdramaModal.show();
      });

      kdramaContainer.appendChild(card);
    });
  }

  fetchKdramas();
})();









(() => {
  const teenApiKey = '2e249fd25cbc54d05736ba7a92ab8e16';

  const teenContainer = document.getElementById('teen-container');
  const teenModal = new bootstrap.Modal(document.getElementById('teenModal'));

  // Updated element IDs to match the new modal layout
  const teenTitle = document.getElementById('teenModalLabel');
  const teenOverview = document.getElementById('teenOverview');
  const teenRating = document.getElementById('teenRating');
  const teenGenres = document.getElementById('teenGenres');
  const teenFirstAirDate = document.getElementById('teenFirstAirDate');
  const teenTrailerBtn = document.getElementById('teenTrailerBtn');
  const teenBackdropWrapper = document.getElementById('teenBackdropWrapper');
  const teenlink = document.getElementById('cometteen');

  async function fetchTeenSeries() {
    try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${teenApiKey}&with_genres=10762&language=en-US&sort_by=popularity.desc`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        console.warn("No teen series found.");
        return;
      }

      displayTeenSeries(data.results);
    } catch (error) {
      console.error("Failed to fetch teen series:", error);
    }
  }

  async function fetchTeenGenres() {
    try {
      const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${teenApiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
    } catch (error) {
      console.error("Failed to fetch genres:", error);
      return {};
    }
  }

  async function fetchTeenTrailer(tvId) {
    try {
      const url = `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${teenApiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const trailer = data.results.find(
        vid => vid.type === 'Trailer' && vid.site === 'YouTube'
      );
      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
      return null;
    }
  }

  async function displayTeenSeries(shows) {
    const genreMap = await fetchTeenGenres();

    shows.forEach(show => {
      const card = document.createElement('div');
      card.classList.add('teen-card');

      const img = document.createElement('img');
      img.src = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : 'https://via.placeholder.com/180x270?text=No+Image';
      card.appendChild(img);

      const title = document.createElement('p');
      title.className = 'teen-title';
      title.textContent = show.name;
      card.appendChild(title);

      card.addEventListener('click', async () => {
        teenTitle.textContent = show.name;
        teenOverview.textContent = show.overview || 'No overview available.';
        teenRating.textContent = show.vote_average || 'N/A';
        teenFirstAirDate.textContent = show.first_air_date || 'Unknown';
        teenGenres.textContent = show.genre_ids.map(id => genreMap[id]).join(', ') || 'Unknown';

        // Set backdrop as background image
        if (show.backdrop_path) {
          teenBackdropWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${show.backdrop_path})`;
        } else {
          teenBackdropWrapper.style.backgroundImage = 'none';
        }

        const trailerLink = await fetchTeenTrailer(show.id);
        if (trailerLink) {
          teenTrailerBtn.href = trailerLink;
          teenTrailerBtn.style.display = 'inline-block';
        } else {
          teenTrailerBtn.style.display = 'none';
        }

        if (teenlink) {
          teenlink.href = `./comment.html?id=${show.id}&type=tv`;
          teenlink.classList.remove("d-none");
        }

        teenModal.show();
      });

      teenContainer.appendChild(card);
    });
  }

  fetchTeenSeries();
})();




(() => {
  const apiKey = '2e249fd25cbc54d05736ba7a92ab8e16';
  const container = document.getElementById('adultteen-container');
  const modal = new bootstrap.Modal(document.getElementById('adultteenModal'));

  const titleEl = document.getElementById('adultteenModalLabel');
  const overviewEl = document.getElementById('adultteenOverview');
  const ratingEl = document.getElementById('adultteenRating');
  const genresEl = document.getElementById('adultteenGenres');
  const dateEl = document.getElementById('adultteenFirstAirDate');
  const trailerBtn = document.getElementById('adultteenTrailerBtn');
  const backdropWrapper = document.getElementById('adultteenBackdropWrapper');
  const adultlink = document.getElementById("cometateen");

  async function fetchAdultTeen() {
    try {
      const url =
        `https://api.themoviedb.org/3/discover/tv?` +
        `api_key=${apiKey}&with_keywords=193400&language=en-US&sort_by=popularity.desc`;
      const res = await fetch(url);
      const data = await res.json();
      if (!Array.isArray(data.results) || data.results.length === 0) {
        console.warn('No teen series found');
        return;
      }
      const shows = data.results.slice(0, 20);
      display(shows);
    } catch (err) {
      console.error('Fetch teen series error:', err);
    }
  }

  async function fetchGenres() {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`);
      const data = await res.json();
      return data.genres.reduce((acc, g) => { acc[g.id] = g.name; return acc; }, {});
    } catch (err) {
      console.error('Fetch genres error:', err);
      return {};
    }
  }

  async function fetchTrailer(tvId) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${apiKey}`);
      const data = await res.json();
      const vid = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      return vid ? `https://www.youtube.com/watch?v=${vid.key}` : null;
    } catch {
      return null;
    }
  }

  async function display(shows) {
    const genres = await fetchGenres();
    shows.forEach(show => {
      const card = document.createElement('div');
      card.classList.add('adultteen-card');

      const img = document.createElement('img');
      img.src = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : 'https://via.placeholder.com/180x270?text=No+Image';
      card.appendChild(img);

      const p = document.createElement('p');
      p.className = 'adultteen-title';
      p.textContent = show.name;
      card.appendChild(p);

      card.addEventListener('click', async () => {
        titleEl.textContent = show.name;
        overviewEl.textContent = show.overview || 'No overview available.';
        ratingEl.textContent = show.vote_average || 'N/A';
        dateEl.textContent = show.first_air_date || 'Unknown';
        genresEl.textContent = show.genre_ids.map(id => genres[id]).join(', ') || '—';

        if (show.backdrop_path) {
          backdropWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${show.backdrop_path})`;
        } else {
          backdropWrapper.style.backgroundImage = 'none';
        }

        const tr = await fetchTrailer(show.id);
        if (tr) {
          trailerBtn.href = tr;
          trailerBtn.style.display = 'inline-block';
        } else {
          trailerBtn.style.display = 'none';
        }

        if (adultlink) {
          adultlink.href = `./comment.html?id=${show.id}&type=tv`;
          adultlink.classList.remove("d-none");
        }

        modal.show();
      });

      container.appendChild(card);
    });
  }

  fetchAdultTeen();
})();



















(() => {
  const KEY = '2e249fd25cbc54d05736ba7a92ab8e16';
  const container = document.getElementById('sitcom-container');
  const modal = new bootstrap.Modal(document.getElementById('sitcomModal'));

  const titleEl = document.getElementById('sitcomModalLabel');
  const overviewEl = document.getElementById('sitcomOverview');
  const ratingEl = document.getElementById('sitcomRating');
  const genresEl = document.getElementById('sitcomGenres');
  const dateEl = document.getElementById('sitcomFirstAirDate');
  const trailerBtn = document.getElementById('sitcomTrailerBtn');
  const backdropWrapper = document.getElementById('sitcomBackdropWrapper');
  const sitlink = document.getElementById("cometssit");

  async function fetchGenres() {
    const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${KEY}`);
    const { genres } = await res.json();
    return genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
  }

  async function fetchTrailer(id) {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${KEY}`);
    const { results } = await res.json();
    const video = results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    return video ? `https://www.youtube.com/watch?v=${video.key}` : null;
  }

  async function fetchSitcoms() {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${KEY}` +
                `&with_genres=35&with_origin_country=US&sort_by=popularity.desc&language=en-US`;
    
    const [genreMap, res] = await Promise.all([
      fetchGenres(),
      fetch(url).then(r => r.json())
    ]);

    if (!res.results?.length) return console.warn('No sitcoms found.');

    res.results.slice(0, 30).forEach(show => {
      const card = document.createElement('div');
      card.className = 'sitcom-card';
      card.innerHTML = `
        <img src="${show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 
        'https://via.placeholder.com/180x270?text=No+Image'}">
        <p class="sitcom-title">${show.name}</p>`;

      card.addEventListener('click', async () => {
        titleEl.textContent = show.name;
        overviewEl.textContent = show.overview || 'No overview available.';
        ratingEl.textContent = show.vote_average || '—';
        dateEl.textContent = show.first_air_date || '—';
        genresEl.textContent = show.genre_ids.map(id => genreMap[id]).join(', ') || '—';

        // Use background image in the new modal layout
        if (show.backdrop_path) {
          backdropWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${show.backdrop_path})`;
        } else {
          backdropWrapper.style.backgroundImage = 'none';
        }

        const trailer = await fetchTrailer(show.id);
        if (trailer) {
          trailerBtn.href = trailer;
          trailerBtn.style.display = 'inline-block';
        } else {
          trailerBtn.style.display = 'none';
        }

        if (sitlink) {
          sitlink.href = `./comment.html?id=${show.id}&type=tv`;
          sitlink.classList.remove("d-none");
        }

        modal.show();
      });

      container.appendChild(card);
    });
  }

  fetchSitcoms();
})();



(() => {
  const nickApiKey = '2e249fd25cbc54d05736ba7a92ab8e16';

  const nickContainer = document.getElementById('nickelodeon-container');
  const nickModal = new bootstrap.Modal(document.getElementById('nickModal'));

  const nickTitle = document.getElementById('nickModalLabel');
  const nickOverview = document.getElementById('nickOverview');
  const nickRating = document.getElementById('nickRating');
  const nickGenres = document.getElementById('nickGenres');
  const nickFirstAirDate = document.getElementById('nickFirstAirDate');
  const nickTrailerBtn = document.getElementById('nickTrailerBtn');
  const nickBackdropWrapper = document.getElementById('nickBackdropWrapper');
  const nickLink = document.getElementById('cometsnick');

  async function fetchNickShows() {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${nickApiKey}&with_networks=13&sort_by=popularity.desc`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      displayNickShows(data.results);
    } catch (err) {
      console.error('Error fetching Nickelodeon shows:', err);
    }
  }

  async function fetchNickGenres() {
    const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${nickApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }

  async function fetchNickTrailer(tvId) {
    const url = `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${nickApiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const trailer = data.results.find(
      vid => vid.type === 'Trailer' && vid.site === 'YouTube'
    );
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }

  async function displayNickShows(shows) {
    const genreMap = await fetchNickGenres();

    shows.forEach(show => {
      const card = document.createElement('div');
      card.classList.add('nick-card');

      const img = document.createElement('img');
      img.src = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : 'https://via.placeholder.com/180x270?text=No+Image';
      card.appendChild(img);

      const title = document.createElement('p');
      title.className = 'nick-title';
      title.textContent = show.name;
      card.appendChild(title);

      card.style.cursor = 'pointer';

      card.addEventListener('click', async () => {
        nickTitle.textContent = show.name;
        nickOverview.textContent = show.overview || 'No overview available.';
        nickRating.textContent = show.vote_average ?? 'N/A';
        nickFirstAirDate.textContent = show.first_air_date || 'Unknown';
        nickGenres.textContent = show.genre_ids.length
          ? show.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ')
          : 'Unknown';

        if (show.backdrop_path) {
          nickBackdropWrapper.style.backgroundImage = `url(https://image.tmdb.org/t/p/w780${show.backdrop_path})`;
        } else {
          nickBackdropWrapper.style.backgroundImage = 'url(https://via.placeholder.com/780x250?text=No+Backdrop)';
        }

        const trailerLink = await fetchNickTrailer(show.id);
        if (trailerLink) {
          nickTrailerBtn.href = trailerLink;
          nickTrailerBtn.style.display = 'inline-block';
        } else {
          nickTrailerBtn.style.display = 'none';
          nickTrailerBtn.href = '#';
        }

        nickLink.href = `./comment.html?id=${show.id}&type=tv`;
        nickLink.classList.remove("d-none");

        nickModal.show();
      });

      nickContainer.appendChild(card);
    });
  }

  fetchNickShows();
})();





























    





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






























































const nextBtn = document.querySelector('.next'),
    prevBtn = document.querySelector('.prev'),
    carousel = document.querySelector('.carosel'),
    list = document.querySelector('.list'), 
    item = document.querySelectorAll('.item'),
    runningTime = document.querySelector('.carosel .timeRunning') 

let timeRunning = 3000 
let timeAutoNext = 7000

nextBtn.onclick = function(){
    showSlider('next')
}

prevBtn.onclick = function(){
    showSlider('prev')
}

let runTimeOut 

let runNextAuto = setTimeout(() => {
    nextBtn.click()
}, timeAutoNext)


function resetTimeAnimation() {
    runningTime.style.animation = 'none'
    // runningTime.offsetHeight
    runningTime.style.animation = null 
    runningTime.style.animation = 'runningTime 7s linear 1 forwards'
}


function showSlider(type) {
    let sliderItemsDom = list.querySelectorAll('.carosel .list .item')
    if(type === 'next'){
        list.appendChild(sliderItemsDom[0])
        carousel.classList.add('next')
    } else{
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1])
        carousel.classList.add('prev')
    }

    clearTimeout(runTimeOut)

    runTimeOut = setTimeout( () => {
        carousel.classList.remove('next')
        carousel.classList.remove('prev')
    }, timeRunning)


    clearTimeout(runNextAuto)
    runNextAuto = setTimeout(() => {
        nextBtn.click()
    }, timeAutoNext)

    resetTimeAnimation() 
}


resetTimeAnimation()