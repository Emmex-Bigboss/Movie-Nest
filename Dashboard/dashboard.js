const apiKey = '2e249fd25cbc54d05736ba7a92ab8e16'; 
const container = document.getElementById('movie-container');
const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));

const newlink = document.getElementById("comets");  

let genreMap = {};

async function fetchGenres() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
    const data = await res.json();
    data.genres.forEach(genre => {
      genreMap[genre.id] = genre.name;
    });
  } catch (error) {
    console.error('Failed to fetch genres:', error);
  }
}

async function fetchTrendingMovies() {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
    const data = await response.json();

    data.results.forEach(movie => {
      const card = document.createElement('div');
      card.classList.add('movie-card', 'm-2');
      card.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      img.alt = movie.title;
      img.classList.add('img-fluid');

      const title = document.createElement('div');
      title.classList.add('movie-title', 'text-center', 'mt-2', 'fw-bold');
      title.textContent = movie.title;

      card.appendChild(img);
      card.appendChild(title);
      container.appendChild(card);

      card.addEventListener('click', async () => {
        document.getElementById('movieModalLabel').textContent = movie.title;
        document.getElementById('modalOverview').textContent = movie.overview;
        document.getElementById('modalReleaseDate').textContent = movie.release_date;
        document.getElementById('modalBackdropWrapper').style.backgroundImage =
          `url('https://image.tmdb.org/t/p/w780${movie.backdrop_path}')`;

        document.getElementById('modalRating').textContent = `★ ${movie.vote_average.toFixed(1)}`;

        const genreText = movie.genre_ids.map(id => genreMap[id]).join(', ');
        document.getElementById('modalGenres').textContent = genreText || 'Unknown';

        const trailerButton = document.getElementById('trailerButton');
        trailerButton.classList.add('d-none')
        
        
        ;


      

        try {
          const trailerRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`);
          const trailerData = await trailerRes.json();

          const youtubeTrailer = trailerData.results.find(video =>
            video.site === "YouTube" && video.type === "Trailer"
          );

          if (youtubeTrailer) {
            trailerButton.href = `https://www.youtube.com/watch?v=${youtubeTrailer.key}`;
            trailerButton.classList.remove('d-none');
          }
        } catch (trailerError) {
          console.warn('No trailer found:', trailerError);
        }

       
       newlink.href = `./comment.html?id=${movie.id}&type=${movie.media_type}`;
newlink.classList.remove("d-none");

        movieModal.show();
      });
    });
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
    container.innerHTML = '<p>Oops! Something went wrong while loading movies.</p>';
  }
}

(async function main() {
  await fetchGenres();
  fetchTrendingMovies();
})();







const movieContainer = document.getElementById('topmovie-container');

const topTrendingModal = new bootstrap.Modal(document.getElementById('topTrendingModal'));
const topTrendingModalTitle = document.getElementById('topTrendingModalTitle');
const topTrendingModalGenres = document.getElementById('topTrendingModalGenres');
const topTrendingModalDate = document.getElementById('topTrendingModalDate');
const topTrendingModalRating = document.getElementById('topTrendingModalRating');
const topTrendingModalOverview = document.getElementById('topTrendingModalOverview');
const topTrendingTrailerBtn = document.getElementById('topTrendingTrailerBtn');
const toplink = document.getElementById("comets4");

const lastFetch = localStorage.getItem('lastTopTrendingFetch');
const now = new Date().getTime();

if (!lastFetch || now - lastFetch > 86400000) { 
  fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('lastTopTrendingFetch', now);
      localStorage.setItem('topTrendingMovies', JSON.stringify(data.results));
      renderTopTrending(data.results);
    })
    .catch(err => console.error('Error fetching trending movies:', err));
} else {
  const cached = JSON.parse(localStorage.getItem('topTrendingMovies'));
  renderTopTrending(cached);
}

