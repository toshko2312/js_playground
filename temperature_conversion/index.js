convert = () => {
  const textBox = document.getElementById("textBox");
  const toFahrenheit = document.getElementById("toFahrenheit");
  const toCelsius = document.getElementById("toCelsius");
  const result = document.getElementById("result");

  if (toFahrenheit.checked) {
    const temp = textBox.value * 1.8 + 32;
    result.textContent = `${temp.toFixed(1)}°F`;
  } else if (toCelsius.checked) {
    const temp = (textBox.value - 32) / 1.8;
    result.textContent = `${temp.toFixed(1)}°C`;
  } else {
    result.textContent = "Please select a unit";
  }
};
