let taistelu_Ruutu = document.getElementById("taisteluRuutu");
let viholliset = document.getElementById("viholliset");
viholliset.addEventListener("click", pelaajaHyokkaa);

let pelaajan_taistelu_kopio;
let taisteltavat_viholliset = []

let valittu_vihollinen = 0;
let pelaajan_pikavalikko_numero = 1;


document.getElementById("luovutaBox").addEventListener("click", () => {
  if(pelaajan_taistelu_kopio.tiedot.aika <= 0) return;
  pelaajan_taistelu_kopio.tiedot.aika = 0;
  setTimeout(vihollinen_hyokkaa, 200);
  taistelu_Ruutu.classList.add("vihu");
  taistelu_Ruutu.classList.remove("pelaaja");
})

siirry_taisteluruutuun();
function siirry_taisteluruutuun() {
  pelaajan_taistelu_kopio = JSON.parse(JSON.stringify(Pelaaja));              // Luo Kopion Pelaajasta
  pelaajan_taistelu_kopio.tiedot["max_hp"] = pelaajan_taistelu_kopio.tiedot.hp || "Ei Löydy";
  pelaajan_taistelu_kopio.tiedot["max_mp"] = pelaajan_taistelu_kopio.tiedot.mp || "Ei Löydy";
}

let animaation_aloitus_aika = null; // tää korjaa mielenkiintoisen animaation ajastuksen
function pelaajaHyokkaa(e) {
  if(pelaajan_taistelu_kopio.tiedot.aika <= 0 || pelaajan_taistelu_kopio.tiedot.hp <= 0) return;
  if(e.target.id == "viholliset") return;
  valittu_vihollinen = etsi_vihollisen_numero(e.target);
  if(document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationName == "vihollinen_kuolee") return;
  let valittu = pelaajan_taistelu_kopio.nopea_valikko[`valikko${pelaajan_pikavalikko_numero}`];
  if(valittu.tyyppi == "ase" || valittu.tyyppi == "taika") {
    if(valittu.tyyppi == "taika") if(pelaajan_taistelu_kopio.tiedot.mp < valittu.taika) return;
    pelaajan_taistelu_kopio.tiedot.aika -= valittu.nopeus;
    let crit = laskeCrit(valittu.crit_prosentti);
    let vahinko = crit == true ? Random(valittu.min_dmg, valittu.max_dmg || valittu.min_dmg) * pelaajan_taistelu_kopio.tiedot.crit_kerroin : Random(valittu.min_dmg, valittu.max_dmg || valittu.min_dmg);

    pelaajan_taistelu_kopio.tiedot.mp -= valittu.taika || 0;
    taisteltavat_viholliset[valittu_vihollinen].hp -= vahinko;

    for(let style = `shake${Random(0, 10)}`; 1 < 2; style = `shake${Random(0, 10)}`) { // Shake
      if(document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationName !== style) {document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationName = style; break;}
    }

    paivita_visuaalisesti_vihollinen(valittu_vihollinen);
    paivita_visual_pelaaja();
    luo_pop_up_dmg(e.x, e.y, vahinko, crit);

    if(taisteltavat_viholliset[valittu_vihollinen].hp <= 0) {
      animaation_aloitus_aika = new Date().getTime();
      if(tarkista_onko_vihollinen_hengissa(taisteltavat_viholliset) == false) {
        document.getElementById(`vihollinen${valittu_vihollinen}`).style.filter = "blur(10px)";
        document.getElementById("voittoRuutu").style.animationName = "voittoIkkuna";
        document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
        pelaajan_taistelu_kopio.tiedot.aika = 0;
      } else {
        document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationName = "vihollinen_kuolee";
        document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationDuration = "6s";
        document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationTimingFunction = "ease";
        poistaElem(document.getElementById(`vihollinen${valittu_vihollinen}`), 5000)
      }
    } if(pelaajan_taistelu_kopio.tiedot.aika <= 0 && tarkista_onko_vihollinen_hengissa(taisteltavat_viholliset) == true) {
      let aika = animaation_aloitus_aika - new Date().getTime() + 3500;
      setTimeout(vihollinen_hyokkaa, tapettiinko_vihollinen() ? aika : 200);
      taistelu_Ruutu.classList.add("vihu");
      taistelu_Ruutu.classList.remove("pelaaja");
    }
  }

  function etsi_vihollisen_numero(val) {
    let obj = val;
    for (let i = 0; i < 6; i++) {
      if(obj.classList.contains("vihollinen")) return +obj.id.substring(10);
      obj = obj.parentNode;
    }
  }

  function tarkista_onko_vihollinen_hengissa(tiedot) {
    for(let tieto of tiedot) {
      if(tieto.hp > 0) return true
    } return false;
  }

  function tapettiinko_vihollinen() {
    for(let i = 0; i < Array.from(viholliset.children).length; i++) {
      if(Array.from(viholliset.children)[i].style.animationName == "vihollinen_kuolee") return true;
    }
  }
}