function renderTopTrending(movies) {
  movieContainer.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'card text-white';
    card.style.minWidth = '200px';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
      <div class="card-body">
        <h6 class="card-title">${movie.title}</h6>
      </div>
    `;
    card.addEventListener('click', () => showTopTrendingModal(movie.id));
    movieContainer.appendChild(card);
  });
}

function showTopTrendingModal(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
    .then(res => res.json())
    .then(movie => {
      topTrendingModalTitle.textContent = movie.title;
      topTrendingModalGenres.textContent = movie.genres.map(g => g.name).join(', ');
      topTrendingModalDate.textContent = movie.release_date;
      topTrendingModalRating.textContent = movie.vote_average;
      document.getElementById('topTrendingBackdrop').src = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
      topTrendingModalOverview.textContent = movie.overview;

      toplink.href = `./comment.html?id=${movie.id}&type=movie`;
      toplink.classList.remove("d-none");

      fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          topTrendingTrailerBtn.href = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '#';
          topTrendingTrailerBtn.style.display = trailer ? 'inline-block' : 'none';
        })
        .catch(err => {
          console.error('Error fetching trailer:', err);
          topTrendingTrailerBtn.style.display = 'none';
        });

      topTrendingModal.show();
    })
    .catch(err => {
      console.error('Error fetching movie details:', err);
    });
}















































document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '2e249fd25cbc54d05736ba7a92ab8e16';

  const upcomingContainer = document.getElementById('Upcoming');
  const upcomingModal = new bootstrap.Modal(document.getElementById('upcomingModal'));
  const upcomingTrailerLink = document.getElementById('upcomingtrailer');
  const newlink2 = document.getElementById('comets2'); 

  const modalTitle = document.getElementById('upcomingModalTitle');
  const modalGenres = document.getElementById('upcomingGenres');
  const modalOverview = document.getElementById('upcomingOverview');
  const modalRelease = document.getElementById('upcomingRelease');
  const modalBackdrop = document.getElementById('upcomingBackdrop');

  async function fetchGenres() {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
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

  async function fetchUpcomingMovies() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`);
      const data = await response.json();
      const genreMap = await fetchGenres();

      upcomingContainer.innerHTML = ''; // Clear old content

      data.results.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('text-center');
        movieCard.style.width = '150px';
        movieCard.style.flex = '0 0 auto'; 

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        img.alt = movie.title;
        img.classList.add('rounded');
        img.style.cursor = 'pointer';
        img.style.width = '100%';

        const title = document.createElement('p');
        title.textContent = movie.title;
        title.classList.add('mt-2', 'fw-semibold', 'text-white'); 
        title.style.fontSize = '0.85rem';

        img.addEventListener('click', () => showUpcomingModal(movie, genreMap));

        movieCard.appendChild(img);
        movieCard.appendChild(title);
        upcomingContainer.appendChild(movieCard);
      });
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
    }
  }

 
  function showUpcomingModal(movie, genreMap) {
    modalTitle.textContent = movie.title;
    modalOverview.textContent = movie.overview || 'No overview available.';
    modalRelease.textContent = movie.release_date || 'Unknown';
    modalGenres.textContent = movie.genre_ids.map(id => genreMap[id]).join(', ') || 'Unknown';
    modalBackdrop.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    modalBackdrop.alt = `${movie.title} backdrop`;

    
    newlink2.href = `./comment.html?id=${movie.id}&type=movie`;
    newlink2.classList.remove("d-none");

  
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        if (trailer) {
          upcomingTrailerLink.href = `https://www.youtube.com/watch?v=${trailer.key}`;
          upcomingTrailerLink.classList.remove('disabled');
        } else {
          upcomingTrailerLink.href = '#';
          upcomingTrailerLink.classList.add('disabled');
        }
      })
      .catch(error => {
        console.error('Error fetching trailer:', error);
        upcomingTrailerLink.href = '#';
        upcomingTrailerLink.classList.add('disabled');
      });

    upcomingModal.show();
  }

  fetchUpcomingMovies();
});














