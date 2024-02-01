const generatePassword = (length, lowercase, uppercase, numbers, symbols) => {
	let allowedChars = "";
	let password = "";

	const uppercaseChars = [...Array(26)]
		.map((val, i) => String.fromCharCode(i + 65))
		.join("");
	const lowercaseChars = uppercaseChars.toLocaleLowerCase();
	const numberChars = "0123456789";
	const symbolChars = "!@#$%^&*()_+=-";

	allowedChars += lowercase ? lowercaseChars : "";
	allowedChars += uppercase ? uppercaseChars : "";
	allowedChars += numbers ? numberChars : "";
	allowedChars += symbols ? symbolChars : "";

	if (allowedChars.length === 0) {
		return `At least one set of characters must be selected`;
	}

	while (password.length < length) {
		password += allowedChars[Math.floor(Math.random() * allowedChars.length)];
	}

	return password;
};

document.getElementById("btn").onclick = () => {
	const lowercase = document.getElementById("lowercase").checked;
	const uppercase = document.getElementById("uppercase").checked;
	const symbols = document.getElementById("symbols").checked;
	const numbers = document.getElementById("numbers").checked;
	const result = document.getElementById("result");
	const length = document.getElementById("length").value;

	password = generatePassword(length, lowercase, uppercase, numbers, symbols);

	result.textContent = password;
};
