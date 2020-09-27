
paivitaCraftIkkuna()
function paivitaCraftIkkuna() {
  document.getElementById("craftTavaraFlex").textContent = "";
  for(let tavara in Tavarat) {
    document.getElementById("craftTavaraFlex").innerHTML += `
      <div class = "slot">
        <img class = "slotKuva" src = ${Tavarat[tavara].nimi ? Tavarat[tavara].kuva || eiKuvaa : ""}>
        <p class = "tavaraLuku">${Tavarat[tavara].maara || ""}</p>
      </div>`
  }
}

window.addEventListener("mousemove", craftinHover);
function craftinHover(e) {
  if(!e.target.classList.contains("slot")) {
    document.getElementById("craftPopUpBg").style.display = "none";
    return;
  } else if(e.target.id == "slotPopupDeley" && document.getElementById("craftTavaraNimi").textContent == "") return; 
  document.getElementById("craftPopUpBg").style.display = null;
  if(e.target.id !== "slotPopupDeley") {
    document.getElementById("craftPopUpBg").style.animationName = null;
    let valittu = pelaajanTaisteluKopio.tavarat[1];
    if(!valittu.nimi) document.getElementById("craftPopUpBg").style.display = "none";

    document.getElementById("craftInfoboxSisalto").innerHTML = `
    <p id = "craftTavaraNimi">${valittu.nimi || ""}</p>
    <p>${valittu.tyyppiText ? "Tyyppi: " : ""}<span class = "craftTavaraTyyppi">${valittu.tyyppiText || ""}</span></p>
    <p>${valittu.minDmg ? "Vahinko: " : ""} <span class = "craftTavaraVahinko">${valittu.minDmg || ""}${valittu.maxDmg ? "-"+valittu.maxDmg : ""}</span></p>
    <p>${valittu.parannus ? "Parannus: " : ""} <span class = "craftTavaraVahinko">${valittu.parannus ? valittu.parannus + "hp" : ""}</span></p>
    <p>${valittu.nopeus ? "Nopeus: " : ""}<span class = "craftTavaraNopeus">${valittu.nopeus ? valittu.nopeus+"s" : ""}</span></p>
    <p>${valittu.taika ? "Manan kulutus: " : ""}<span class = "craftTavaraTaika">${valittu.taika ? valittu.taika + "m" : ""}</span></p>`
  } else document.getElementById("craftPopUpBg").style.animationName = "piilotaSlotPopup";

  let korkeus = document.getElementById("craftPopUpBg").getBoundingClientRect().height + 15;
  document.getElementById("craftPopUpBg").style.left = `${e.x + 25}px`;
  if(e.y - 20 < document.body.offsetHeight - korkeus) {
    document.getElementById("craftPopUpBg").style.top = `${e.y - 20}px`;
    document.getElementById("craftNuoli").style.top = null;
  } else {
    document.getElementById("craftPopUpBg").style.top = `${document.body.offsetHeight - korkeus}px`;
    document.getElementById("craftNuoli").style.top = `${Math.min(e.y - document.body.offsetHeight + korkeus - 15, korkeus - 50)}px`;
  }
}
