const movieCards = document.querySelector(".movie-cards-home");
const input = document.querySelector("input");
const button = document.querySelector("button");
const historyList = document.querySelector(".history-list");
const clearHistory = document.querySelector(".clear-history");

async function getMovieBySearch(movie) {
    const url = `https://imdb-com.p.rapidapi.com/search?searchTerm=${movie}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'f6c49f8dd1mshe5b3c262c9ba9bdp1f4928jsn95ea072fe584',
            'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const movieInfo = result.data.mainSearch.edges;
        getMovies(movieInfo);
    } catch (error) {
        console.error(error);
    }
}

function getMovies(result) {
    const movies = result.map((item)=>{
        const impInfo = item.node.entity;
        return {
            id: impInfo?.id,
            title:  impInfo.titleText?.text,
            poster: impInfo.primaryImage?.url || "https://placehold.co/400x400?text=No+Poster+Available",
            year: impInfo.releaseDate?.year
        }
    });
    movieCards.innerHTML = "";
    displayMovies(movies);

    searchHistory(input.value.trim());

    input.value = "";
    displayHistory();
}

function displayMovies(movies) {
    movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card-home");
        movieCard.innerHTML = `<div class="image-wrapper"><img src="${movie.poster}"><button class="favorite-btn">♡</button></div>
                        <h2 class="title">${movie.title}</h2>
                        <p class="year">${movie.year}</p>`;
        
        movieCard.dataset.imdbId = movie.id;

        const img = movieCard.querySelector("img");
        img.width = 300;
        img.height =300;

        movieCards.appendChild(movieCard);

        movieCard.addEventListener("click", (e) => {
            window.location.href = `details.html?imdbId=${e.currentTarget.dataset.imdbId}`;
        });

        const favBtn = movieCard.querySelector(".favorite-btn");

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        const alreadyFav = favorites.some(
            (item) => item.id === movie.id
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
    });
    
}

function searchHistory(movie) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    history = history.filter((item)=>item!==movie);

    history.unshift(movie);

    history = history.slice(0, 10);

    localStorage.setItem("searchHistory", JSON.stringify(history));
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    historyList.innerHTML = "";

    history.forEach((movie) => {
        const historyItem = document.createElement("button");

        historyItem.classList.add("history-item");
        historyItem.textContent = movie;

        historyItem.addEventListener("click", () => {
            input.value = movie;
            getInputVal();
        });

        historyList.appendChild(historyItem);
    });
}

clearHistory.addEventListener("click", () => {
    localStorage.removeItem("searchHistory");
    displayHistory();
});

function getInputVal() {
    const search = input.value.trim();
    if(!search) {
        return;
    }
    getMovieBySearch(search);
}

button.addEventListener("click", getInputVal);
input.addEventListener("keydown", function(e) {
    if(e.key === "Enter") {
        getInputVal();
    }
});

displayHistory();