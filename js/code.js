let taistelu_Ruutu = document.getElementById("taisteluRuutu");
let viholliset = document.getElementById("viholliset");
viholliset.addEventListener("click", kayta_tavaraa);

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

  lisaa_pelaaja_slots();
  paivita_visual_pelaaja();
}

function lisaa_pelaaja_slots() {
  document.getElementById("hotbar").innerHTML = `
  <div class = "slotsBox">
    <div id = "slot_popup_deley"></div>
    ${loop()}
  </div>`

  function loop() {
    let text = ``;
    for(let i = 1; i <= 5; i++) {
      let tavara = pelaajan_taistelu_kopio.nopea_valikko[`valikko${i}`];
      text += `
      <div id = "slot${i}" class = "slot ${i == pelaajan_pikavalikko_numero ? "valittu_slot" : ""}">
        <p class = "slot_numero">${i}</p>
        <img id = "slot${i}_kuva" class = "slot_kuva" src = ${tavara.nimi ? tavara.kuva || ei_kuvaa : ""}>
        <p id = "tavara_luku${i}" class = "tavara_luku">${tavara.maara || ""}</p>
      </div>`
    } return text;
  }
}

let animaation_aloitus_aika = null; // tää korjaa mielenkiintoisen animaation ajastuksen
function kayta_tavaraa(e) {
  if(e) if(e.target) valittu_vihollinen = etsi_vihollisen_numero(e.target);
  if(pelaajan_taistelu_kopio.tiedot.aika <= 0 || !tarkista_onko_vihollinen_hengissa()) return;
  let tavara = pelaajan_taistelu_kopio.nopea_valikko[`valikko${pelaajan_pikavalikko_numero}`];
  let vihollinen = document.getElementById(`vihollinen${valittu_vihollinen}`);
  let vahinko;
  if(tavara.min_dmg || tavara.max_dmg) {
    if(vihollinen.style.animationName == "vihollinen_kuolee") return;

    for(let style = `shake${Random(0, 10)}`; 1 < 2; style = `shake${Random(0, 10)}`) { // Shake
      if(vihollinen.style.animationName !== style) {vihollinen.style.animationName = style; break;}
    }

    vahinko = laske_vahinko(tavara, pelaajan_taistelu_kopio.tiedot.crit_kerroin);
  }

  pelaajan_taistelu_kopio.tiedot.aika -= tavara.nopeus || 0;
  pelaajan_taistelu_kopio.tiedot.mp -= tavara.taika || 0;
  pelaajan_taistelu_kopio.tiedot.hp += tavara.parannus || 0;
  pelaajan_taistelu_kopio.tiedot.hp = Math.min(pelaajan_taistelu_kopio.tiedot.hp, pelaajan_taistelu_kopio.tiedot.max_hp);
  taisteltavat_viholliset[valittu_vihollinen].hp -= vahinko ? vahinko.vahinko : 0;

  if(tavara.maara) {
    pelaajan_taistelu_kopio.nopea_valikko[`valikko${pelaajan_pikavalikko_numero}`].maara -= 1;
    Pelaaja.nopea_valikko[`valikko${pelaajan_pikavalikko_numero}`].maara -= 1;
    document.getElementById(`tavara_luku${pelaajan_pikavalikko_numero}`).textContent -= 1;

    if(tavara.maara <= 0) {
      pelaajan_taistelu_kopio.nopea_valikko[`valikko${pelaajan_pikavalikko_numero}`] = ""
      Pelaaja.nopea_valikko[`valikko${pelaajan_pikavalikko_numero}`] = ""
      document.getElementById(`tavara_luku${pelaajan_pikavalikko_numero}`).textContent = "";
      document.getElementById(`slot${pelaajan_pikavalikko_numero}_kuva`).src = "";
    }
  }

  paivita_visuaalisesti_vihollinen(valittu_vihollinen);
  if(e) if(vahinko) luo_pop_up_dmg(e.x, e.y, vahinko.vahinko, vahinko.crit);
  paivita_visual_pelaaja();

  if(taisteltavat_viholliset[valittu_vihollinen].hp <= 0) {
    animaation_aloitus_aika = new Date().getTime();
    if(!tarkista_onko_vihollinen_hengissa()) {
      vihollinen.style.filter = "blur(10px)";
      document.getElementById("voittoRuutu").style.animationName = "voittoIkkuna";
      document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
      pelaajan_taistelu_kopio.tiedot.aika = 0;
    } else {
      vihollinen.style.animationName = "vihollinen_kuolee";
      vihollinen.style.animationDuration = "6s";
      vihollinen.style.animationTimingFunction = "ease";
      poistaElem(vihollinen, 5000);
    }
  } if(pelaajan_taistelu_kopio.tiedot.aika <= 0 && tarkista_onko_vihollinen_hengissa()) {
    let aika = animaation_aloitus_aika - new Date().getTime() + 3500;
    setTimeout(vihollinen_hyokkaa, tapettiinko_vihollinen() ? aika : 200);
    taistelu_Ruutu.classList.add("vihu");
    taistelu_Ruutu.classList.remove("pelaaja");
  }

  function etsi_vihollisen_numero(val) {
    let obj = val;
    for (let i = 0; i < 6; i++) {
      if(obj.classList.contains("vihollinen")) return +obj.id.substring(10);
      if(obj.id == "viholliset") break;
      obj = obj.parentNode;
    } return valittu_vihollinen;
  }

  function tapettiinko_vihollinen() {
    for(let i = 0; i < Array.from(viholliset.children).length; i++) {
      if(Array.from(viholliset.children)[i].style.animationName == "vihollinen_kuolee") return true;
    }
  }

  function tarkista_onko_vihollinen_hengissa() {
    for(let tieto of taisteltavat_viholliset) {
      if(tieto.hp > 0) return true
    } return false;
  }
}

