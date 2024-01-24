let username;

(() => {
  const input = document.getElementById("myInput");
  const bnt = document.getElementById("bnt");

  bnt.addEventListener("click", () => {
    username = input.value;
    input.value = "";
    console.log(username);
  });
})();
