function AddBattleParciles({x, y, dmg} = {}, type) {
  const box = document.querySelector("#figtingScreen .effectContainer");
  if(type == "explosion") {
    const div = document.createElement("div");
    div.classList = "explosion"
    div.style.left = x + "px";
    div.style.top = y + "px";
    removeElement(div, 1300);
    box.append(div);
  } else if(type == "explosion2") {
    const div = document.createElement("div");
    div.classList = "explosion2"
    div.style.left = x + "px";
    div.style.top = y + "px";
    removeElement(div, 2000);
    box.append(div);
  } else if(type == "meleDmg" || type == "enemyMeleDmg") {
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
    if(type == "meleDmg") p.style.fontSize = random(45, 70) + "px";
    else p.style.fontSize = random(70, 100) + "px";
    setTimeout(v => {
      p.style.marginLeft = num + "px";
      p.style.transform = `translateX(-50%) rotate(${random(-20, 20)}deg)`;
    }, 20);
    removeElement(p, 2000);
  }
}