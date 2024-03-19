import { truncate } from "../../shared/utils.js";
import { Movie, Genre, MovieData, GenresData } from "./interfaces.js";
import { CONSTANTS } from "../../shared/constants.js";

let page: number = 1;
let movies: Movie[];
let genres: Genre[];
let typingTimer: ReturnType<typeof setTimeout>;
let doneTypingInterval: number = 1400;

const sortContainer: HTMLSelectElement = document.getElementById(
	"sort-by"
)! as HTMLSelectElement;
const genresContainer: HTMLSelectElement = document.getElementById(
	"category"
)! as HTMLSelectElement;
const moviesContainer: HTMLDivElement = document.getElementById(
	"movie-container"
)! as HTMLDivElement;
const loadButtonContainer: HTMLDivElement = document.getElementById(
	"load-more"
)! as HTMLDivElement;
const loadButton: HTMLButtonElement = document.getElementById(
	"btn-load"
)! as HTMLButtonElement;
const searchBar: HTMLInputElement = document.getElementById(
	"search"
)! as HTMLInputElement;
const currentPage: string = location.href
const loginBtn = document.getElementById('login/logout')!
const sessionId: string | null = sessionStorage.getItem("sessionId");
const profileButton: HTMLUListElement = document.getElementById(
	"profile"
)! as HTMLUListElement;

loginBtn.dataset.page = currentPage

const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: CONSTANTS.API_KEY,
	},
};

// Displaying profile button if logged in
if (sessionId) {
	profileButton.style.display = 'list-item'
}

const getMovies = async (load_more: boolean = false): Promise<void> => {
	// Hiding the load more button
	loadButtonContainer.style.display = "none";

	// Checking if movie list is getting refreshed to display the load animation
	if (!load_more) {
		page = 1;
		moviesContainer.innerHTML = '<div class="loader"></div>';
	}

	let url: string = `${CONSTANTS.MOVIE_URL}?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=${sortContainer.value}&vote_count.gte=800`;

	// Genre filter
	if (genresContainer.value) {
		url += `&with_genres=${genresContainer.value}`;
	}

	try {
		const response: Response = await fetch(url, options);
		const movieData: MovieData = await response.json();

		movies = movieData.results;
	} catch (error) {
		console.log(error);
	}
};

// Loading the available genres from the API
const getGenres = async (): Promise<void> => {
	try {
		const response: Response = await fetch(CONSTANTS.GENRES_URL, options);
		const genresData: GenresData = await response.json();

		genres = genresData.genres;

		// Building the genres radio buttons
		for (const genre of genres) {
			genresContainer.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
		}
	} catch (error) {
		console.log(error);
	}
};

const buildView = (load_more: boolean = false) => {
	// Checking if more movies are being loaded
	if (!load_more) {
		moviesContainer.innerHTML = "";
	}

	// Building movie view
	if (movies.length > 0) {
		for (const movie of movies) {
			moviesContainer.innerHTML += `<div class="card">
    <div class="img-container">
      <a href="${CONSTANTS.MOVIE_DETAILS_APP_URL}?id=${movie.id}">
        <img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        alt="poster"
      />
      </a>
    </div>
    <div class="details-container">
      <a href="">
        <p class="title">Title: ${movie.title}</p>
      </a>
      <p class="release-date">Release date: ${movie.release_date}</p>
      <p class="overview">Overview: ${truncate(movie.overview, 140)}</p>
      <div class="stats">
        <p>Rating: ${movie.vote_average.toFixed(1)}</p>
        <p>Votes: ${movie.vote_count}</p>
      </div>
    </div>
  </div>`;
		}
		loadButtonContainer.style.display = "flex";
	} else {
		moviesContainer.innerHTML += "<p id='no-content'>No movies found</p>";
	}
};

const loadPage = (): void => {
	getGenres().then(() => {
		getMovies().then(() => buildView());
	});
};

// Search for movies by title
const searchMovies = async (load_more: boolean = false) => {
	if (!load_more) {
		page = 1;
	}

	// Hiding the load more button
	loadButtonContainer.style.display = "none";

	// Displaying the load animation
	if (!load_more) {
		moviesContainer.innerHTML = '<div class="loader"></div>';
	}

	const title: string = new URLSearchParams({
		query: searchBar.value,
	}).toString();

	const url: string = `${CONSTANTS.SEARCH_MOVIE_URL}?${title}&include_adult=false&language=en-US&page=${page}`;

	try {
		const response: Response = await fetch(url, options);
		const movieData: MovieData = await response.json();

		movies = movieData.results;
	} catch (error) {
		console.log(error);
	}

	if (!load_more) {
		buildView();
	}
};

// Getting new movies after category change or sort by change
const refreshMovies = () => {
	getMovies().then(() => {
		buildView();
	});
};

// Events

// On category change
genresContainer.onchange = (e: Event): void => {
	refreshMovies();
};

// On sort-by change
sortContainer.onchange = (e: Event): void => {
	refreshMovies();
};

// Load next page
loadButton.onclick = (): void => {
	if (searchBar.value) {
		page++;
		searchMovies(true).then(() => buildView(true));
	} else {
		page++;
		getMovies(true).then(() => buildView(true));
	}
};

// Searching
searchBar.oninput = () => {
	clearTimeout(typingTimer);
	if (searchBar.value) {
		typingTimer = setTimeout(searchMovies, doneTypingInterval);
	} else {
		typingTimer = setTimeout(loadPage, doneTypingInterval);
	}
};

// Initial build
loadPage();
