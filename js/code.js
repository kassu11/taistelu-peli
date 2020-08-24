let taisteluRuutu = document.getElementById("taisteluRuutu");
let viholliset = document.getElementById("viholliset");
viholliset.addEventListener("click", kaytaTavaraa);

let pelaajanTaisteluKopio;
let taisteltavatViholliset = []

let valittuVihollinen = 0;
let pelaajanPikavalikkoNumero = 0;


document.getElementById("luovutaBox").addEventListener("click", () => {
  if(pelaajanTaisteluKopio.tiedot.aika <= 0) return;
  pelaajanTaisteluKopio.tiedot.aika = 0;
  setTimeout(vihollinenHyokkaa, 200);
  taisteluRuutu.classList = "vihu";
})

siirryTaisteluruutuun();
function siirryTaisteluruutuun() {
  pelaajanTaisteluKopio = clone(Pelaaja);              // Luo Kopion Pelaajasta
  pelaajanTaisteluKopio.tiedot["maxHp"] = pelaajanTaisteluKopio.tiedot.hp || "Ei Löydy";
  pelaajanTaisteluKopio.tiedot["maxMp"] = pelaajanTaisteluKopio.tiedot.mp || "Ei Löydy";

  lisaaPelaajaSlots();
  paivitaVisualPelaaja();
}

function lisaaPelaajaSlots() {
  document.getElementById("hotbar").innerHTML = `
  <div class = "slotsBox">
    <div id = "slotPopupDeley"></div>
    ${loop()}
  </div>`

  function loop() {
    let text = ``;
    for(let i = 0; i < 5; i++) {
      let tavara = pelaajanTaisteluKopio.slots[i];
      text += `
      <div id = "slot${i}" class = "slot ${i == pelaajanPikavalikkoNumero ? "valittuSlot" : ""}">
        <p class = "slotNumero">${i}</p>
        <img id = "slot${i}Kuva" class = "slotKuva" src = ${tavara.nimi ? tavara.kuva || eiKuvaa : ""}>
        <p id = "tavaraLuku${i}" class = "tavaraLuku">${tavara.maara || ""}</p>
      </div>`
    } return text;
  }
}

