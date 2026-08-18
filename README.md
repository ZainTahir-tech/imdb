# 🎬 Movie Explorer

A responsive, dark-themed movie discovery web app built with vanilla HTML, CSS, and JavaScript. Browse popular and top-rated movies, search by title, filter by genre, and save favorites — all without a framework or build step.

## Features

- **Home page** — Popular Movies and Top Rated Movies carousels, plus a genre picker
- **Search** — Look up movies by title, with a persisted, clickable search history (last 10 searches)
- **Genre browsing** — Paginated movie grid filtered by genre (Action, Comedy, Drama, Horror, Fantasy, Adventure, Sci-Fi, Thriller, Mystery, Animation)
- **Movie details** — Poster, rating, release date, runtime, plot, genres, image gallery, embedded trailer, top cast, and a swipeable critic reviews carousel
- **Favorites** — Add/remove movies from any page; favorites persist in `localStorage` and are viewable on a dedicated page
- **Responsive design** — Breakpoints for tablet and mobile layouts throughout

## Tech Stack

- **HTML5** — Semantic markup, one file per page
- **CSS3** — Custom dark theme (`styles.css`), CSS Grid/Flexbox layouts, responsive media queries
- **Vanilla JavaScript (ES6+)** — No frameworks or bundlers; `async/await`, the Fetch API, and DOM APIs
- **Web Storage API** — `localStorage` for favorites and search history

## Project Structure

```
.
├── index.html          # Home page (popular / top rated / genre picker)
├── script.js            # Home page logic
├── search.html          # Search page
├── search.js             # Search logic + search history
├── genres.html          # Genre results page
├── genres.js             # Genre fetching + pagination
├── details.html         # Movie details page
├── details.js            # Details, cast, images, trailer, reviews
├── favorites.html       # Favorites page
├── favorites.js          # Favorites list rendering
├── styles.css            # Global styles for all pages
└── readme.md              # This file
```

## APIs Used

The app pulls data from two RapidAPI-hosted endpoints:

| API | Used for |
|---|---|
| [MoviesMiniDatabase](https://rapidapi.com/) | Popular/top-rated movie lists, movie details, genre-filtered results |
| [IMDb (imdb-com)](https://rapidapi.com/) | Title search, top cast & crew, movie images, critic review summaries |

## Setup

1. **Get a RapidAPI key**
   Sign up at [RapidAPI](https://rapidapi.com/) and subscribe to the **MoviesMiniDatabase** and **IMDb** APIs listed above.

2. **Add your API key**
   Every fetch call currently uses the placeholder `'my-api-key'` in the `x-rapidapi-key` header. Replace it in each JS file:
   - `script.js`
   - `search.js`
   - `genres.js`
   - `details.js`

   > 💡 For a real deployment, don't hardcode the key client-side — proxy requests through a small backend or serverless function so the key isn't exposed in the browser.

3. **Run it locally**
   No build step is required — just serve the folder with any static server, for example:
   ```bash
   npx serve .
   ```
   or open `index.html` directly in a browser (note that some browsers restrict `fetch` on `file://` URLs, so a local server is recommended).

## How Favorites & History Work

- **Favorites** are stored under the `favorites` key in `localStorage` as an array of movie objects. Each page independently checks and toggles this list when the heart icon is clicked.
- **Search history** is stored under the `searchHistory` key in `localStorage`, capped at the 10 most recent unique searches, and can be cleared from the Search page.

## Known Limitations

- API keys are stored client-side (see Setup note above) — not suitable for production as-is.
- No loading spinners or error states are currently shown while data fetches — a failed request just logs to the console.
- Favorites saved from different pages store slightly different movie object shapes (`id` vs `imdb_id`), so favorite status may not always sync perfectly across pages.

## Roadmap

- [ ] Loading and error UI states
- [ ] Normalize movie object shape across pages (consistent ID field)
- [ ] Backend proxy to hide API keys
- [ ] Debounced live search suggestions