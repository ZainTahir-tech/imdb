const param = new URLSearchParams(window.location.search);
const genre = param.get("genre");
const genreCard = document.querySelector(".genre-movie-cards");
const h2 = document.querySelector("h2");
const prevPage = document.querySelector(".prev-page");
const nextPage = document.querySelector(".next-page");
const pageNumbers = document.querySelector(".page-numbers");

let currentPage = 1;
let totalPages = 1;

h2.textContent = `${genre} Movies`;

async function getGenres(genre) {
    const url = `https://moviesminidatabase.p.rapidapi.com/movie/byGen/${genre}/?page=${currentPage}`;
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
        const movies = result.results;
        totalPages = Math.ceil(result.count / 50);
        getMovieDetails(movies);
    } catch (error) {
        console.error(error);
    }
}

async function getMovieDetails(movies) {
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
    displayMovies(movieDetails);
    displayPagination();
}

function displayPagination() {

    pageNumbers.innerHTML = "";

    let pages = [];

    if (totalPages <= 7) {

        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

    } else {

        pages.push(1);

        if (currentPage > 4) {
            pages.push("...");
        }

        let start = Math.max(2, currentPage - 2);
        let end = Math.min(totalPages - 1, currentPage + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 3) {
            pages.push("...");
        }

        pages.push(totalPages);
    }

    pages.forEach((page) => {

        if (page === "...") {

            const dots = document.createElement("span");
            dots.textContent = "...";
            dots.classList.add("pagination-dots");

            pageNumbers.appendChild(dots);

            return;
        }

        const pageButton = document.createElement("button");

        pageButton.textContent = page;
        pageButton.classList.add("page-number");

        if (page === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {

            currentPage = page;

            getGenres(genre);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        pageNumbers.appendChild(pageButton);
    });

    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
}

prevPage.addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        getGenres(genre);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});

nextPage.addEventListener("click", () => {

    if (currentPage < totalPages) {

        currentPage++;

        getGenres(genre);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});

function displayMovies(movies) {

    genreCard.innerHTML = "";

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

    genreCard.appendChild(movieCard);

    });
}

getGenres(genre);