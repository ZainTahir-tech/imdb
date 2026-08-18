const popularMovies = document.querySelector(".home-movie-cards");
const topRated = document.querySelector(".top-rated");
const select = document.querySelector("select");

async function getPopular() {
    const url = 'https://moviesminidatabase.p.rapidapi.com/movie/order/byPopularity/';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'my-api-key',
            'x-rapidapi-host': 'moviesminidatabase.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const movies = result.results.slice(0, 10);
        getMovieDetails(movies, "popular");
    } catch (error) {
        console.error(error);
    }
}

async function getTopRated() {
    const url = 'https://moviesminidatabase.p.rapidapi.com/movie/order/byRating/';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'my-api-key',
            'x-rapidapi-host': 'moviesminidatabase.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const movies = result.results.slice(0, 10);
        getMovieDetails(movies, "toprated");
    } catch (error) {
        console.error(error);
    }
}

async function getMovieDetails(movies, type) {
    const movieDetails = await Promise.all(
        movies.map(async (movie) => {
            const url = `https://moviesminidatabase.p.rapidapi.com/movie/id/${movie.imdb_id}/`;

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': 'my-api-key',
                    'x-rapidapi-host': 'moviesminidatabase.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            };

            try {
                const response = await fetch(url, options);
                const result = await response.json();

                return result.results;

            } catch (error) {
                console.error(error);
            }
        })
    );
    if (type === "popular") {
        displayMovies(movieDetails, "popular");
    }
    if (type === "toprated") {
        displayMovies(movieDetails, "toprated");
    }
}

function displayMovies(movies, type) {

    if (type === "popular") {
        popularMovies.innerHTML = "";
    }

    if (type === "toprated") {
        topRated.innerHTML = "";
    }

    movies.forEach((movie) => {

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card-home");

        movieCard.innerHTML = `
            <div class="image-wrapper">
                <img 
                    src="${movie?.image_url || "https://placehold.co/400x400?text=No+Poster+Available"}"
                    alt="${movie.title}"
                >
                <button class="favorite-btn">♡</button>
            </div>

            <h2 class="title">${movie.title}</h2>

            <p class="year">${movie.year}</p>
        `;

        const img = movieCard.querySelector("img");

        img.addEventListener("error", () => {
            img.src = "https://placehold.co/400x600?text=No+Poster";
        });

        movieCard.dataset.imdbId = movie.imdb_id;

        movieCard.addEventListener("click", (e) => {
            window.location.href =
                `details.html?imdbId=${e.currentTarget.dataset.imdbId}`;
        });

        const favBtn = movieCard.querySelector(".favorite-btn");

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        const alreadyFav = favorites.some(
            (item) => item.imdb_id === movie.imdb_id
        );

        if (alreadyFav) {
            favBtn.textContent = "♥";
        }

        favBtn.addEventListener("click", (e) => {

            e.stopPropagation();

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            const alreadyFav = favorites.some(
                (item) => item.imdb_id === movie.imdb_id
            );

            if (alreadyFav) {

                favorites = favorites.filter(
                    (item) => item.imdb_id !== movie.imdb_id
                );

                favBtn.textContent = "♡";

            } else {

                favorites.push(movie);

                favBtn.textContent = "♥";
            }

            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites)
            );
        });

        if (type === "popular") {
            popularMovies.appendChild(movieCard);
        }

        if (type === "toprated") {
            topRated.appendChild(movieCard);
        }
    });
}

getPopular();
getTopRated();

select.addEventListener("change", function(e) {
    const genre = select.value;
    if(!genre) {
        return
    }
    window.location.href = `genres.html?genre=${genre}`
});