function vihollinen_hyokkaa() {
  let vihu = vapaa_vihollinen(taisteltavat_viholliset);
  pelaajan_taistelu_kopio.tiedot.hp -= Random(taisteltavat_viholliset[vihu].tavarat[0].min_dmg, taisteltavat_viholliset[vihu].tavarat[0].max_dmg || taisteltavat_viholliset[vihu].tavarat[0].min_dmg);
  pelaajan_taistelu_kopio.tiedot.mp += Math.min(taisteltavat_viholliset[vihu].aika, taisteltavat_viholliset[vihu].tavarat[0].nopeus) * pelaajan_taistelu_kopio.tiedot.mana_regen;
  if(pelaajan_taistelu_kopio.tiedot.mp > pelaajan_taistelu_kopio.tiedot.max_mp) pelaajan_taistelu_kopio.tiedot.mp = pelaajan_taistelu_kopio.tiedot.max_mp;
  taisteltavat_viholliset[vihu].aika -= taisteltavat_viholliset[vihu].tavarat[0].nopeus;

  for(let i = 0; i < Array.from(viholliset.children).length; i++) {
    Array.from(viholliset.children)[i].classList.add("vihollinen_ei_valittu");
  } document.getElementById(`vihollinen${vihu}`).classList.remove("vihollinen_ei_valittu");

  setTimeout(() => {
    paivita_visual_pelaaja()
    let num = +document.getElementById(`vihollinen${vihu}`).style.animationName.substring(7, 8) || 0;
    document.getElementById(`vihollinen${vihu}`).style.animationName = `hyokkaa${Math.abs(num - 1)}`;

    for(let style = `pelaajaShake${Random(0, 1)}`; 1 < 2; style = `pelaajaShake${Random(0, 1)}`) { // Shake
      if(document.getElementById("pelaaja").style.animationName !== style) {
        document.getElementById("pelaaja").style.animationName = style; break;
      }
    }

    document.body.style.animationName = "bodyBlood";
    setTimeout(() => {document.body.style.animationName = null;},700);

    if(pelaajan_taistelu_kopio.tiedot.hp <= 0) {
      document.getElementById("havioRuutu").style.animationName = "voittoIkkuna";
      document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
    } else if(vapaa_vihollinen(taisteltavat_viholliset) == null) {
      setTimeout(() => {
        taistelu_Ruutu.classList.add("pelaaja");
        taistelu_Ruutu.classList.remove("vihu");
        pelaajan_taistelu_kopio.tiedot.aika = Pelaaja.tiedot.aika;
        document.getElementById("aikaText").textContent = `${pelaajan_taistelu_kopio.tiedot.aika}s`;
        vihollisen_aika_parannus();
        for(let i = 0; i < Array.from(viholliset.children).length; i++) {
          Array.from(viholliset.children)[i].classList.remove("vihollinen_ei_valittu");
        }
      }, 1000);
    } else {
      setTimeout(vihollinen_hyokkaa, 200);
    }
  }, 800);

  function vapaa_vihollinen(tiedot) {
    for(let i = 0; i < tiedot.length; i++) {
      if(tiedot[i].aika > 0 && tiedot[i].hp > 0) return i;
    } return null
  }

  function vihollisen_aika_parannus() {
    for(let i = 0; i < taisteltavat_viholliset.length; i++) {
      if(taisteltavat_viholliset[i].hp > 0) {
        taisteltavat_viholliset[i].aika = taisteltavat_viholliset[i].max_aika;
      }
    }
  }
};

function luo_pop_up_dmg(x, y, vahinko, crit) {
  let p = document.createElement("p");
  p.textContent = vahinko;
  p.classList.add("dmgPopUp");
  if(crit) p.classList.add("dmgPopUpCrit");

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
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.remove("valittuSlot");
    pelaajan_pikavalikko_numero = +e.key;
    document.getElementById(`slot${+e.key}`).classList.add("valittuSlot");
  }
  if(e.keyCode == 32) {
    let taulu = Array.from(viholliset.children);
    if(valittu_vihollinen == null) valittu_vihollinen = Random(0, taulu.length - 1); 
    let kohde;
    if(taulu.length - 1 < valittu_vihollinen) {
      kohde = taulu[Random(0, taulu.length - 1)];
    } else kohde = taulu[valittu_vihollinen];
    let val = kohde.getBoundingClientRect();
    pelaajaHyokkaa({x: Random(val.left, val.right), y: Random(val.top, val.bottom), target: kohde});
  }
}

