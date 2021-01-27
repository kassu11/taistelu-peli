function playersBattleParciles({x, y, dmg} = {}, type) {
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
  } else if(type == "meleDmg") {
    if(dmg == null || dmg <= 0) return;
    const min = 100,
          max = 300;
    const p = document.createElement("p");
    box.append(p);
    const left = random(0, 1);
    const num = left ? random(-max, -min) : random(min, max);
    p.textContent = dmg;
    p.classList.add("meleDmgPopUp");
    p.style.animationName = "dmgDrop" + random(0, 2);
    p.style.left = x + "px";
    p.style.top = y - 60 + "px";
    p.style.fontSize = random(45, 70) + "px";
    setTimeout(v => {
      p.style.marginLeft = num + "px";
      p.style.transform = `translateX(-50%) rotate(${random(-20, 20)}deg)`;
    }, 20);
    // removeElement(p, 2000);
  }
}