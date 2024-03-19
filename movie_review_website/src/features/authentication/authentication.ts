import { AUTH_CONSTANTS } from "./constants.js";
import { getId } from "../../shared/utils.js";

const profileButton: HTMLUListElement = document.getElementById(
	"profile"
)! as HTMLUListElement;

const login = (): void => {
	const btn: HTMLButtonElement = document.getElementById(
		"login/logout"
	)! as HTMLButtonElement;
	if (btn) {
		btn.onclick = async (e: Event): Promise<void> => {
			e.preventDefault();
			const requestOptions = {
				method: "GET",
				headers: {
					accept: "application/json",
					Authorization: AUTH_CONSTANTS.API_KEY,
				},
			};

			try {
				// Creating request token
				const requestToken: Response = await fetch(
					AUTH_CONSTANTS.REQUEST_TOKEN_URL,
					requestOptions
				);
				const requestTokenData = await requestToken.json();

				if (!requestToken.ok) {
					throw new Error(requestTokenData["status_message"]);
				}

				sessionStorage.setItem(
					"requestToken",
					requestTokenData["request_token"]
				);

				// Asking the user for permission
				window.location.href = `${AUTH_CONSTANTS.AUTHENTICATE_URL}${requestTokenData["request_token"]}?redirect_to=${btn.dataset.page}`;
			} catch (error) {
				console.log(error);
			}
		};
	}
};

const logout = async () => {
	const btn: HTMLElement = document.getElementById("login/logout")!;
	if (btn) {
		btn.textContent = "Logout";
		if (!sessionStorage.getItem("sessionId")) {
			try {
				// Creating a session
				const sessionOptions = {
					method: "POST",
					headers: {
						accept: "application/json",
						"content-type": "application/json",
						Authorization: AUTH_CONSTANTS.API_KEY,
					},
					body: JSON.stringify({
						request_token: sessionStorage.getItem("requestToken"),
					}),
				};

				const session: Response = await fetch(
					`${AUTH_CONSTANTS.SESSION_URL}/new`,
					sessionOptions
				);
				const sessionData = await session.json();

				if (!session.ok) {
					throw new Error(sessionData["status_message"]);
				}
				sessionStorage.setItem("sessionId", sessionData["session_id"]);
				sessionStorage.removeItem("requestToken");
				profileButton.style.display = 'list-item'
			} catch (error) {
				console.log(error);
			}
		}

		// Logging out
		if (sessionStorage.getItem("sessionId")) {
			btn.onclick = async (e: Event): Promise<void> => {
				e.preventDefault();

				if (sessionStorage.getItem("sessionId")) {
					const deleteSessionOptions = {
						method: "DELETE",
						headers: {
							accept: "application/json",
							"content-type": "application/json",
							Authorization: AUTH_CONSTANTS.API_KEY,
						},
						body: JSON.stringify({
							session_id: sessionStorage.getItem("sessionId"),
						}),
					};
					try {
						// Deleting session
						const response: Response = await fetch(
							AUTH_CONSTANTS.SESSION_URL,
							deleteSessionOptions
						);
						const responseData = await response.json();

						if (!response.ok) {
							throw new Error(responseData["status_message"]);
						}
						sessionStorage.removeItem("sessionId");
						btn.textContent = "Login";
						profileButton.style.display = 'none'
						login();
					} catch (error) {
						console.log(error);
					}
				}
			};
		} else {
			login();
		}
	}
};

const initializePage = (): void => {
	if (
		(!sessionStorage.getItem("requestToken") &&
			!sessionStorage.getItem("sessionId")) ||
		(window.location.search.endsWith("denied=true") &&
			!sessionStorage.getItem("sessionId"))
	) {
		if (window.location.search.length > 20) {
			window.history.replaceState({}, '', `${location.pathname + getId()}`)
		}
		login();
	} else if (
		window.location.search.endsWith("approved=true") ||
		sessionStorage.getItem("sessionId")
	) {
		if (window.location.search.length > 20) {
			window.history.replaceState({}, "", `${location.pathname + getId()}`);
		}
		logout();
	} else if (!sessionStorage.getItem("sessionId")) {
		if (window.location.search.length > 20) {
			window.history.replaceState({}, "", `${location.pathname + getId()}`);
		}
		login();
	}
};

initializePage();
