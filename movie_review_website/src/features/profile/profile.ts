import { ProfileDetails, ProfileRatings } from "./interfaces";
import { CONSTANTS } from "../../shared/constants.js";
import { Genre, GenresData } from "../movie-listings/interfaces";

const currentPage: string = location.href;
const loginBtn = document.getElementById("login/logout")!;
const sessionId: string | null = sessionStorage.getItem("sessionId");
let profileDetails: ProfileDetails;
let profileRatings: ProfileRatings;
let genres: Genre[];
let page: number = 1;

loginBtn.dataset.page = currentPage;

const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: CONSTANTS.API_KEY,
	},
};

// Fetching the profile details
const getProfileDetails = async () => {
	const url: string = `${CONSTANTS.PROFILE_URL}/account_id?session_id=${sessionId}`;
	try {
		const response: Response = await fetch(url, options);
		const profileData: ProfileDetails = await response.json();

		profileDetails = profileData;
	} catch (error) {
		console.log(error);
	}
};

// Fetching the available genres from the API
const getGenres = async () => {
	try {
		const response: Response = await fetch(CONSTANTS.GENRES_URL, options);
		const genresData: GenresData = await response.json();

		genres = genresData.genres;
	} catch (error) {
		console.log(error);
	}
};

// Fetching the profile ratings
const getProfileRatings = async () => {
	const url: string = `${CONSTANTS.PROFILE_URL}/account_id/rated/movies?language=en-US&page=${page}&session_id=${sessionId}&sort_by=created_at.desc`;
	try {
		const response: Response = await fetch(url, options);
		const ratingsData: ProfileRatings = await response.json();

		profileRatings = ratingsData;
	} catch (error) {
		console.log(error);
	}
};

//Building the profile details view
const buildProfileDetails = () => {
	const profilePicture: HTMLImageElement = document.getElementById(
		"profile-picture"
	)! as HTMLImageElement;
	const profileUsername: HTMLParagraphElement = document.getElementById(
		"profile-username"
	)! as HTMLParagraphElement;
	const profileRatingCount: HTMLParagraphElement = document.getElementById(
		"profile-ratings-count"
	)! as HTMLParagraphElement;
	let imagePath: string;

	if (profileDetails.avatar.tmdb.avatar_path) {
		imagePath = `${CONSTANTS.IMAGE_URL}/${profileDetails.avatar.tmdb.avatar_path}`;
	} else {
		imagePath = "../../assets/images/default.svg.png";
	}

	profilePicture.src = imagePath;
	profileUsername.innerHTML = profileDetails.username;
	profileRatingCount.innerHTML = `${profileRatings.total_results}`;
};


// Building the profile ratings view
const buildRatings = (next_page: boolean = false) => {
	const ratingsContainer: HTMLDivElement = document.getElementById(
		"rating-cards-container"
	)! as HTMLDivElement;

	if (next_page) {
		ratingsContainer.innerHTML = "";
	}

	for (let i = 0; i < profileRatings.results.length; i++) {

		const genreId = profileRatings.results[i].genre_ids[0]
		const genreName = genres.find((obj) => obj.id === genreId)!.name

		ratingsContainer.innerHTML += `
		<div class="rating-card">
		<a class="rating-img-container" href="${CONSTANTS.MOVIE_DETAILS_APP_URL}?id=${
			profileRatings.results[i].id
		}">
			<img src="${CONSTANTS.IMAGE_URL}/${
			profileRatings.results[i].poster_path
		}" alt="movie poster">
		</a>
		<div class="rating-title-container">
		<a href="${CONSTANTS.MOVIE_DETAILS_APP_URL}?id=${profileRatings.results[i].id}">
				<p>${profileRatings.results[i].title}</p>
			</a>
		</div>
		<div class="rating-lang-container">
			<p>${profileRatings.results[i].original_language.toUpperCase()}</p>
		</div>
		<div class="rating-year-container">
			<p>${profileRatings.results[i].release_date.slice(0, 4)}</p>
		</div>
		<div class="rating-genre-container">
			<p>${genreName}</p>
		</div>
		<p>${profileRatings.results[i].rating}/10</p>
	</div>
		`;
	}
	buildPagination();
};

// Building the pagination view
const buildPagination = () => {
	const paginationContainer: HTMLDivElement = document.getElementById(
		"pagination"
	)! as HTMLDivElement;

	paginationContainer.innerHTML = "";

	// Adding prev button if there are prev pages
	if (page > 1) {
		paginationContainer.innerHTML += `<div id="prev">< prev</div>`;
	}

	// Adding prev 4 pages
	for (let i = page - 4; i < page; i++) {
		if (i > 0) {
			paginationContainer.innerHTML += `<div class="page">${i}</div>`;
		}
	}

	// Adding current page
	paginationContainer.innerHTML += `<div class="page selected">${page}</div>`;

	// Adding next 4 pages
	for (let i = page + 1; i <= page + 4; i++) {
		if (i <= profileRatings.total_pages) {
			paginationContainer.innerHTML += `<div class="page">${i}</div>`;
		}
	}

	// Adding next page button if there are more pages
	if (page < profileRatings.total_pages) {
		paginationContainer.innerHTML += `<div id="next">next ></div>`;
	}

	// Set up pagination events

	// Prev page
	const prevPage: HTMLDivElement | null = document.getElementById(
		"prev"
	) as HTMLDivElement;

	if (prevPage) {
		prevPage.onclick = (e) => {
			page = page - 1;
			getProfileRatings().then(() => buildRatings(true));
		};
	}

	// Next page
	const nextPage: HTMLDivElement | null = document.getElementById(
		"next"
	) as HTMLDivElement;

	if (nextPage) {
		nextPage.onclick = (e) => {
			page = page + 1;
			getProfileRatings().then(() => buildRatings(true));
		};
	}

	// Specific page
	paginationContainer.onclick = (e: Event) => {
		const target: HTMLDivElement = e.target as HTMLDivElement;
		if (target.classList.contains("page")) {
			page = parseInt(target.innerHTML);
			getProfileRatings().then(() => buildRatings(true));
		}
	};
};

const loadPage = () => {
	Promise.all([getProfileDetails(), getProfileRatings(), getGenres()]).then(
		() => {
			buildProfileDetails();
			buildRatings();
		}
	);
};

loadPage();