const tvContainer = document.getElementById('tv-container');
const tvModal = new bootstrap.Modal(document.getElementById('tvModal'));
const tvTrailerButton = document.getElementById('tvTrailerButton');
const tvBackdrop = document.getElementById('tvBackdrop');
const readMoreBtn = document.getElementById('tvReadMoreBtn');
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
      img.src = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
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

        tvBackdrop.src = `https://image.tmdb.org/t/p/w780${show.backdrop_path}`;
        tvBackdrop.alt = show.name;

       
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
const nollyTitle = document.getElementById('nollyTitle');
const nollyOverview = document.getElementById('nollyOverview');
const nollyRating = document.getElementById('nollyRating');
const nollyGenres = document.getElementById('nollyGenres');
const nollyReleaseDate = document.getElementById('nollyReleaseDate');
const nollyTrailerBtn = document.getElementById('nollyTrailerBtn');
const nollylink = document.getElementById("cometsng");
const nollyBackdrop = document.getElementById('nollyBackdrop');

async function fetchNollyMovies() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_origin_country=NG&sort_by=popularity.desc`;
  const res = await fetch(url);
  const data = await res.json();
  const movies = data.results;
  displayNollyMovies(movies);
}

async function fetchNollyGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});
}

async function fetchNollyTrailer(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  const trailer = data.results.find(
    vid => vid.type === 'Trailer' && vid.site === 'YouTube'
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

async function displayNollyMovies(movies) {
  const genreMap = await fetchNollyGenres();

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('nolly-card');

    const img = document.createElement('img');
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/180x270?text=No+Image';
    card.appendChild(img);

    const title = document.createElement('p');
    title.className = 'nolly-title';
    title.textContent = movie.title;
    card.appendChild(title);

    card.addEventListener('click', async () => {
      nollyTitle.textContent = movie.title;
      nollyOverview.textContent = movie.overview || 'No overview available.';
      nollyRating.textContent = movie.vote_average || 'N/A';
      nollyReleaseDate.textContent = movie.release_date || 'Unknown';
      nollyGenres.textContent = movie.genre_ids.map(id => genreMap[id]).join(', ') || 'Unknown';

      nollyBackdrop.src = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
        : 'https://via.placeholder.com/780x250?text=No+Backdrop';

      const trailerLink = await fetchNollyTrailer(movie.id);
      if (trailerLink) {
        nollyTrailerBtn.href = trailerLink;
        nollyTrailerBtn.style.display = 'inline-block';
      } else {
        nollyTrailerBtn.style.display = 'none';
      }

      
      nollylink.href = `./comment.html?id=${movie.id}&type=movie`;
      nollylink.classList.remove("d-none");

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
  const kdramaTitle = document.getElementById('kdramaTitle');
  const kdramaOverview = document.getElementById('kdramaOverview');
  const kdramaRating = document.getElementById('kdramaRating');
  const kdramaGenres = document.getElementById('kdramaGenres');
  const kdramaFirstAirDate = document.getElementById('kdramaFirstAirDate');
  const kdramaTrailerBtn = document.getElementById('kdramaTrailerBtn');
  const kdramaBackdrop = document.getElementById('kdramaBackdrop');
  const kdlink = document.getElementById("cometskd");

  async function fetchKdramas() {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${kdramaApiKey}&with_origin_country=KR&with_genres=18&sort_by=popularity.desc`;
    const res = await fetch(url);
    const data = await res.json();
    displayKdramas(data.results);
  }

  // Fetch TV genres
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

      card.addEventListener('click', async () => {
        kdramaTitle.textContent = show.name;
        kdramaOverview.textContent = show.overview || 'No overview available.';
        kdramaRating.textContent = show.vote_average || 'N/A';
        kdramaFirstAirDate.textContent = show.first_air_date || 'Unknown';
        kdramaGenres.textContent = show.genre_ids.map(id => genreMap[id]).join(', ') || 'Unknown';

        kdramaBackdrop.src = show.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${show.backdrop_path}`
          : 'https://via.placeholder.com/780x250?text=No+Backdrop';

        const trailerLink = await fetchKdramaTrailer(show.id);
        if (trailerLink) {
          kdramaTrailerBtn.href = trailerLink;
          kdramaTrailerBtn.style.display = 'inline-block';
        } else {
          kdramaTrailerBtn.style.display = 'none';
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
  const teenTitle = document.getElementById('teenTitle');
  const teenOverview = document.getElementById('teenOverview');
  const teenRating = document.getElementById('teenRating');
  const teenGenres = document.getElementById('teenGenres');
  const teenFirstAirDate = document.getElementById('teenFirstAirDate');
  const teenTrailerBtn = document.getElementById('teenTrailerBtn');
  const teenBackdrop = document.getElementById('teenBackdrop');
  const teenlink = document.getElementById('cometteen'); // element, keep as is

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

        teenBackdrop.src = show.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${show.backdrop_path}`
          : 'https://via.placeholder.com/780x250?text=No+Backdrop';

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
  const titleEl = document.getElementById('adultteenTitle');
  const overviewEl = document.getElementById('adultteenOverview');
  const ratingEl = document.getElementById('adultteenRating');
  const genresEl = document.getElementById('adultteenGenres');
  const dateEl = document.getElementById('adultteenFirstAirDate');
  const trailerBtn = document.getElementById('adultteenTrailerBtn');
  const backdropEl = document.getElementById('adultteenBackdrop');
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
        overviewEl.textContent = show.overview;
        ratingEl.textContent = show.vote_average;
        dateEl.textContent = show.first_air_date;
        genresEl.textContent = show.genre_ids.map(id => genres[id]).join(', ') || '—';
        backdropEl.src = show.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${show.backdrop_path}`
          : 'https://via.placeholder.com/780x250?text=No+Backdrop';

        const tr = await fetchTrailer(show.id);
        if (tr) {
          trailerBtn.href = tr;
          trailerBtn.style.display = '';
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

  const titleEl = document.getElementById('sitcomTitle');
  const overviewEl = document.getElementById('sitcomOverview');
  const ratingEl = document.getElementById('sitcomRating');
  const genresEl = document.getElementById('sitcomGenres');
  const dateEl = document.getElementById('sitcomFirstAirDate');
  const trailerBtn = document.getElementById('sitcomTrailerBtn');
  const backImg = document.getElementById('sitcomBackdrop');
  const sitlink = document.getElementById("cometssit");

  async function fetchGenres() {
    const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${KEY}`);
    const { genres } = await res.json();
    return genres.reduce((m, g) => (m[g.id] = g.name, m), {});
  }

  async function fetchTrailer(id) {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${KEY}`);
    const { results } = await res.json();
    const vid = results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    return vid ? `https://www.youtube.com/watch?v=${vid.key}` : null;
  }

  async function fetchSitcoms() {
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${KEY}` +
                `&with_genres=35&with_origin_country=US&sort_by=popularity.desc&language=en-US`;
    const [genreMap, res] = await Promise.all([fetchGenres(), fetch(url).then(r => r.json())]);
    if (!res.results?.length) return console.warn('No sitcoms found.');

    res.results.slice(0, 30).forEach(show => {
      const card = document.createElement('div');
      card.className = 'sitcom-card';
      card.innerHTML = `<img src="${show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 
            'https://via.placeholder.com/180x270?text=No+Image'}"><p class="sitcom-title">${show.name}</p>`;

      card.addEventListener('click', async () => {
        titleEl.textContent = show.name;
        overviewEl.textContent = show.overview;
        ratingEl.textContent = show.vote_average;
        dateEl.textContent = show.first_air_date;
        genresEl.textContent = show.genre_ids.map(id => genreMap[id]).join(', ') || '—';
        backImg.src = show.backdrop_path ? `https://image.tmdb.org/t/p/w780${show.backdrop_path}` : '';

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