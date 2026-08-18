const params = new URLSearchParams(window.location.search);
const imdbId = params.get("imdbId");
const movieCards = document.querySelector(".movie-cards-details");

async function getMovieDetails(movieId) {
    const url = `https://moviesminidatabase.p.rapidapi.com/movie/id/${movieId}/`;
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
        getSpecificMovieDetails(result.results);
    } catch (error) {
        console.error(error);
    }
}

getMovieDetails(imdbId);

async function getCast(movieId) {
    const url = `https://imdb-com.p.rapidapi.com/title/get-top-cast-and-crew?tconst=${movieId}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'my-api-key',
            'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const casts = result.data.title.principalCredits[2].credits.map((item) => {
            return {
                name: item.name.nameText?.text,
                image: item.name.primaryImage?.url ||
                    "https://placehold.co/200x200?text=No+Image"
            };
        });

        return casts;

    } catch (error) {
        console.error(error);
    }
}

async function getImages(movieId) {
    const url = `https://imdb-com.p.rapidapi.com/title/get-images?tconst=${movieId}&limit=12`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'my-api-key',
            'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.data.title.images.edges;
    } catch (error) {
        console.error(error);
    }
}

async function getReviews(movieId) {
    const url = `https://imdb-com.p.rapidapi.com/title/get-critics-review-summary?tconst=${movieId}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'my-api-key',
            'x-rapidapi-host': 'imdb-com.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.data.title.metacritic.reviews.edges;
    } catch (error) {
        console.error(error);
    }
}

async function getSpecificMovieDetails(result) {
    const movie = {
        id: result?.imdb_id,
        title: result?.title,
        poster: result?.image_url || "https://placehold.co/400x400?text=No+Poster+Available",
        banner: result?.banner || "https://placehold.co/400x400?text=No+Banner+Available",
        year: result?.year,
        releaseDate: result?.release,
        runtime: result?.movie_length,
        description: result?.description,
        plot: result?.plot,
        rating: result?.rating,
        genres: result?.gen?.map(item => item.genre) || [],
        casts: await getCast(result?.imdb_id),
        trailer: result?.trailer,
        images: await getImages(result?.imdb_id),
        reviews: await getReviews(result?.imdb_id)
    };

    displayMovie(movie);
}

function formatRuntime(mins) {
    const hours = Math.floor(mins / 60);
    const remainMinutes = (mins % 60)
    return `${hours}h ${remainMinutes}m`;
}

function displayMovie(movie) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");

    const img = document.createElement("img");
    img.src = movie.poster;

    const favBtn = document.createElement("div");
    favBtn.classList.add("favorite-btn");
    favBtn.textContent = "♡";

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(favBtn);

    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = movie.title;

    const year = document.createElement("p");
    year.classList.add("year");
    year.textContent = movie.year;

    const rating = document.createElement("p");
    rating.classList.add("rating");
    rating.textContent = `⭐ ${movie.rating}`;

    const releaseDate = document.createElement("p");
    releaseDate.classList.add("release-date");
    releaseDate.innerHTML = `
        Release Date: <span>${movie.releaseDate.split("-").reverse().join("-")}</span>
    `;

    const runtime = document.createElement("p");
    runtime.classList.add("runtime");
    runtime.innerHTML = `
        Runtime: <span>${formatRuntime(movie.runtime)}</span>
    `;

    const plot = document.createElement("p");
    plot.classList.add("plot");
    plot.textContent = movie.plot;

    const genres = document.createElement("div");
    genres.classList.add("genres");

    movie.genres.forEach((genre) => {
        const genreElement = document.createElement("span");

        genreElement.classList.add("genre");
        genreElement.textContent = genre;

        genres.appendChild(genreElement);
    });

    const movieImagesWrapper = document.createElement("div");
    movieImagesWrapper.classList.add("movie-images-wrapper");

    const imagesTitle = document.createElement("h2");
    imagesTitle.classList.add("images-title");
    imagesTitle.textContent = "Images";

    movieImagesWrapper.appendChild(imagesTitle);

    movie.images.forEach((item) => {
        const images = document.createElement("img");
        images.classList.add("movie-images");
        images.src = item.node.url;

        images.alt = item.node.caption?.plainText;

        movieImagesWrapper.appendChild(images);
    });

    const trailerWrapper = document.createElement("div");
    trailerWrapper.classList.add("trailer-wrapper");

    const trailerTitle = document.createElement("h2");
    trailerTitle.classList.add("trailer-title");
    trailerTitle.textContent = "Trailer";

    const iframe = document.createElement("iframe");
    iframe.src = movie.trailer;
    iframe.width = "600";
    iframe.height = "400";
    iframe.style.border = "none";
    iframe.allowFullscreen = true;

    trailerWrapper.appendChild(trailerTitle);
    trailerWrapper.appendChild(iframe);

    const castsImages = document.createElement("div");
    castsImages.classList.add("casts-images");

    const castTitle = document.createElement("h2");
    castTitle.classList.add("cast-title");
    castTitle.textContent = "Top Cast";

    castsImages.appendChild(castTitle);

    movie.casts.forEach((item) => {
        const castCard = document.createElement("div");
        castCard.classList.add("cast-card");

        const imageWrapperCast = document.createElement("div");
        imageWrapperCast.classList.add("image-wrapper-cast");

        const imgCast = document.createElement("img");
        imgCast.src = item.image;

        imageWrapperCast.appendChild(imgCast);

        const name = document.createElement("h3");
        name.classList.add("name");
        name.textContent = item.name;

        castCard.appendChild(imageWrapperCast);
        castCard.appendChild(name);

        castsImages.appendChild(castCard);
    });

    const reviewsWrapper = document.createElement("div");
    reviewsWrapper.classList.add("reviews-wrapper");

    const reviewsTitle = document.createElement("h2");
    reviewsTitle.classList.add("reviews-title");
    reviewsTitle.textContent = "Critics Reviews";

    reviewsWrapper.appendChild(reviewsTitle);

    const leftBtn = document.createElement('div');
    leftBtn.className = 'left';
    leftBtn.innerHTML = '&lt;';

    const rightBtn = document.createElement('div');
    rightBtn.className = 'right';
    rightBtn.innerHTML = '&gt;';

    const testimonial = document.createElement('div');
    testimonial.className = 'testimonial';

    const score = document.createElement('p');
    score.className = 'score';

    const q = document.createElement('q');

    const content = document.createElement('p');
    content.className = 'content';

    const line = document.createElement('div');
    line.className = 'line';

    const nameLabel = document.createElement('p');
    nameLabel.className = 'name-label';
    const roleLabel = document.createElement('p');
    roleLabel.className = 'role-label';

    testimonial.appendChild(score);
    testimonial.appendChild(q);
    testimonial.appendChild(content);
    testimonial.appendChild(line);
    testimonial.appendChild(nameLabel);
    testimonial.appendChild(roleLabel);

    reviewsWrapper.appendChild(leftBtn);
    reviewsWrapper.appendChild(testimonial);
    reviewsWrapper.appendChild(rightBtn);

    let index = 0;

    function updateTestimonial() {
        const review = movie.reviews[index].node;

        score.textContent = `${review.score} / 100`;
        content.textContent = review.quote?.value || "";
        nameLabel.textContent = review.reviewer || "";
        roleLabel.textContent = review.site || "";
    }

    rightBtn.addEventListener("click", function (e) {
        index = (index + 1) % movie.reviews.length;
        updateTestimonial();
    });

    leftBtn.addEventListener("click", function (e) {
        index = (index - 1 + movie.reviews.length) % movie.reviews.length;
        updateTestimonial();
    });

    updateTestimonial();

    movieCard.appendChild(imageWrapper);
    movieCard.appendChild(title);
    movieCard.appendChild(year);
    movieCard.appendChild(rating);
    movieCard.appendChild(releaseDate);
    movieCard.appendChild(runtime);
    movieCard.appendChild(plot);
    movieCard.appendChild(genres);
    movieCard.appendChild(movieImagesWrapper);
    movieCard.appendChild(trailerWrapper);
    movieCard.appendChild(castsImages);
    movieCard.appendChild(reviewsWrapper);

    movieCards.appendChild(movieCard);

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
                (item) => item.id === movie.id
            );

            if (alreadyFav) {

                favorites = favorites.filter(
                    (item) => item.id !== movie.id
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
}