let animaationAloitusAika = null; // tää korjaa mielenkiintoisen animaation ajastuksen
function kaytaTavaraa(e) {
  if(taisteluRuutu.classList == "vihu") return;
  if(e) if(e.target) valittuVihollinen = etsiVihollisenNumero(e.target);
  if(pelaajanTaisteluKopio.tiedot.aika <= 0 || !tarkistaOnkoVihollinenHengissa()) return;
  let tavara = pelaajanTaisteluKopio.slots[pelaajanPikavalikkoNumero];
  let vihollinen = document.getElementById(`vihollinen${valittuVihollinen}`);
  let vahinko;
  if(tavara.minDmg || tavara.maxDmg) {
    if(vihollinen.style.animationName == "vihollinenKuolee") return;
    for(let style = `shake${Random(0, 10)}`; 1 < 2; style = `shake${Random(0, 10)}`) { // Shake
      if(vihollinen.style.animationName !== style) {vihollinen.style.animationName = style; break;}
    } vahinko = laskeVahinko(tavara, pelaajanTaisteluKopio.tiedot.critKerroin);
  }

  pelaajanTaisteluKopio.tiedot.aika -= tavara.nopeus || 0;
  pelaajanTaisteluKopio.tiedot.mp -= tavara.taika || 0;
  pelaajanTaisteluKopio.tiedot.hp += tavara.parannus || 0;
  pelaajanTaisteluKopio.tiedot.hp = Math.min(pelaajanTaisteluKopio.tiedot.hp, pelaajanTaisteluKopio.tiedot.maxHp);
  taisteltavatViholliset[valittuVihollinen].hp -= vahinko ? vahinko.vahinko : 0;

  for(let i = 0; i < taisteltavatViholliset.length; i++) {
    if(taisteltavatViholliset[i].hp <= 0) continue;
    if(taisteltavatViholliset[i].manaRegen) {
      if(pelaajanTaisteluKopio.tiedot.aika >= 0) {
        taisteltavatViholliset[i].mp += taisteltavatViholliset[i].manaRegen * tavara.nopeus || 0;
      } else taisteltavatViholliset[i].mp += taisteltavatViholliset[i].manaRegen * (pelaajanTaisteluKopio.tiedot.aika + tavara.nopeus || 0);
    } taisteltavatViholliset[i].mp = Math.min(taisteltavatViholliset[i].mp, taisteltavatViholliset[i].maxMp);
  }

  if(tavara.maara) {
    pelaajanTaisteluKopio.slots[pelaajanPikavalikkoNumero].maara -= 1;
    Pelaaja.slots[pelaajanPikavalikkoNumero].maara -= 1;
    document.getElementById(`tavaraLuku${pelaajanPikavalikkoNumero}`).textContent -= 1;
    if(tavara.maara <= 0) {
      pelaajanTaisteluKopio.slots[pelaajanPikavalikkoNumero] = ""
      Pelaaja.slots[pelaajanPikavalikkoNumero] = ""
      document.getElementById(`tavaraLuku${pelaajanPikavalikkoNumero}`).textContent = "";
      document.getElementById(`slot${pelaajanPikavalikkoNumero}Kuva`).src = "";
    }
  }

  paivitaVisuaalisestiViholliset();
  if(e) if(vahinko) luoPopUpDmg(e.x, e.y, vahinko.vahinko, vahinko.crit);
  paivitaVisualPelaaja();

  if(taisteltavatViholliset[valittuVihollinen].hp <= 0) {
    animaationAloitusAika = new Date().getTime();
    if(!tarkistaOnkoVihollinenHengissa()) {
      vihollinen.style.filter = "blur(10px)";
      document.getElementById("voittoRuutu").style.animationName = "voittoIkkuna";
      document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
      pelaajanTaisteluKopio.tiedot.aika = 0;
    } else {
      vihollinen.style.animationName = "vihollinenKuolee";
      vihollinen.style.animationDuration = "6s";
      vihollinen.style.animationTimingFunction = "ease";
      poistaElem(vihollinen, 5000);
    }
  } if(pelaajanTaisteluKopio.tiedot.aika <= 0 && tarkistaOnkoVihollinenHengissa()) {
    let aika = animaationAloitusAika - new Date().getTime() + 3500;
    setTimeout(vihollinenHyokkaa, tapettiinkoVihollinen() ? aika : 200);
    taisteluRuutu.classList = "vihu";
  }

  function etsiVihollisenNumero(val) {
    let obj = val;
    for (let i = 0; i < 6; i++) {
      if(obj.classList.contains("vihollinen")) return +obj.id.substring(10);
      if(obj.id == "viholliset") break;
      obj = obj.parentNode;
    } return valittuVihollinen;
  }

  function tapettiinkoVihollinen() {
    for(let i = 0; i < Array.from(viholliset.children).length; i++) {
      if(Array.from(viholliset.children)[i].style.animationName == "vihollinenKuolee") return true;
    }
  }

  function tarkistaOnkoVihollinenHengissa() {
    for(let tieto of taisteltavatViholliset) {
      if(tieto.hp > 0) return true
    } return false;
  }
}

function laskeVahinko(tavara, kerroin, kohde = null) {
  if(tavara == undefined) return {crit: false, vahinko: 0};
  if(!tavara.minDmg) return {crit: false, vahinko: 0};
  let crit = laskeCrit(tavara.critProsentti);
  let vahinko = crit == true ? Random(tavara.minDmg, tavara.maxDmg || tavara.minDmg) * kerroin : Random(tavara.minDmg, tavara.maxDmg || tavara.minDmg);
  return {crit, vahinko};
}

