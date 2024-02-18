"use strict";
const display = (document.getElementById("display"));
const appendDisplay = (input) => {
    display.value += input;
};
const clearDisplay = () => {
    display.value = "";
};
const calculate = () => {
    try {
        display.value = eval(display.value);
    }
    catch (err) {
        display.value = "Error";
    }
};
//# sourceMappingURL=index.js.map