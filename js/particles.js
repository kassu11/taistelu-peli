function playersBattleParciles({x, y} = {}, type) {
  const box = document.querySelector("#figtingScreen .effectContainer");
  const getTime = new Date().getTime();
  if(type == "explosion") {
    const img = document.createElement("img");
    img.src = "./images/giphy4.gif?" + getTime;
    img.classList = "explosion"
    img.style.left = x + "px";
    img.style.top = y + "px";
    removeElement(img, 1300);
    box.append(img);
  }
}