function laske_vahinko(tavara, kerroin, kohde = null) {
  if(!tavara.min_dmg) return {crit: false, vahinko: 0};
  let crit = laskeCrit(tavara.crit_prosentti);
  let vahinko = crit == true ? Random(tavara.min_dmg, tavara.max_dmg || tavara.min_dmg) * kerroin : Random(tavara.min_dmg, tavara.max_dmg || tavara.min_dmg);
  return {crit, vahinko};
}

function vihollinen_hyokkaa() {
  let vihu = vapaa_vihollinen(taisteltavat_viholliset);
  let ase = vihollisen_ai(vihu);
  let vahinko = laske_vahinko(taisteltavat_viholliset[vihu].tavarat[ase], 1).vahinko || 0;
  let parannus = taisteltavat_viholliset[vihu].tavarat[ase].parannus || 0;
  pelaajan_taistelu_kopio.tiedot.hp -= vahinko;
  pelaajan_taistelu_kopio.tiedot.mp += Math.min(taisteltavat_viholliset[vihu].aika, taisteltavat_viholliset[vihu].tavarat[ase].nopeus) * pelaajan_taistelu_kopio.tiedot.mana_regen;
  if(pelaajan_taistelu_kopio.tiedot.mp > pelaajan_taistelu_kopio.tiedot.max_mp) pelaajan_taistelu_kopio.tiedot.mp = pelaajan_taistelu_kopio.tiedot.max_mp;
  taisteltavat_viholliset[vihu].aika -= taisteltavat_viholliset[vihu].tavarat[ase].nopeus;
  taisteltavat_viholliset[vihu].hp += taisteltavat_viholliset[vihu].tavarat[ase].parannus || 0;
  if(taisteltavat_viholliset[vihu].hp > taisteltavat_viholliset[vihu].max_hp) taisteltavat_viholliset[vihu].hp = taisteltavat_viholliset[vihu].max_hp;
  taisteltavat_viholliset[vihu].mp -= taisteltavat_viholliset[vihu].tavarat[ase].taika || 0;
  if(taisteltavat_viholliset[vihu].tavarat[ase].maara) taisteltavat_viholliset[vihu].tavarat[ase].maara -= 1;

  for(let i = 0; i < Array.from(viholliset.children).length; i++) {
    Array.from(viholliset.children)[i].classList.add("vihollinen_ei_valittu");
  } document.getElementById(`vihollinen${vihu}`).classList.remove("vihollinen_ei_valittu");

  setTimeout(() => {
    if(parannus > 0) {
      let num = +document.getElementById(`vihollinen${vihu}`).style.animationName.substring(7, 8) || 0;
      document.getElementById(`vihollinen${vihu}`).style.animationName = `paranna${Math.abs(num - 1)}`;
    }
  },  650)
  setTimeout(() => {
    paivita_visual_pelaaja()
    paivita_visuaalisesti_vihollinen(vihu);
    if(!parannus > 0) {
      let num = +document.getElementById(`vihollinen${vihu}`).style.animationName.substring(7, 8) || 0;
      document.getElementById(`vihollinen${vihu}`).style.animationName = `hyokkaa${Math.abs(num - 1)}`;
      document.body.style.animationName = "body_blood";
    } else {
      document.body.style.animationName = "body_hp";
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
      luo_pop_up_dmg(Random(val.left, val.right), Random(val.top, val.bottom), `+${parannus}`, "hp")
    }

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
  if(crit == "hp") p.classList.add("dmg_popup_hp");
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
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.remove("valittu_slot");
    pelaajan_pikavalikko_numero = +e.key;
    document.getElementById(`slot${+e.key}`).classList.add("valittu_slot");
  }
  if(e.keyCode == 32) {
    let taulu = Array.from(viholliset.children);
    if(valittu_vihollinen == null) valittu_vihollinen = Random(0, taulu.length - 1); 
    let kohde;
    if(taulu.length - 1 < valittu_vihollinen) {
      kohde = taulu[Random(0, taulu.length - 1)];
    } else kohde = taulu[valittu_vihollinen];
    let val = kohde.getBoundingClientRect();
    kayta_tavaraa({x: Random(val.left, val.right), y: Random(val.top, val.bottom), target: kohde});
  }
}

window.addEventListener("mousewheel", scroll)
function scroll(e) {
  if(e.deltaY < 0) {
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.remove("valittu_slot");
    pelaajan_pikavalikko_numero += 1;
    if(pelaajan_pikavalikko_numero >= 6) pelaajan_pikavalikko_numero = 1;
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.add("valittu_slot");
  } else {
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.remove("valittu_slot");
    pelaajan_pikavalikko_numero -= 1;
    if(pelaajan_pikavalikko_numero <= 0) pelaajan_pikavalikko_numero = 5;
    document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.add("valittu_slot");
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
  let hp = +document.getElementById(`vihu${num}_hp_text`).textContent.split("/")[0];
  let mp = +document.getElementById(`vihu${num}_mp_text`).textContent.split("/")[0];
  let hpProsentti = taisteltavat_viholliset[num].hp / taisteltavat_viholliset[num].max_hp * 100;
  document.getElementById(`vihollisen${num}_hp_1`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
  document.getElementById(`vihollisen${num}_hp_2`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
  let mpProsentti = taisteltavat_viholliset[num].mp / taisteltavat_viholliset[num].max_mp * 100;
  document.getElementById(`vihollisen${num}_mp_1`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
  document.getElementById(`vihollisen${num}_mp_2`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
  document.getElementById(`vihu${num}_hp_text`).textContent = `${taisteltavat_viholliset[num].hp}/${taisteltavat_viholliset[num].max_hp}`;
  document.getElementById(`vihu${num}_mp_text`).textContent = `${taisteltavat_viholliset[num].mp}/${taisteltavat_viholliset[num].max_mp}`;
  if(hp > +document.getElementById(`vihu${num}_hp_text`).textContent.split("/")[0]) {
    document.getElementById(`vihu${num}_hp_text`).parentNode.classList = "hpbg down";
  } else document.getElementById(`vihu${num}_hp_text`).parentNode.classList = "hpbg up";
  if(mp > +document.getElementById(`vihu${num}_mp_text`).textContent.split("/")[0]) {
    document.getElementById(`vihu${num}_mp_text`).parentNode.classList = "mpbg down";
  } else document.getElementById(`vihu${num}_mp_text`).parentNode.classList = "mpbg up";
}

function paivita_visual_pelaaja() {
  let hp = +document.getElementById("pelaajaHpText").textContent.split("/")[0];
  let mp = +document.getElementById("pelaajaMpText").textContent.split("/")[0];
  document.getElementById("PelaajanHp1").style.width = `${pelaajan_taistelu_kopio.tiedot.hp > 0 ? pelaajan_taistelu_kopio.tiedot.hp / pelaajan_taistelu_kopio.tiedot.max_hp * 100 : 0}%`;
  document.getElementById("PelaajanHp2").style.width = `${pelaajan_taistelu_kopio.tiedot.hp > 0 ? pelaajan_taistelu_kopio.tiedot.hp / pelaajan_taistelu_kopio.tiedot.max_hp * 100 : 0}%`;
  document.getElementById("pelaajaHpText").textContent = `${pelaajan_taistelu_kopio.tiedot.hp} / ${pelaajan_taistelu_kopio.tiedot.max_hp}`;
  document.getElementById("PelaajanMp1").style.width = `${pelaajan_taistelu_kopio.tiedot.mp > 0 ? pelaajan_taistelu_kopio.tiedot.mp / pelaajan_taistelu_kopio.tiedot.max_mp * 100 : 0}%`;
  document.getElementById("PelaajanMp2").style.width = `${pelaajan_taistelu_kopio.tiedot.mp > 0 ? pelaajan_taistelu_kopio.tiedot.mp / pelaajan_taistelu_kopio.tiedot.max_mp * 100 : 0}%`;
  document.getElementById("pelaajaMpText").textContent = `${pelaajan_taistelu_kopio.tiedot.mp} / ${pelaajan_taistelu_kopio.tiedot.max_mp}`;
  document.getElementById("aikaText").textContent = `${pelaajan_taistelu_kopio.tiedot.aika < 0 ? 0 : pelaajan_taistelu_kopio.tiedot.aika}s`;
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
    <p>${valittu.parannus ? "Parannus: " : ""} <span class = "hotbar_tavara_vahinko">${valittu.parannus ? valittu.parannus + "hp" : ""}</span></p>
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
  document.getElementById(`slot${pelaajan_pikavalikko_numero}`).classList.remove("valittu_slot");
  pelaajan_pikavalikko_numero = numero;
  document.getElementById(`slot${numero}`).classList.add("valittu_slot");
}

lisaa_vihollinen("lvl0");
// lisaa_vihollinen("lvl0");
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
  </div>`
}

function vihollisen_ai(num) { // tulee palauttamaan parhaimman liikkeen
  if(voiko_kaikki_tappaa_pelaajan()) {
    return paras_tavara_dmg_yhdistelma(num).iskut[0];
  } else if(voiko_pelaaja_tappaa()) {
    if(kannattaako_parantaa()) {
      return paras_tavara_hp_yhdistelma(num).iskut[0];
    } else {
      return paras_tavara_dmg_yhdistelma(num).iskut[0];
    }
  } else {
    return paras_tavara_dmg_yhdistelma(num).iskut[0];
  }
  
// console.log(voiko_kaikki_tappaa_pelaajan())
// console.log(paras_tavara_dmg_yhdistelma(num))
// console.log(valitse_satunnainen_tavara_v(taisteltavat_viholliset[num]))
// console.log(voiko_pelaaja_tappaa())
  // console.log(paras_tavara_hp_yhdistelma(num))
  // console.log(pienin_aika_pelaaja_tarvitsee_tappamaan(taisteltavat_viholliset[num]))
  // console.log(kannattaako_parantaa())
  // console.log(vihollinen_tarvitsee_parantaa)
  // console.log(voiko_parantaa)

  function voiko_kaikki_tappaa_pelaajan() {
    let vahinko = 0;
    for(let i = num; i < taisteltavat_viholliset.length; i++) {
      if(taisteltavat_viholliset[i].hp <= 0) continue;
      vahinko += paras_tavara_dmg_yhdistelma(i).paras_dmg;
    } return vahinko >= pelaajan_taistelu_kopio.tiedot.hp;
  }

  function kannattaako_parantaa() {
    let aika = pienin_aika_pelaaja_tarvitsee_tappamaan(taisteltavat_viholliset[num]).paras_aika;
    let hp = paras_tavara_hp_yhdistelma(num).paras_hp;
    let kopio = taulu_kopio(taisteltavat_viholliset[num]);
    kopio.hp += hp;
    if(kopio.hp > kopio.max_hp) kopio.hp = kopio.max_hp;
    let aika2 = pienin_aika_pelaaja_tarvitsee_tappamaan(kopio).paras_aika;
    return aika < aika2;
  }

  function pienin_aika_pelaaja_tarvitsee_tappamaan(kohde) {
    let vihu = taulu_kopio(kohde);
    let iskut = [], paras_dmg = 0, paras_aika = Infinity;
    for(let i = 0; i < 200; i++) {
      let kopio = taulu_kopio(pelaajan_taistelu_kopio);
      let iskut2 = [], paras_dmg2 = 0, paras_aika2 = 0;
      for(let u = valitse_satunnainen_tavara_p(kopio.nopea_valikko); u !== undefined; u = valitse_satunnainen_tavara_p(kopio.nopea_valikko)) {
        iskut2.push(u)
        paras_dmg2 += laske_vahinko(kopio.nopea_valikko[`valikko${u}`], 1).vahinko;
        kopio.tiedot.mp -= kopio.nopea_valikko[`valikko${u}`].taika || 0;
        kopio.tiedot.aika -= kopio.nopea_valikko[`valikko${u}`].nopeus;
        paras_aika2 += kopio.nopea_valikko[`valikko${u}`].nopeus;
        if(kopio.nopea_valikko[`valikko${u}`].maara) kopio.nopea_valikko[`valikko${u}`].maara -= 1;

        if(kopio.tiedot.aika <= 0 || paras_dmg2 >= vihu.hp) break;
      }
      if(paras_aika2 <= paras_aika && paras_dmg2 >= vihu.hp) {
        iskut = iskut2;
        paras_dmg = paras_dmg2;
        paras_aika = paras_aika2
      }
    }

    return {iskut, paras_dmg, paras_aika};
  }

  function voiko_pelaaja_tappaa() {
    let iskut = [], paras_dmg = 0;
    for(let i = 0; i < 200; i++) {
      let kopio = taulu_kopio(pelaajan_taistelu_kopio);
      let iskut2 = [], paras_dmg2 = 0;
      for(let u = valitse_satunnainen_tavara_p(kopio.nopea_valikko); u !== undefined; u = valitse_satunnainen_tavara_p(kopio.nopea_valikko)) {
        iskut2.push(u)
        paras_dmg2 += laske_vahinko(kopio.nopea_valikko[`valikko${u}`], 1).vahinko;
        kopio.tiedot.mp -= kopio.nopea_valikko[`valikko${u}`].taika || 0;
        kopio.tiedot.aika -= kopio.nopea_valikko[`valikko${u}`].nopeus;

        if(kopio.nopea_valikko[`valikko${u}`].maara) kopio.nopea_valikko[`valikko${u}`].maara -= 1;

        if(kopio.tiedot.aika <= 0) break;
      }
      if(paras_dmg2 > paras_dmg) {
        iskut = iskut2;
        paras_dmg = paras_dmg2;
      }
    }

    return {iskut, paras_dmg};
  }

  function paras_tavara_hp_yhdistelma(vihnum) {
    let iskut = [], paras_hp = 0, paras_dmg = 0;
    for(let i = 0; i < 200; i++) {
      let kopio = taulu_kopio(taisteltavat_viholliset[vihnum]);
      let iskut2 = [], paras_hp2 = 0, paras_dmg2 = 0;;
      for(let u = valitse_satunnainen_tavara_v(kopio); u !== undefined; u = valitse_satunnainen_tavara_v(kopio)) {
        if(kopio.tavarat[u].parannus && kopio.hp + paras_hp2 >= kopio.max_hp) continue;
        iskut2.push(u)
        paras_hp2 += kopio.tavarat[u].parannus || 0;
        kopio.mp -= kopio.tavarat[u].taika || 0;
        kopio.aika -= kopio.tavarat[u].nopeus;
        if(kopio.tavarat[u].maara) kopio.tavarat[u].maara -= 1;
        paras_dmg2 += laske_vahinko(kopio.tavarat[u], 1).vahinko;

        if(kopio.aika <= 0) break;
      }
      if((paras_hp2 > paras_hp) || (paras_dmg2 > paras_dmg && paras_hp2 >= paras_hp)) {
        iskut = iskut2;
        paras_hp = paras_hp2;
        paras_dmg = paras_dmg2;
      }
    }

    return {iskut, paras_hp};
  }

  function valitse_satunnainen_tavara_p(array) { // Palauttaa tavaran index numeron, jos ei ole palauttaa null
    let taulu = [];
    for(let i = 1; i <= 5; i++) {
      if(array[`valikko${i}`].taika) if(array[`valikko${i}`].taika > pelaajan_taistelu_kopio.tiedot.mp) continue;
      if(!array[`valikko${i}`].nimi) continue;
      if(array[`valikko${i}`].maara) if(array[`valikko${i}`].maara <= 0) continue;
      taulu.push(i);
    } return taulu[Random(taulu.length - 1)];
  }

  function paras_tavara_dmg_yhdistelma(vihnum) {
    let iskut = [], paras_dmg = 0;
    for(let i = 0; i < 200; i++) {
      let kopio = taulu_kopio(taisteltavat_viholliset[vihnum]);
      let iskut2 = [], paras_dmg2 = 0;
      for(let u = valitse_satunnainen_tavara_v(kopio); u !== undefined; u = valitse_satunnainen_tavara_v(kopio)) {
        iskut2.push(u)
        paras_dmg2 += laske_vahinko(kopio.tavarat[u], 1).vahinko;
        kopio.mp -= kopio.tavarat[u].taika || 0;
        kopio.aika -= kopio.tavarat[u].nopeus;
        if(kopio.tavarat[u].maara) kopio.tavarat[u].maara -= 1;

        if(kopio.aika <= 0) break;
      }
      if(paras_dmg2 > paras_dmg) {
        iskut = iskut2;
        paras_dmg = paras_dmg2;
      }
    }

    return {iskut, paras_dmg};
  }

  function valitse_satunnainen_tavara_v(array) { // Palauttaa tavaran index numeron, jos ei ole palauttaa null
    let taulu = [];
    let copy = array.tavarat
    for(let i = 0; i < copy.length; i++) {
      if(copy[i].taika) if(copy[i].taika > array.mp) continue;
      if(copy[i].maara) if(copy[i].maara <= 0) continue;
      taulu.push(i);
    } return taulu[Random(taulu.length - 1)];
  }
}

function taulu_kopio(e) {
  return JSON.parse(JSON.stringify(e));
}