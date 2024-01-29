document.getElementById("btn").onclick = () => {
  const input = document.getElementById("diceInput").value;
  const result = document.getElementById("diceResult");
  const resultImage = document.getElementById("diceImages");
  const values = [];
  const images = [];

  for (let i = 0; i < input; i++) {
    const number = Math.floor(Math.random() * 6) + 1;
    values.push(number);
    images.push(`<img src="dice_images/${number}.svg" alt=Dice ${number}>`);
  }
  result.textContent = `Result: ${values.join(", ")}`;
  resultImage.innerHTML = images.join("");
};
