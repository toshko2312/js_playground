const display: HTMLInputElement | null = <HTMLInputElement>(
	document.getElementById("display")
);

const appendDisplay = (input: string): void => {
	display.value += input;
};

const clearDisplay = (): void => {
	display.value = "";
};

const calculate = (): void => {
	try {
		display.value = eval(display.value);
	} catch (err) {
		display.value = "Error";
	}
};