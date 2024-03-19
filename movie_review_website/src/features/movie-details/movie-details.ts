import * as interfaces from "./interfaces";
import { CONSTANTS } from "../../shared/constants.js";
import { toHours, truncate } from "../../shared/utils.js";

export let movie: interfaces.DetailedMovie;
let reviews: interfaces.Reviews;
let alternativeTitles: interfaces.AlternativeTitles;
let similarMovies: [Partial<interfaces.DetailedMovie>];
let credits: interfaces.Credits;
let userRating: number | string;
let movieTrailer: string | undefined;
const currentPage: string = location.href;
const loginBtn = document.getElementById("login/logout")!;
const sessionId: string | null = sessionStorage.getItem("sessionId");
const movieID: string | null = new URLSearchParams(window.location.search).get(
	"id"
);
const profileButton: HTMLUListElement = document.getElementById(
	"profile"
)! as HTMLUListElement;

loginBtn.dataset.page = currentPage;

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

const getMovie = async () => {
	const url: string = `${CONSTANTS.MOVIE_DETAILS_URL}${movieID}?language=en-US`;
	try {
		const response: Response = await fetch(url, options);
		const movieData: interfaces.DetailedMovie = await response.json();

		movie = movieData;
		document.title = movie.title;
	} catch (error) {
		console.log(error);
	}
};

const getUserRating = async () => {
	if (sessionId) {
		const url: string = `${CONSTANTS.MOVIE_DETAILS_URL}${movie.id}/account_states?session_id=${sessionId}`;

		try {
			const response: Response = await fetch(url, options);
			const ratingData: interfaces.UserRating = await response.json();

			if (ratingData.rated) {
				userRating = `${ratingData.rated.value}<span style="margin-left: 0.75vh;">Rate</span>`;
			} else {
				userRating = CONSTANTS.STAR_SVG;
			}
		} catch (error) {
			console.log(error);
		}
	} else {
		userRating = CONSTANTS.STAR_SVG;
	}
};

const getMovieTrailer = async () => {
	const url: string = `${CONSTANTS.MOVIE_DETAILS_URL}${movie.id}/videos?language=en-US`;

	try {
		const response: Response = await fetch(url, options);
		const reviewsData: interfaces.Video = await response.json();

		movieTrailer = reviewsData.results
			.slice()
			.reverse()
			.find((el) => el.type == "Trailer")?.key;
	} catch (error) {
		console.log(error);
	}
};

const getReviews = async () => {
	const url: string = `${CONSTANTS.MOVIE_DETAILS_URL}${movie.id}/reviews?language=en-US&page=1`;

	try {
		const response: Response = await fetch(url, options);
		const reviewsData: interfaces.Reviews = await response.json();

		reviews = reviewsData;
	} catch (error) {
		console.log(error);
	}
};

const getAlternativeTitles = async () => {
	const url: string = `${CONSTANTS.MOVIE_DETAILS_URL}${movie.id}/alternative_titles`;

	try {
		const response: Response = await fetch(url, options);
		const alternativeTitlesData: interfaces.AlternativeTitles =
			await response.json();

		alternativeTitles = alternativeTitlesData;
	} catch (error) {
		console.log(error);
	}
};

const getSimilarMovies = async () => {
	const url: string = `${CONSTANTS.MOVIE_DETAILS_URL}${movie.id}/recommendations?language=en-US&page=1`;

	try {
		const response: Response = await fetch(url, options);
		const similarMoviesData: interfaces.SimilarMoviesData =
			await response.json();

		similarMovies = similarMoviesData.results;
	} catch (error) {
		console.log(error);
	}
};

const getCredits = async () => {
	const url: string = `${CONSTANTS.MOVIE_DETAILS_URL}${movie.id}/credits?language=en-US`;

	try {
		const response: Response = await fetch(url, options);
		const creditsData: interfaces.Credits = await response.json();

		credits = creditsData;
	} catch (error) {
		console.log(error);
	}
};

const buildMovieDetails = () => {
	const movieContainer: HTMLDivElement = document.getElementById(
		"container"
	)! as HTMLDivElement;

	movieContainer.innerHTML = `
    <div id="movie-details-container">
    <p id="movie-title">${movie.title} (${movie.release_date.slice(0, 4)})</p>
    <div id="mid-section">
			<a id="trailer-container" href="${
				CONSTANTS.TRAILER_URL
			}${movieTrailer}" target="_blank">
			<img id="image" src="https://image.tmdb.org/t/p/w780/${movie.poster_path}
      " alt="">
			<div class="light-button">
			<button class="bt">
				<div class="button-holder">
				<svg xmlns="http://www.w3.org/2000/svg" width="4em" height="1em" viewBox="0 0 256 180"><path d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/><path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/></svg>
				</div>
			</button>
			</div>
		</a>
      <div id="movie-details">
        <div id="movie-info-container">
          <div id="stats">
            <div>
              <b class="movie-info">Your rating:</b>
              <div id="rate">${userRating}</div>
            </div>
            <div>
              <b class="movie-info">Votes:</b>
              <p class="movie-info">${movie.vote_count}</p>
            </div>
            <div>
              <b class="movie-info">Reviews:</b>
              <p class="movie-info">${reviews.total_results}</p>
            </div>
          </div>
          <div id="rating-container">
            <p id="rating">${movie.vote_average.toFixed(1)}</p>
          </div>
        </div>
        <div id="overview">
          <b>Overview:</b>
          <p class="inline">${truncate(movie.overview, 900)}</p>
        </div>
				<div id="original-title">
					<b>Original title:</b>
					<p class="inline">${movie.original_title}</p>
				</div>
				<div id="alternative-title">
					<b>Alternative titles: </b>
					<p class="inline">${alternativeTitles.titles
						.map((title) => title.title)
						.splice(0, 7)
						.join(", ")}</p>
				</div>
      </div>
    </div>
    <div id="movie-footer">
      <div id="movie-footer-left">
				<div>
					<b>Country: </b>
					<p class="inline">${movie.production_countries[0].name}</p>
				</div>
				<div>
					<b>Language: </b>
					<p class="inline">${movie.spoken_languages[0].english_name}</p>
				</div>
				<div>
					<b>Duration: </b>
					<p class="inline">${toHours(movie.runtime)}</p>
				</div>
				<div id="release-date">
					<b>Release date:</b>
					<p class="inline">${movie.release_date}</p>
				</div>
				<div>
					<b>Genres:</b>
					<p class="inline">${movie.genres.map((genre) => genre.name).join(", ")}</p>
				</div>
      </div>
    </div>
  </div>
  <div id="similar-movies-container">
    <p id="similar-movies-banner">Similar Movies</p>
  </div>`;
};