function vihollinenHyokkaa() {
  let vihu = vapaaVihollinen(taisteltavatViholliset);
  if(vihu == null) {lopetaVihollisenVuoro(); return}
  let ase = vihollisenAi(vihu);
  console.log("vihu",vihu);
  console.log("ase",ase);
  console.log(total);
  if(ase == undefined) {skippaaVihollinen(vihu); return}

  taisteltavatViholliset[vihu].aika
  let vahinko = laskeVahinko(taisteltavatViholliset[vihu].tavarat[ase], 1).vahinko || 0;
  let parannus = taisteltavatViholliset[vihu].tavarat[ase].parannus || 0;
  pelaajanTaisteluKopio.tiedot.hp -= vahinko;
  pelaajanTaisteluKopio.tiedot.mp += Math.min(taisteltavatViholliset[vihu].aika, taisteltavatViholliset[vihu].tavarat[ase].nopeus) * pelaajanTaisteluKopio.tiedot.manaRegen;
  if(pelaajanTaisteluKopio.tiedot.mp > pelaajanTaisteluKopio.tiedot.maxMp) pelaajanTaisteluKopio.tiedot.mp = pelaajanTaisteluKopio.tiedot.maxMp;
  taisteltavatViholliset[vihu].aika -= taisteltavatViholliset[vihu].tavarat[ase].nopeus;
  taisteltavatViholliset[vihu].hp += taisteltavatViholliset[vihu].tavarat[ase].parannus || 0;
  if(taisteltavatViholliset[vihu].hp > taisteltavatViholliset[vihu].maxHp) taisteltavatViholliset[vihu].hp = taisteltavatViholliset[vihu].maxHp;
  taisteltavatViholliset[vihu].mp -= taisteltavatViholliset[vihu].tavarat[ase].taika || 0;
  if(taisteltavatViholliset[vihu].tavarat[ase].maara) taisteltavatViholliset[vihu].tavarat[ase].maara -= 1;

  for(let i = 0; i < Array.from(viholliset.children).length; i++) {
    Array.from(viholliset.children)[i].classList.add("vihollinenEiValittu");
  } document.getElementById(`vihollinen${vihu}`).classList.remove("vihollinenEiValittu");

  setTimeout(() => {
    if(parannus > 0) {
      let num = +document.getElementById(`vihollinen${vihu}`).style.animationName.substring(7, 8) || 0;
      document.getElementById(`vihollinen${vihu}`).style.animationName = `paranna${Math.abs(num - 1)}`;
    }
  },  650);
  setTimeout(() => {
    paivitaVisualPelaaja()
    paivitaVisuaalisestiViholliset();
    if(!parannus > 0) {
      let num = +document.getElementById(`vihollinen${vihu}`).style.animationName.substring(7, 8) || 0;
      document.getElementById(`vihollinen${vihu}`).style.animationName = `hyokkaa${Math.abs(num - 1)}`;
      document.body.style.animationName = "bodyBlood";
    } else {
      document.body.style.animationName = "bodyHp";
    } setTimeout(() => {document.body.style.animationName = null;},700);

    if(vahinko > 0) {
      for(let style = `pelaajaShake${Random(0, 1)}`; 1 < 2; style = `pelaajaShake${Random(0, 1)}`) { // Shake
        if(document.getElementById("pelaaja").style.animationName !== style) {
          document.getElementById("pelaaja").style.animationName = style; break;
        }
      }
    } else if(parannus > 0){
      let kohde = document.getElementById(`vihollinen${vihu}`);
      let val = kohde.getBoundingClientRect();
      luoPopUpDmg(Random(val.left, val.right), Random(val.top, val.bottom), `+${parannus}`, "hp")
    }

    if(pelaajanTaisteluKopio.tiedot.hp <= 0) {
      document.getElementById("havioRuutu").style.animationName = "voittoIkkuna";
      document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
    } else if(vapaaVihollinen(taisteltavatViholliset) == null) {
      setTimeout(lopetaVihollisenVuoro, 1000)
    } else {
      setTimeout(vihollinenHyokkaa, 200);
    }
  }, 800);

  function vapaaVihollinen(tiedot) {
    for(let i = 0; i < tiedot.length; i++) {
      if(tiedot[i].aika > 0 && tiedot[i].hp > 0) return i;
    } return null
  }
};

function skippaaVihollinen(num) {
  for(let i = 0; i < Array.from(viholliset.children).length; i++) {
    Array.from(viholliset.children)[i].classList.add("vihollinenEiValittu");
  } document.getElementById(`vihollinen${num}`).classList.remove("vihollinenEiValittu");

  taisteltavatViholliset[num].aika = 0;
  setTimeout(() => luoSkippedText(num), 300);
  setTimeout(vihollinenHyokkaa, 1500);
}

function luoSkippedText(num) {
  let p = document.createElement("p");
  p.textContent = "Ei liikkeitä";
  p.classList.add("skippedTextPopup");
  document.getElementById(`vihollinen${num}`).appendChild(p);

  // poistaElem(p, 1500);
}

