const apiKey = "b188c6148b0cc3989e1d96a50a2502fc"; // Add your API key


document.addEventListener("DOMContentLoaded", () => {
  loadTrending();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        searchMovie();
      }
    });
  }

  // Close button fix
  const closeBtn = document.getElementById("closeModalBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // ESC key close
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Click outside close
  const modal = document.getElementById("movieModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
});


// ================= SEARCH =================

async function searchMovie() {
  const query = document.getElementById("searchInput").value.trim();
  const category = document.getElementById("category").value;
  const loader = document.getElementById("loader");
  const sectionTitle = document.getElementById("sectionTitle");

  if (!query) return;

  sectionTitle.innerText = "Search Results";
  loader.style.display = "block";

  try {
    const url = `https://api.themoviedb.org/3/search/${category}?api_key=${apiKey}&query=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.results || []);
  } catch (error) {
    console.error("Search Error:", error);
  }

  loader.style.display = "none";
}


// ================= TRENDING =================

async function loadTrending() {
  const loader = document.getElementById("loader");
  const sectionTitle = document.getElementById("sectionTitle");

  sectionTitle.innerText = "Trending Today";
  loader.style.display = "block";

  try {
    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.results || []);
  } catch (error) {
    console.error("Trending Error:", error);
  }

  loader.style.display = "none";
}


// ================= DISPLAY CARDS =================

function displayResults(movies) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <h3>${movie.title || movie.name}</h3>
    `;

    card.addEventListener("click", () => {
      const mediaType =
        movie.media_type ||
        (movie.first_air_date ? "tv" : "movie");

      openMovieDetails(movie.id, mediaType);
    });

    resultsDiv.appendChild(card);
  });
}


// ================= MOVIE DETAILS =================

async function openMovieDetails(id, type = "movie") {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=credits,videos`
    );

    const data = await res.json();

    // Lock scroll
    document.body.style.overflow = "hidden";

    // Poster
    const poster = document.getElementById("modalPoster");
    if (poster) {
      poster.src = data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "";
    }

    // Backdrop
    const backdrop = document.getElementById("modalBackdrop");
    if (backdrop && data.backdrop_path) {
      backdrop.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;
    }

    // Title
    const titleEl = document.getElementById("modalTitle");
    if (titleEl) {
      titleEl.textContent = data.title || data.name || "Untitled";
    }

    // Tagline
    const taglineEl = document.getElementById("modalTagline");
    if (taglineEl) {
      taglineEl.textContent = data.tagline || "";
    }

    // Overview
    const overviewEl = document.getElementById("modalOverview");
    if (overviewEl) {
      overviewEl.textContent =
        data.overview || "No description available.";
    }

    // Extra Details (RESTORED)
    const extra = document.getElementById("modalExtraDetails");
    if (extra) {
      extra.innerHTML = `
        <p><strong>Genres:</strong> ${
          data.genres?.map(g => g.name).join(", ") || "N/A"
        }</p>
        <p><strong>Runtime:</strong> ${
          data.runtime || data.episode_run_time?.[0] || "N/A"
        } min</p>
        <p><strong>Language:</strong> ${
          data.original_language?.toUpperCase() || "N/A"
        }</p>
        <p><strong>Popularity:</strong> ${
          data.popularity || "N/A"
        }</p>
      `;
    }

    // Rating
    const ratingEl = document.getElementById("modalRating");
    if (ratingEl) {
      ratingEl.textContent = data.vote_average || "N/A";
    }

    // Release
    const releaseEl = document.getElementById("modalRelease");
    if (releaseEl) {
      releaseEl.textContent =
        data.release_date || data.first_air_date || "N/A";
    }

    // Cast
    const castContainer = document.getElementById("modalCast");
    if (castContainer) {
      castContainer.innerHTML = "";

      if (data.credits?.cast) {
        data.credits.cast.slice(0, 5).forEach(actor => {
          if (!actor.profile_path) return;

          const img = document.createElement("img");
          img.src = `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
          img.title = actor.name;
          castContainer.appendChild(img);
        });
      }
    }

    // Trailer
    const trailer = data.videos?.results.find(
      vid => vid.type === "Trailer" && vid.site === "YouTube"
    );

    const trailerBtn = document.getElementById("trailerBtn");
    if (trailerBtn) {
      trailerBtn.onclick = () => {
        if (trailer) {
          window.open(
            `https://www.youtube.com/watch?v=${trailer.key}`,
            "_blank"
          );
        } else {
          alert("No trailer available.");
        }
      };
    }

    // Show modal
    const modal = document.getElementById("movieModal");
    if (modal) {
      modal.style.display = "block";
    }

  } catch (error) {
    console.error("Error fetching details:", error);
  }
}


// ================= CLOSE MODAL =================

function closeModal() {
  const modal = document.getElementById("movieModal");
  if (modal) {
    modal.style.display = "none";
  }

  // Unlock scroll
  document.body.style.overflow = "auto";
}


// ================= HOME =================

function goHome() {
  document.getElementById("searchInput").value = "";
  loadTrending();
}


// ================= THEME =================

function toggleTheme() {
  document.body.classList.toggle("light-mode");

}