const buildSimilarMovies = () => {
	const similarMoviesContainer: HTMLDivElement = document.getElementById(
		"similar-movies-container"
	)! as HTMLDivElement;

	if (similarMovies.length > 0) {
		for (let i = 0; i < similarMovies.length; i++) {
			similarMoviesContainer.innerHTML += `<div class="similar-movies-card">
    <div class="similar-movies-img-container">
      <a href="${CONSTANTS.MOVIE_DETAILS_APP_URL}?id=${similarMovies[i].id}">
        <img src="https://image.tmdb.org/t/p/w500/${
					similarMovies[i].poster_path
				}" alt="${similarMovies[i].title} poster">
      </a>
    </div>
    <div class="similar-movies-details">
      <a href="${CONSTANTS.MOVIE_DETAILS_URL}?id=${similarMovies[i].id}">
        <div>
          <b>${similarMovies[i].title}</b>
        </div>
      </a>
      <div class="similar-movies-title-container">
        <b>Rating:</b>
        <p class="inline">${similarMovies[i].vote_average?.toFixed(1)}</p>
      </div>
    </div>
    </div>`;
		}
	}
};

const buildCast = () => {
	const castContainer: HTMLDivElement = document.getElementById(
		"cast-container"
	)! as HTMLDivElement;

	for (let i = 0; i < credits.cast.length; i++) {
		let imagePath: string;

		if (credits.cast[i].profile_path) {
			imagePath = `${CONSTANTS.IMAGE_URL}/${credits.cast[i].profile_path}`;
		} else {
			imagePath = "../../assets/images/default.svg.png";
		}

		castContainer.innerHTML += `
    <div class="cast-card">
      <div class="cast-image-container">
        <img src="${imagePath}" alt="">
      </div>
      <div class="cast-details-container">
        <div>
          <b>Name:</b>
          <p class="inline">${credits.cast[i].name}</p>
        </div>
        <div>
          <b>Character:</b>
          <p class="inline">${credits.cast[i].character}</p>
        </div>
      </div>
    </div>`;
	}
};

const buildCrew = () => {
	const crewContainer: HTMLDivElement = document.getElementById(
		"crew-container"
	)! as HTMLDivElement;

	for (let i = 0; i < credits.crew.length; i++) {
		let image: string;

		if (credits.crew[i].profile_path) {
			image = `${CONSTANTS.IMAGE_URL}/${credits.crew[i].profile_path}`;
		} else {
			image = "../../assets/images/default.svg.png";
		}

		crewContainer.innerHTML += `
    <div class="cast-card">
      <div class="cast-image-container">
        <img src="${image}" alt="">
      </div>
      <div class="cast-details-container">
        <div>
          <b>Name:</b>
          <p class="inline">${credits.crew[i].name}</p>
        </div>
        <div>
          <b>Job:</b>
          <p class="inline">${credits.crew[i].job}</p>
        </div>
      </div>
    </div>`;
	}
};

const buildReviews = () => {
	const reviewContainer: HTMLDivElement = document.getElementById(
		"review-container"
	)! as HTMLDivElement;

	for (let review of reviews.results) {
		let image: string;

		if (review.author_details.avatar_path) {
			image = `${CONSTANTS.IMAGE_URL}/${review.author_details.avatar_path}`;
		} else {
			image = "../../assets/images/default.svg.png";
		}

		reviewContainer.innerHTML += `
    <div class="review-card">
      <div class="review-header">
        <div class="review-img-container">
          <img src="${image}" alt="">
        </div>
      <div class="review-info-container">
				<div>
					<b>Username:</b>
					<p class="inline">${review.author}</p>
				</div>
				<div>
					<b>Rating:</b>
					<p class="inline">${
						review.author_details.rating ? review.author_details.rating : "N/A"
					}</p>
				</div>
      </div>
      <div class="review-date-container">
        <p>${review.created_at.slice(0, 10)}</p>
      </div>
    </div>
    <div class="review-content">
      <p class="review-content">${truncate(review.content, 1220)}</p>
    </div>
  </div>`;
	}
};

export const loadPage = new Promise((res, rej) => {
	getMovie()
		.then(() =>
			Promise.all([
				getAlternativeTitles(),
				getUserRating(),
				getReviews(),
				getSimilarMovies(),
				getCredits(),
				getMovieTrailer(),
			])
		)
		.then(() =>
			Promise.all([
				buildMovieDetails(),
				buildSimilarMovies(),
				buildCast(),
				buildCrew(),
				buildReviews(),
			])
		)
		.then((data) => res(data));
});
