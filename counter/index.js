const counter = document.getElementById("countLabel");

document.getElementById("decreaseBtn").onclick = () => {
  counter.textContent = Number(counter.textContent) - 1;
};

document.getElementById("increaseBtn").onclick = () => {
  counter.textContent = Number(counter.textContent) + 1;
};

document.getElementById("resetBtn").onclick = () => {
  counter.textContent = 0;
};
