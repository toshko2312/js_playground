const minNumber = 1;
const maxNumber = 100;
const answer = Math.floor(
  Math.random() * (maxNumber - minNumber + 1) + minNumber
);

document.getElementById("btn").onclick = () => {
  const input = document.getElementById("numberInput");
  const result = document.getElementById("result");
  const image = document.getElementById("resultImage");

  if (isNaN(+input.value) || input.value == "") {
    result.textContent = `Please enter a valid number!`;
    input.value = "";
  } else if (document.getElementById("btn").textContent == "Try again") {
    location.reload();
  } else if (input.value > answer) {
    result.textContent = `Try guessing lower! (${input.value})`;
    image.src =
      "https://cdn.discordapp.com/emojis/624460839696597015.gif?size=160&quality=lossless";
    input.value = "";
  } else if (input.value < answer) {
    result.textContent = `Try guessing higher! (${input.value})`;
    image.src =
      "https://cdn.discordapp.com/emojis/625101593389301780.gif?size=160&quality=lossless";
    input.value = "";
  } else {
    result.textContent = `Congratulations you guessed the correct number! (${answer})`;
    image.src =
      "https://cdn.discordapp.com/emojis/643511596034949138.gif?size=160&quality=lossless";
    const btn = document.getElementById("btn");
    btn.textContent = "Try again";
  }
};