function lopetaVihollisenVuoro() {
  taisteluRuutu.classList = "pelaaja";
  pelaajanTaisteluKopio.tiedot.aika = Pelaaja.tiedot.aika;
  document.getElementById("aikaText").textContent = `${pelaajanTaisteluKopio.tiedot.aika}s`;
  vihollisenAikaParannus();
  for(let i = 0; i < Array.from(viholliset.children).length; i++) {
    Array.from(viholliset.children)[i].classList.remove("vihollinenEiValittu");
  }

  function vihollisenAikaParannus() {
    for(let i = 0; i < taisteltavatViholliset.length; i++) {
      if(taisteltavatViholliset[i].hp > 0) {
        taisteltavatViholliset[i].aika = taisteltavatViholliset[i].maxAika;
      }
    }
  }
}

function luoPopUpDmg(x, y, vahinko, crit) {
  let p = document.createElement("p");
  p.textContent = vahinko;
  p.classList.add("dmgPopUp");
  if(crit == "hp") p.classList.add("dmgPopupHp");
  else if(crit) p.classList.add("dmgPopUpCrit");

  document.getElementById("popUpDmg").appendChild(p);

  p.style.left = x - p.offsetWidth / 2 + "px";
  p.style.top = y - 88 + "px";
  p.style.animationName = `drop${Math.floor(Math.random() * 3)}`;
  p.style.transform = `rotate(0deg)`;
  poistaElem(p, 2000);
  setTimeout(() => {
    p.style.left = `${x + Math.floor(Math.random() * 800) - 400}px`;
    p.style.transform = `rotate(${Math.floor(Math.random() * 31) - 15}deg)`;
  }, 30);
}

window.addEventListener("keydown", pikanapit);
function pikanapit(e) {
  if(e.key <= 5 && e.key > 0) {
    document.getElementById(`slot${pelaajanPikavalikkoNumero}`).classList.remove("valittuSlot");
    pelaajanPikavalikkoNumero = +e.key - 1;
    document.getElementById(`slot${+e.key - 1}`).classList.add("valittuSlot");
  }
  if(e.keyCode == 32) {
    let taulu = Array.from(viholliset.children);
    if(valittuVihollinen == null) valittuVihollinen = Random(0, taulu.length - 1); 
    let kohde;
    if(taulu.length - 1 < valittuVihollinen) {
      kohde = taulu[Random(0, taulu.length - 1)];
    } else kohde = taulu[valittuVihollinen];
    let val = kohde.getBoundingClientRect();
    kaytaTavaraa({x: Random(val.left, val.right), y: Random(val.top, val.bottom), target: kohde});
  }
}

window.addEventListener("mousewheel", scroll)
function scroll(e) {
  if(e.deltaY < 0) {
    document.getElementById(`slot${pelaajanPikavalikkoNumero}`).classList.remove("valittuSlot");
    pelaajanPikavalikkoNumero += 1;
    if(pelaajanPikavalikkoNumero >= 5) pelaajanPikavalikkoNumero = 0;
    document.getElementById(`slot${pelaajanPikavalikkoNumero}`).classList.add("valittuSlot");
  } else {
    document.getElementById(`slot${pelaajanPikavalikkoNumero}`).classList.remove("valittuSlot");
    pelaajanPikavalikkoNumero -= 1;
    if(pelaajanPikavalikkoNumero <= 0) pelaajanPikavalikkoNumero = 4;
    document.getElementById(`slot${pelaajanPikavalikkoNumero}`).classList.add("valittuSlot");
  }
}

function reset() {
  let kopiot = clone(taisteltavatViholliset);
  viholliset.textContent = "";
  taisteltavatViholliset = [];
  for(let kopio of kopiot) {
    lisaaVihollinen(kopio.nimi);
  }
  taisteluRuutu.classList = "pelaaja";

  document.getElementById("ruudunTummennus").style.animationName = null;
  document.getElementById("voittoRuutu").style.animationName = null;
  document.getElementById("havioRuutu").style.animationName = null;

  siirryTaisteluruutuun();
  paivitaVisualPelaaja();
}

function poistaElem(elem, aika = 0) {
  if(aika == 0) elem.remove();
  else setTimeout(() => {elem.remove()}, aika);
};

