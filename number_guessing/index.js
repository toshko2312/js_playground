const minNumber = 1;
const maxNumber = 100;
const answer = Math.floor(
  Math.random() * (maxNumber - minNumber + 1) + minNumber
);

document.getElementById("btn").onclick = () => {
  const input = document.getElementById("numberInput");
  const result = document.getElementById("result");

  if (isNaN(+input.value) || input.value == "") {
    result.textContent = `Please enter a valid number!`;
    input.value = "";
  } else if (document.getElementById("btn").textContent == "Try again") {
    location.reload();
  } else if (input.value > answer) {
    result.textContent = `Try guessing lower! (${input.value})`;
    input.value = "";
  } else if (input.value < answer) {
    result.textContent = `Try guessing higher! (${input.value})`;
    input.value = "";
  } else {
    result.textContent = `Congratulations you guessed the correct number! (${answer})`;
    const btn = document.getElementById("btn");
    btn.textContent = "Try again";
  }
};