window.addEventListener("mousewheel", scroll)
function scroll(e) {
  if(e.deltaY < 0) {
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.remove("valittuSlot");
    pelaajan_pikavalikko_numero += 1;
    if(pelaajan_pikavalikko_numero >= 6) pelaajan_pikavalikko_numero = 1;
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.add("valittuSlot");
  } else {
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.remove("valittuSlot");
    pelaajan_pikavalikko_numero -= 1;
    if(pelaajan_pikavalikko_numero <= 0) pelaajan_pikavalikko_numero = 5;
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.add("valittuSlot");
  }
}

function reset() {
  let kopiot = JSON.parse(JSON.stringify(taisteltavat_viholliset));
  viholliset.textContent = "";
  taisteltavat_viholliset = [];
  for(let kopio of kopiot) {
    lisaa_vihollinen(kopio.nimi);
  }
  taistelu_Ruutu.classList.add("pelaaja");
  taistelu_Ruutu.classList.remove("vihu");

  document.getElementById("ruudunTummennus").style.animationName = null;
  document.getElementById("voittoRuutu").style.animationName = null;
  document.getElementById("havioRuutu").style.animationName = null;

  siirry_taisteluruutuun();
  paivita_visual_pelaaja();
}

function poistaElem(elem, aika = 0) {
  if(aika == 0) elem.remove();
  else setTimeout(() => {elem.remove()}, aika);
};

