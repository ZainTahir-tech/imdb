const favoriteMovies = document.querySelector(".favorite-movie-cards");
const emptyFavorites = document.querySelector(".empty-favorites");
const clearFavorites = document.querySelector(".clear-favorites");

function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function displayFavorites() {

    const favorites = getFavorites();

    favoriteMovies.innerHTML = "";

    if (favorites.length === 0) {
        emptyFavorites.style.display = "block";
        return;
    }

    emptyFavorites.style.display = "none";

    favorites.forEach((movie) => {

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card-home");

        movieCard.innerHTML = `
            <div class="image-wrapper">

                <img 
                    src="${movie?.image_url || "https://placehold.co/400x600?text=No+Poster"}"
                    alt="${movie.title}"
                >

                <button class="favorite-btn">♥</button>

            </div>

            <h2 class="title">${movie.title}</h2>

            <p class="year">${movie.year}</p>
        `;

        const img = movieCard.querySelector("img");

        img.addEventListener("error", () => {
            img.src = "https://placehold.co/400x600?text=No+Poster";
        });

        movieCard.addEventListener("click", () => {
            window.location.href =
                `details.html?imdbId=${movie.imdb_id}`;
        });

        const favBtn = movieCard.querySelector(".favorite-btn");

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            let favorites = getFavorites();

            favorites = favorites.filter(
                (item) => item.imdb_id !== movie.imdb_id
            );

            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites)
            );

            displayFavorites();
        });

        favoriteMovies.appendChild(movieCard);
    });
}

clearFavorites.addEventListener("click", () => {

    localStorage.removeItem("favorites");

    displayFavorites();
});

displayFavorites();