document.getElementById("mySubmit").onclick = () => {
  const subResult = document.getElementById("subResult");
  const paymentResult = document.getElementById("paymentResult");

  if (document.getElementById("myCheckBox").checked) {
    subResult.textContent = "You are subscribed";

    if (document.getElementById("visaBtn").checked) {
      paymentResult.textContent = "using Visa";
    } else if (document.getElementById("masterCardBtn").checked) {
      paymentResult.textContent = "using MasterCard";
    } else if (document.getElementById("payPalBtn").checked) {
      paymentResult.textContent = "using PayPal";
    }
  } else {
    subResult.textContent = "You are NOT subscribed";
  }
};