function paivita_visuaalisesti_vihollinen(num) {
  let hpProsentti = taisteltavat_viholliset[num].hp / taisteltavat_viholliset[num].max_hp * 100;
  document.getElementById(`vihollisen${num}_hp_1`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
  document.getElementById(`vihollisen${num}_hp_2`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
  let mpProsentti = taisteltavat_viholliset[num].mp / taisteltavat_viholliset[num].max_mp * 100;
  document.getElementById(`vihollisen${num}_mp_1`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
  document.getElementById(`vihollisen${num}_mp_2`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
  document.getElementById(`vihu${num}_hp_text`).textContent = `${taisteltavat_viholliset[num].hp}/${taisteltavat_viholliset[num].max_hp}`;
  document.getElementById(`vihu${num}_mp_text`).textContent = `${taisteltavat_viholliset[num].mp}/${taisteltavat_viholliset[num].max_mp}`;
}

function paivita_visual_pelaaja() {
  document.getElementById("PelaajanHp1").style.width = `${pelaajan_taistelu_kopio.tiedot.hp > 0 ? pelaajan_taistelu_kopio.tiedot.hp / pelaajan_taistelu_kopio.tiedot.max_hp * 100 : 0}%`;
  document.getElementById("PelaajanHp2").style.width = `${pelaajan_taistelu_kopio.tiedot.hp > 0 ? pelaajan_taistelu_kopio.tiedot.hp / pelaajan_taistelu_kopio.tiedot.max_hp * 100 : 0}%`;
  document.getElementById("pelaajaHpText").textContent = `${pelaajan_taistelu_kopio.tiedot.hp} / ${pelaajan_taistelu_kopio.tiedot.max_hp}`;
  document.getElementById("PelaajanMp1").style.width = `${pelaajan_taistelu_kopio.tiedot.mp > 0 ? pelaajan_taistelu_kopio.tiedot.mp / pelaajan_taistelu_kopio.tiedot.max_mp * 100 : 0}%`;
  document.getElementById("PelaajanMp2").style.width = `${pelaajan_taistelu_kopio.tiedot.mp > 0 ? pelaajan_taistelu_kopio.tiedot.mp / pelaajan_taistelu_kopio.tiedot.max_mp * 100 : 0}%`;
  document.getElementById("pelaajaMpText").textContent = `${pelaajan_taistelu_kopio.tiedot.mp} / ${pelaajan_taistelu_kopio.tiedot.max_mp}`;
  document.getElementById("aikaText").textContent = `${pelaajan_taistelu_kopio.tiedot.aika < 0 ? 0 : pelaajan_taistelu_kopio.tiedot.aika}s`;
}

function laskeCrit(mahdollisuus) {
  if(Random(0, 100) < mahdollisuus) return true;
  return false;
}

paivitaSlots();
function paivitaSlots() {
  for(let i = 1; i <= 5; i++) {
    if(pelaajan_taistelu_kopio.nopea_valikko[`valikko${i}`].tyyppi) {
      if(pelaajan_taistelu_kopio.nopea_valikko[`valikko${i}`].kuva) {
        document.getElementById(`KuvaSlot${i}`).src = pelaajan_taistelu_kopio.nopea_valikko[`valikko${i}`].kuva;
      } else {
        document.getElementById(`KuvaSlot${i}`).src = "https://steamuserimages-a.akamaihd.net/ugc/914659215888655432/82DCA20555DE13B0F76E9C833110411BC60DEB3F/";
      }
    }
  }
}

window.addEventListener("mousemove", hotbarHover);
function hotbarHover(e) {
  if(!e.target.id.startsWith("slot") || e.target.id.startsWith("slotBox")) {
    document.getElementById("hotbarPopUpBg").style.display = "none";
    return;
  } else if(e.target.id == "slot_popup_deley" && document.getElementById("hotbar_tavara_nimi").textContent == "") return; 
  document.getElementById("hotbarPopUpBg").style.display = null;

  if(e.target.id !== "slot_popup_deley") {
    document.getElementById("hotbarPopUpBg").style.animationName = null;
    let valittu = Pelaaja.nopea_valikko[`valikko${+e.target.id.substring(4)}`];
    if(!valittu.nimi) document.getElementById("hotbarPopUpBg").style.display = "none";

    document.getElementById("hotbar_infobox_sisalto").innerHTML = `
    <p id = "hotbar_tavara_nimi">${valittu.nimi || ""}</p>
    <p>${valittu.tyyppi_text ? "Tyyppi: " : ""}<span class = "hotbar_tavara_tyyppi">${valittu.tyyppi_text || ""}</span></p>
    <p>${valittu.min_dmg ? "Vahinko: " : ""} <span class = "hotbar_tavara_vahinko">${valittu.min_dmg || ""}${valittu.max_dmg ? "-"+valittu.max_dmg : ""}</span></p>
    <p>${valittu.nopeus ? "Nopeus: " : ""}<span class = "hotbar_tavara_nopeus">${valittu.nopeus ? valittu.nopeus+"s" : ""}</span></p>
    <p>${valittu.taika ? "Manan kulutus: " : ""}<span class = "hotbar_tavara_taika">${valittu.taika ? valittu.taika + "m" : ""}</span></p>`
  } else document.getElementById("hotbarPopUpBg").style.animationName = "piilota_slot_popup";

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
  if(!e.target.id.startsWith("slot") || e.target.id.startsWith("slotBox") || e.target.id == "slot_popup_deley") return;
  let numero = +e.target.id.substring(4);
  document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.remove("valittuSlot");
  pelaajan_pikavalikko_numero = numero;
  document.getElementById(`slot${numero}`).classList.add("valittuSlot");
}

lisaa_vihollinen("lvl0");
lisaa_vihollinen("lvl1");
lisaa_vihollinen("lvl0");
function lisaa_vihollinen(nimi) {
  taisteltavat_viholliset.push(JSON.parse(JSON.stringify(Viholliset[nimi])));
  let num = taisteltavat_viholliset.length - 1;
  taisteltavat_viholliset[num]["nimi"] = nimi;
  viholliset.innerHTML += `
  <div id = "vihollinen${num}" class = "vihollinen">
    <div class = "hpbg">
      <div id = "vihollisen${num}_hp_1" class = "vihollisen_hp_1"></div>
      <div id = "vihollisen${num}_hp_2" class = "vihollisen_hp_2"></div>
      <div class = "hp_hohto"></div>
      <p id = "vihu${num}_hp_text" class = "vihu_hp_text">${Viholliset[nimi].hp}/${Viholliset[nimi].hp}</p>
    </div>
    <div class = "mpbg">
      <div id = "vihollisen${num}_mp_1" class = "vihollisen_mp_1"></div>
      <div id = "vihollisen${num}_mp_2" class = "vihollisen_mp_2"></div>
      <div class = "mp_hohto"></div>
      <p id = "vihu${num}_mp_text" class = "vihu_mp_text">${Viholliset[nimi].mp}/${Viholliset[nimi].mp}</p>
    </div>
    <div class = "vihun_numero_bg">
      <p id = "vihu${num}_numero">${"0".repeat(3 - Viholliset[nimi].id.length)}${Viholliset[nimi].id}</p>
    </div>
    <div class = "vihollisen_kuva">
      <img src = "${Viholliset[nimi].kuva}" style = "left:${Viholliset[nimi].kuva_left}; top:${Viholliset[nimi].kuva_top}; width:${Viholliset[nimi].kuva_width}; height:${Viholliset[nimi].kuva_height};">
    </div>
  </div>
  `
}