import {
	movie,
	loadPage as loadMovieDetails,
} from "../movie-details/movie-details.js";
import { CONSTANTS } from "../../shared/constants.js";

let ratingValue: string;

loadMovieDetails.then(() => {
	const ratingContainer: HTMLDivElement = document.getElementById(
		"rate"
	)! as HTMLDivElement;
	const backgroundContainer: HTMLDivElement = document.getElementById(
		"background-visible"
	)! as HTMLDivElement;
	const popOutContainer: HTMLDivElement = document.getElementById(
		"popout-hidden"
	)! as HTMLDivElement;
	const ratingTitle: HTMLDivElement = document.getElementById(
		"rating-title"
	)! as HTMLDivElement;
	const starButtonsContainer: HTMLDivElement = document.getElementsByClassName(
		"rating"
	)[0]! as HTMLDivElement;
	const alertContainer: HTMLDivElement = document.querySelector(
		".alert"
	)! as HTMLDivElement;
	const rateButtonSubmit: HTMLButtonElement = document.getElementById(
		"rate-btn-submit"
	)! as HTMLButtonElement;
	const rateButtonDelete: HTMLButtonElement = document.getElementById(
		"rate-btn-delete"
	)! as HTMLButtonElement;

	// Setting the movie title on the rating prompt
	ratingTitle.innerHTML = `${movie.title} (${movie.release_date.slice(0, 4)})`;

	// Function to hide the rating prompt
	const hideRatingPrompt = () => {
		popOutContainer.classList.remove("popout-visible");
		backgroundContainer.classList.remove("background-blurred");
		document.body.style.overflow = "auto";
	};

	// Function to show the alert
	const showAlert = (alertType: string) => {
		const alertClass =
			alertType === "error"
				? ["alert-visible"]
				: ["alert-visible", "alert-success"];

		alertContainer.classList.add(...alertClass);
		if (alertType === "error") {
			ratingContainer.classList.add("shake");
		}

		setTimeout(() => {
			alertContainer.classList.remove("alert-visible");
			if (alertType === "error") {
				ratingContainer.classList.remove("shake");
			}
			setTimeout(() => {
				alertContainer.innerHTML = "";
			}, 1000);
		}, 4000);
	};

	// Rate button event
	ratingContainer.onclick = (e: Event) => {
		const sessionId: string | null = sessionStorage.getItem("sessionId");

		if (sessionId) {
			popOutContainer.classList.add("popout-visible");
			backgroundContainer.classList.add("background-blurred");
			document.body.style.overflow = "hidden";

			backgroundContainer.onclick = (e: Event) => {
				if (e.target == backgroundContainer) {
					hideRatingPrompt();
				}
			};

			// Get value from stars
			starButtonsContainer.onclick = (e: Event) => {
				const target: HTMLInputElement = e.target as HTMLInputElement;
				if (target.name == "star-radio") {
					if (target.checked) {
						ratingValue = target.value;
					}
				}
			};

			// Submit new rating
			rateButtonSubmit.onclick = (e: Event) => {
				if (ratingValue) {
					const options = {
						method: "POST",
						headers: {
							accept: "application/json",
							"Content-Type": "application/json;charset=utf-8",
							Authorization: CONSTANTS.API_KEY,
						},
						body: `{"value":${ratingValue}}`,
					};

					fetch(
						`${CONSTANTS.MOVIE_DETAILS_URL}${movie.id}/rating?session_id=${sessionId}`,
						options
					)
						.then(() => {
							ratingContainer.innerHTML = `${ratingValue}<span style="margin-left: 0.75vh;">Rate</span>`;
							hideRatingPrompt();
							alertContainer.innerHTML = "Rating submitted !";
							showAlert("success");
						})
						.catch((err) => console.error(err));
				}
			};

			// Delete rating
			rateButtonDelete.onclick = (e: Event) => {
				if (
					ratingContainer.innerHTML.length === 47 ||
					ratingContainer.innerHTML.length === 48
				) {
					const options = {
						method: "DELETE",
						headers: {
							accept: "application/json",
							"Content-Type": "application/json;charset=utf-8",
							Authorization: CONSTANTS.API_KEY,
						},
					};

					fetch(
						`${CONSTANTS.MOVIE_DETAILS_URL}${movie.id}/rating?session_id=${sessionId}`,
						options
					)
						.then(() => {
							ratingContainer.innerHTML = CONSTANTS.STAR_SVG;
							hideRatingPrompt();
							alertContainer.innerHTML = "Rating deleted !";
							showAlert("success");
						})
						.catch((err) => console.error(err));
				}
			};
		} else {
			alertContainer.innerHTML = "Please log in !";
			showAlert("error");
		}
	};
});