function paivitaVisuaalisestiViholliset() {
  for(let i = 0; i < taisteltavatViholliset.length; i++) {
    if(!document.getElementById(`vihollinen${i}`)) continue;

    let hp = +document.getElementById(`vihu${i}HpText`).textContent.split("/")[0];
    let mp = +document.getElementById(`vihu${i}MpText`).textContent.split("/")[0];
    let hpProsentti = taisteltavatViholliset[i].hp / taisteltavatViholliset[i].maxHp * 100;
    document.getElementById(`vihollisen${i}Hp1`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
    document.getElementById(`vihollisen${i}Hp2`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
    let mpProsentti = taisteltavatViholliset[i].mp / taisteltavatViholliset[i].maxMp * 100;
    document.getElementById(`vihollisen${i}Mp1`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
    document.getElementById(`vihollisen${i}Mp2`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
    document.getElementById(`vihu${i}HpText`).textContent = `${taisteltavatViholliset[i].hp}/${taisteltavatViholliset[i].maxHp}`;
    document.getElementById(`vihu${i}MpText`).textContent = `${taisteltavatViholliset[i].mp}/${taisteltavatViholliset[i].maxMp}`;
    if(hp > +document.getElementById(`vihu${i}HpText`).textContent.split("/")[0]) {
      document.getElementById(`vihu${i}HpText`).parentNode.classList = "hpbg down";
    } else document.getElementById(`vihu${i}HpText`).parentNode.classList = "hpbg up";
    if(mp > +document.getElementById(`vihu${i}MpText`).textContent.split("/")[0]) {
      document.getElementById(`vihu${i}MpText`).parentNode.classList = "mpbg down";
    } else document.getElementById(`vihu${i}MpText`).parentNode.classList = "mpbg up";
  }
}

function paivitaVisualPelaaja() {
  let hp = +document.getElementById("pelaajaHpText").textContent.split("/")[0];
  let mp = +document.getElementById("pelaajaMpText").textContent.split("/")[0];
  document.getElementById("PelaajanHp1").style.width = `${pelaajanTaisteluKopio.tiedot.hp > 0 ? pelaajanTaisteluKopio.tiedot.hp / pelaajanTaisteluKopio.tiedot.maxHp * 100 : 0}%`;
  document.getElementById("PelaajanHp2").style.width = `${pelaajanTaisteluKopio.tiedot.hp > 0 ? pelaajanTaisteluKopio.tiedot.hp / pelaajanTaisteluKopio.tiedot.maxHp * 100 : 0}%`;
  document.getElementById("pelaajaHpText").textContent = `${pelaajanTaisteluKopio.tiedot.hp} / ${pelaajanTaisteluKopio.tiedot.maxHp}`;
  document.getElementById("PelaajanMp1").style.width = `${pelaajanTaisteluKopio.tiedot.mp > 0 ? pelaajanTaisteluKopio.tiedot.mp / pelaajanTaisteluKopio.tiedot.maxMp * 100 : 0}%`;
  document.getElementById("PelaajanMp2").style.width = `${pelaajanTaisteluKopio.tiedot.mp > 0 ? pelaajanTaisteluKopio.tiedot.mp / pelaajanTaisteluKopio.tiedot.maxMp * 100 : 0}%`;
  document.getElementById("pelaajaMpText").textContent = `${pelaajanTaisteluKopio.tiedot.mp} / ${pelaajanTaisteluKopio.tiedot.maxMp}`;
  document.getElementById("aikaText").textContent = `${pelaajanTaisteluKopio.tiedot.aika < 0 ? 0 : pelaajanTaisteluKopio.tiedot.aika}s`;
  if(hp > +document.getElementById("pelaajaHpText").textContent.split("/")[0]) {
    document.getElementById("hpBox").classList = "down"
  } else document.getElementById("hpBox").classList = "up"
  if(mp > +document.getElementById("pelaajaMpText").textContent.split("/")[0]) {
    document.getElementById("mpBox").classList = "down"
  } else document.getElementById("mpBox").classList = "up"
}

function laskeCrit(mahdollisuus) {
  if(Random(0, 100) < mahdollisuus) return true;
  return false;
}

window.addEventListener("mousemove", hotbarHover);
function hotbarHover(e) {
  if(!e.target.id.startsWith("slot") || e.target.id.startsWith("slotBox")) {
    document.getElementById("hotbarPopUpBg").style.display = "none";
    return;
  } else if(e.target.id == "slotPopupDeley" && document.getElementById("hotbarTavaraNimi").textContent == "") return; 
  document.getElementById("hotbarPopUpBg").style.display = null;

  if(e.target.id !== "slotPopupDeley") {
    document.getElementById("hotbarPopUpBg").style.animationName = null;
    let valittu = Pelaaja.slots[+e.target.id.substring(4)];
    if(!valittu.nimi) document.getElementById("hotbarPopUpBg").style.display = "none";

    document.getElementById("hotbarInfoboxSisalto").innerHTML = `
    <p id = "hotbarTavaraNimi">${valittu.nimi || ""}</p>
    <p>${valittu.tyyppiText ? "Tyyppi: " : ""}<span class = "hotbarTavaraTyyppi">${valittu.tyyppiText || ""}</span></p>
    <p>${valittu.minDmg ? "Vahinko: " : ""} <span class = "hotbarTavaraVahinko">${valittu.minDmg || ""}${valittu.maxDmg ? "-"+valittu.maxDmg : ""}</span></p>
    <p>${valittu.parannus ? "Parannus: " : ""} <span class = "hotbarTavaraVahinko">${valittu.parannus ? valittu.parannus + "hp" : ""}</span></p>
    <p>${valittu.nopeus ? "Nopeus: " : ""}<span class = "hotbarTavaraNopeus">${valittu.nopeus ? valittu.nopeus+"s" : ""}</span></p>
    <p>${valittu.taika ? "Manan kulutus: " : ""}<span class = "hotbarTavaraTaika">${valittu.taika ? valittu.taika + "m" : ""}</span></p>`
  } else document.getElementById("hotbarPopUpBg").style.animationName = "piilotaSlotPopup";

  let korkeus = document.getElementById("hotbarPopUpBg").getBoundingClientRect().height + 15;
  document.getElementById("hotbarPopUpBg").style.left = `${e.x + 25}px`;
  if(e.y - 20 < document.body.offsetHeight - korkeus) {
    document.getElementById("hotbarPopUpBg").style.top = `${e.y - 20}px`;
    document.getElementById("hotbarNuoli").style.top = null;
  } else {
    document.getElementById("hotbarPopUpBg").style.top = `${document.body.offsetHeight - korkeus}px`;
    document.getElementById("hotbarNuoli").style.top = `${Math.min(e.y - document.body.offsetHeight + korkeus - 15, korkeus - 50)}px`;
  }
}

document.getElementById("hotbar").addEventListener("click", painaHotbar);
function painaHotbar(e) {
  if(!e.target.id.startsWith("slot") || e.target.id.startsWith("slotBox") || e.target.id == "slotPopupDeley") return;
  let numero = +e.target.id.substring(4);
  document.getElementById(`slot${pelaajanPikavalikkoNumero}`).classList.remove("valittuSlot");
  pelaajanPikavalikkoNumero = numero;
  document.getElementById(`slot${numero}`).classList.add("valittuSlot");
}

let total = 0;

// lisaaVihollinen("lvl0");
// lisaaVihollinen("lvl1");
lisaaVihollinen("lvl2");

function lisaaVihollinen(nimi) {
  taisteltavatViholliset.push(clone(Viholliset[nimi]));
  let num = taisteltavatViholliset.length - 1;
  taisteltavatViholliset[num]["nimi"] = nimi;
  viholliset.innerHTML += `
  <div id = "vihollinen${num}" class = "vihollinen">
    <div class = "hpbg">
      <div id = "vihollisen${num}Hp1" class = "vihollisenHp1"></div>
      <div id = "vihollisen${num}Hp2" class = "vihollisenHp2"></div>
      <div class = "hpHohto"></div>
      <p id = "vihu${num}HpText" class = "vihuHpText">${Viholliset[nimi].hp}/${Viholliset[nimi].hp}</p>
    </div>
    <div class = "mpbg">
      <div id = "vihollisen${num}Mp1" class = "vihollisenMp1"></div>
      <div id = "vihollisen${num}Mp2" class = "vihollisenMp2"></div>
      <div class = "mpHohto"></div>
      <p id = "vihu${num}MpText" class = "vihuMpText">${Viholliset[nimi].mp}/${Viholliset[nimi].mp}</p>
    </div>
    <div class = "vihunNumeroBg">
      <p id = "vihu${num}Numero">${"0".repeat(3 - Viholliset[nimi].id.length)}${Viholliset[nimi].id}</p>
    </div>
    <div class = "vihollisenKuva">
      <img src = "${Viholliset[nimi].kuva}" style = "left:${Viholliset[nimi].kuvaLeft}; top:${Viholliset[nimi].kuvaTop}; width:${Viholliset[nimi].kuvaWidth}; height:${Viholliset[nimi].kuvaHeight};">
    </div>
  </div>`
}

function vihollisenAi(num) { // tulee palauttamaan parhaimman liikkeen
  let mp = pelaajanTaisteluKopio.tiedot.mp;
  for(let i = 0; i < taisteltavatViholliset.length; i++) {
    if(taisteltavatViholliset[i].hp <= 0) continue;
    mp += taisteltavatViholliset[i].maxAika * pelaajanTaisteluKopio.tiedot.critKerroin;
  } mp = Math.min(pelaajanTaisteluKopio.tiedot.mp, pelaajanTaisteluKopio.tiedot.maxMp);

  console.log(voikoKaikkiTappaaPelaajan())
  console.log(parasTavaraDmgYhdistelma(num))
  console.log(valitseSatunnainenTavaraV(taisteltavatViholliset[num]))
  console.log(voikoPelaajaTappaa())
  console.log(parasTavaraHpYhdistelma(num))
  console.log(pieninAikaPelaajaTarvitseeTappamaan(taisteltavatViholliset[num].hp))
  console.log(kannattaakoParantaa())
  console.log("########################################")

  if(voikoKaikkiTappaaPelaajan()) {
    return parasTavaraDmgYhdistelma(num).iskut[0];
  } else if(voikoPelaajaTappaa().parasDmg >= taisteltavatViholliset[num].hp) {
    if(kannattaakoParantaa()) {
      return parasTavaraHpYhdistelma(num).iskut[0];
    } else {
      return parasTavaraDmgYhdistelma(num).iskut[0];
    }
  } else {
    return parasTavaraDmgYhdistelma(num).iskut[0];
  }
  
  function voikoKaikkiTappaaPelaajan() {
    let vahinko = 0;
    for(let i = num; i < taisteltavatViholliset.length; i++) {
      if(taisteltavatViholliset[i].hp <= 0) continue;
      vahinko += parasTavaraDmgYhdistelma(i).parasDmg;
    } return vahinko >= pelaajanTaisteluKopio.tiedot.hp;
  }

  function kannattaakoParantaa() {
    let aika = pieninAikaPelaajaTarvitseeTappamaan(taisteltavatViholliset[num].hp).parasAika;
    let hp = parasTavaraHpYhdistelma(num).parasHp;
    hp = Math.min(taisteltavatViholliset[num].hp + hp, taisteltavatViholliset[num].maxHp);
    let aika2 = pieninAikaPelaajaTarvitseeTappamaan(hp).parasAika;
    return aika < aika2;
  }

  function pieninAikaPelaajaTarvitseeTappamaan(hp) {
    let iskut = [], parasDmg = 0, parasAika = Infinity;
    for(let i = 0; i < 200; i++) {
      let kopio = clone(pelaajanTaisteluKopio);
      let aika = Pelaaja.tiedot.aika;
      let iskut2 = [], parasDmg2 = 0, parasAika2 = 0, mp2 = mp;
      for(let u = valitseSatunnainenTavaraP(kopio, mp2); u !== undefined; u = valitseSatunnainenTavaraP(kopio, mp2)) {
        iskut2.push(u)
        parasDmg2 += laskeVahinko(kopio.slots[u], pelaajanTaisteluKopio.tiedot.critKerroin).vahinko;
        mp2 -= kopio.slots[u].taika || 0;
        aika -= kopio.slots[u].nopeus;
        parasAika2 += kopio.slots[u].nopeus;
        if(kopio.slots[u].maara) kopio.slots[u].maara -= 1;
        if(aika <= 0 || parasDmg2 >= hp) break;
      }
      if(parasAika2 <= parasAika && parasDmg2 >= hp) {
        iskut = iskut2;
        parasDmg = parasDmg2;
        parasAika = parasAika2
      }
    } return {iskut, parasDmg, parasAika};
  }

  function voikoPelaajaTappaa() {
    let iskut = [], parasDmg = 0;
    for(let i = 0; i < 1000; i++) {
      let kopio = clone(pelaajanTaisteluKopio);
      let mp2 = mp;
      let aika = Pelaaja.tiedot.aika;
      let iskut2 = [], parasDmg2 = 0;
      for(let u = valitseSatunnainenTavaraP(kopio, mp2); u !== undefined; u = valitseSatunnainenTavaraP(kopio, mp2)) {
        iskut2.push(u)
        parasDmg2 += laskeVahinko(kopio.slots[u], pelaajanTaisteluKopio.tiedot.critKerroin).vahinko;
        mp2 -= kopio.slots[u].taika || 0;
        aika -= kopio.slots[u].nopeus;

        if(kopio.slots[u].maara) kopio.slots[u].maara -= 1;
        if(aika <= 0) break;
      }
      if(parasDmg2 > parasDmg) {
        iskut = iskut2;
        parasDmg = parasDmg2;
      }
    } return {iskut, parasDmg};
  }

  function parasTavaraHpYhdistelma(vihnum) {
    let iskut = [], parasHp = 0, parasDmg = 0;
    for(let i = 0; i < 200; i++) {
      let kopio = clone(taisteltavatViholliset[vihnum]);
      let iskut2 = [], parasHp2 = 0, parasDmg2 = 0;;
      for(let u = valitseSatunnainenTavaraV(kopio); u !== undefined; u = valitseSatunnainenTavaraV(kopio)) {
        if(kopio.tavarat[u].parannus && kopio.hp + parasHp2 >= kopio.maxHp) continue;
        iskut2.push(u)
        parasHp2 += kopio.tavarat[u].parannus || 0;
        kopio.mp -= kopio.tavarat[u].taika || 0;
        kopio.aika -= kopio.tavarat[u].nopeus;
        if(kopio.tavarat[u].maara) kopio.tavarat[u].maara -= 1;
        parasDmg2 += laskeVahinko(kopio.tavarat[u], 1).vahinko;

        if(kopio.aika <= 0) break;
      }
      if((parasHp2 > parasHp) || (parasDmg2 > parasDmg && parasHp2 >= parasHp)) {
        iskut = iskut2;
        parasHp = parasHp2;
        parasDmg = parasDmg2;
      }
    }

    return {iskut, parasHp};
  }

  function valitseSatunnainenTavaraP(array, mp) { // Palauttaa tavaran index numeron, jos ei ole palauttaa null
    array = array.slots;
    let taulu = [];
    for(let i = 0; i < 5; i++) {
      if(array[i].taika > mp) continue;
      if(!array[i].nimi) continue;
      if(array[i].maara <= 0) continue;
      taulu.push(i);
    } 
    return taulu[Random(taulu.length - 1)];
  }

  function parasTavaraDmgYhdistelma(vihnum) {
    let iskut = [], parasDmg = 0;
    for(let i = 0; i < 200; i++) {
      let kopio = clone(taisteltavatViholliset[vihnum]);
      let iskut2 = [], parasDmg2 = 0;
      for(let u = valitseSatunnainenTavaraV(kopio); u !== undefined; u = valitseSatunnainenTavaraV(kopio)) {
        iskut2.push(u)
        parasDmg2 += laskeVahinko(kopio.tavarat[u], 1).vahinko;
        kopio.mp -= kopio.tavarat[u].taika || 0;
        kopio.aika -= kopio.tavarat[u].nopeus;
        if(kopio.tavarat[u].maara) kopio.tavarat[u].maara -= 1;

        if(kopio.aika <= 0) break;
      }
      if(parasDmg2 > parasDmg) {
        iskut = iskut2;
        parasDmg = parasDmg2;
      }
    }

    return {iskut, parasDmg};
  }

  function valitseSatunnainenTavaraV(array) { // Palauttaa tavaran index numeron, jos ei ole palauttaa null
    let taulu = [];
    let copy = array.tavarat
    for(let i = 0; i < copy.length; i++) {
      if(copy[i].taika) if(copy[i].taika > array.mp) continue;
      if(copy[i].maara <= 0) continue;
      taulu.push(i);
    } return taulu[Random(taulu.length - 1)];
  }
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
  } return copy;
}