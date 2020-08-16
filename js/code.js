let taisteluRuutu = document.getElementById("taisteluRuutu");
let pelaajanPikaValikkoNumero = 1;

let pelaajanTaisteluKopio;
let taisteltavat_viholliset = []

let valittu_vihollinen;

let viholliset = document.getElementById("viholliset");
viholliset.addEventListener("click", pelaajaHyokkaa);

document.getElementById("luovutaBox").addEventListener("click", () => {
  if(pelaajanTaisteluKopio.Tiedot.Aika <= 0) return;
  pelaajanTaisteluKopio.Tiedot.Aika = 0;
  setTimeout(vihollinenHyokkaa, 200);
  document.getElementById("taisteluRuutu").classList.add("vihu");
  document.getElementById("taisteluRuutu").classList.remove("pelaaja");
})

siirry_taisteluruutuun();
function siirry_taisteluruutuun() {
  pelaajanTaisteluKopio = JSON.parse(JSON.stringify(Pelaaja));              // Luo Kopion Pelaajasta
  pelaajanTaisteluKopio.Tiedot["MaxHP"] = pelaajanTaisteluKopio.Tiedot.HP || "Ei Löydy";
}

function pelaajaHyokkaa(e) {
  if(pelaajanTaisteluKopio.Tiedot.Aika <= 0 || pelaajanTaisteluKopio.Tiedot.HP <= 0) return;
  if(e.target.id == "viholliset") return;
  valittu_vihollinen = etsi_vihollisen_numero(e.target);
  if(document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationName == "vihollinen_kuolee") return;
  let valittu = pelaajanTaisteluKopio.NopeaValikko[`Valikko${pelaajanPikaValikkoNumero}`];
  if(valittu.Tyyppi == "ase") {
    pelaajanTaisteluKopio.Tiedot.Aika -= valittu.Nopeus;
    let crit = laskeCrit(valittu.CritProsentti);
    let vahinko = crit == true ? Random(valittu.MinDMG, valittu.MaxDMG || valittu.MinDMG) * pelaajanTaisteluKopio.Tiedot.CritKerroin : Random(valittu.MinDMG, valittu.MaxDMG || valittu.MinDMG);

    taisteltavat_viholliset[valittu_vihollinen].HP -= vahinko;

    for(let style = `shake${Random(0, 10)}`; 1 < 2; style = `shake${Random(0, 10)}`) { // Shake
      if(document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationName !== style) {document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationName = style; break;}
    }

    paivita_visuaalisesti_vihollinen(valittu_vihollinen);

    paivitaVisualPelaaja();

    luoPopUpDmg(e.x, e.y, vahinko, crit);

    if(taisteltavat_viholliset[valittu_vihollinen].HP <= 0) {
      if(tarkista_onko_vihollinen_hengissa(taisteltavat_viholliset) == false) {
        document.getElementById(`vihollinen${valittu_vihollinen}`).style.filter = "blur(10px)";
        document.getElementById("voittoRuutu").style.animationName = "voittoIkkuna";
        document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
        pelaajanTaisteluKopio.Tiedot.Aika = 0;
      } else {
        document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationName = "vihollinen_kuolee";
        document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationDuration = "6s";
        document.getElementById(`vihollinen${valittu_vihollinen}`).style.animationTimingFunction = "ease";
        poistaElem(document.getElementById(`vihollinen${valittu_vihollinen}`), 5000)
      }
    } if(pelaajanTaisteluKopio.Tiedot.Aika <= 0 && tarkista_onko_vihollinen_hengissa(taisteltavat_viholliset) == true) {
      setTimeout(vihollinenHyokkaa, tapettiinko_vihollinen() ? 3500 : 200);
      document.getElementById("taisteluRuutu").classList.add("vihu");
      document.getElementById("taisteluRuutu").classList.remove("pelaaja");
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
      if(tieto.HP > 0) return true
    } return false;
  }

  function tapettiinko_vihollinen() {
    for(let i = 0; i < Array.from(viholliset.children).length; i++) {
      if(Array.from(viholliset.children)[i].style.animationName == "vihollinen_kuolee") return true;
    }
  }
}

function vihollinenHyokkaa() {

  let vihu = vapaa_vihollinen(taisteltavat_viholliset);
  pelaajanTaisteluKopio.Tiedot.HP -= taisteltavat_viholliset[vihu].Iskut[0].DMG;
  taisteltavat_viholliset[vihu].Aika -= taisteltavat_viholliset[vihu].Iskut[0].Nopeus;

  for(let i = 0; i < Array.from(viholliset.children).length; i++) {
    Array.from(viholliset.children)[i].classList.add("vihollinen_ei_valittu");
  } document.getElementById(`vihollinen${vihu}`).classList.remove("vihollinen_ei_valittu");


  setTimeout(() => {
    paivitaVisualPelaaja()
    let num = +document.getElementById(`vihollinen${vihu}`).style.animationName.substring(7, 8) || 0;
    document.getElementById(`vihollinen${vihu}`).style.animationName = `hyokkaa${Math.abs(num - 1)}`;

    for(let style = `pelaajaShake${Random(0, 1)}`; 1 < 2; style = `pelaajaShake${Random(0, 1)}`) { // Shake
      if(document.getElementById("pelaaja").style.animationName !== style) {
        document.getElementById("pelaaja").style.animationName = style; break;
      }
    }

    document.body.style.animationName = "bodyBlood";
    setTimeout(() => {document.body.style.animationName = null;},700);

    if(pelaajanTaisteluKopio.Tiedot.HP <= 0) {
      document.getElementById("havioRuutu").style.animationName = "voittoIkkuna";
      document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
    } else if(vapaa_vihollinen(taisteltavat_viholliset) == null) {
      setTimeout(() => {
        document.getElementById("taisteluRuutu").classList.add("pelaaja");
        document.getElementById("taisteluRuutu").classList.remove("vihu");
        pelaajanTaisteluKopio.Tiedot.Aika = Pelaaja.Tiedot.Aika;
        document.getElementById("aikaText").textContent = `${pelaajanTaisteluKopio.Tiedot.Aika}s`;
        vihollisen_aika_parannus();
        for(let i = 0; i < Array.from(viholliset.children).length; i++) {
          Array.from(viholliset.children)[i].classList.remove("vihollinen_ei_valittu");
        }
      }, 1000);
    } else {
      setTimeout(vihollinenHyokkaa, 200);
    }

  }, 800);

  function vapaa_vihollinen(tiedot) {
    for(let i = 0; i < tiedot.length; i++) {
      if(tiedot[i].Aika > 0 && tiedot[i].HP > 0) {
        if(tiedot[i].Aika >= tiedot[i].Iskut[0].Nopeus) {
          return i;
        }
      }
    } return null
  }

  function vihollisen_aika_parannus() {
    for(let i = 0; i < taisteltavat_viholliset.length; i++) {
      if(taisteltavat_viholliset[i].HP > 0) {
        taisteltavat_viholliset[i].Aika = taisteltavat_viholliset[i].MaxAika;
      }
    }
  }
};

function luoPopUpDmg(x, y, vahinko, crit) {
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
    document.getElementById(`slot${pelaajanPikaValikkoNumero}`).classList.remove("valittuSlot");
    pelaajanPikaValikkoNumero = +e.key;
    document.getElementById(`slot${+e.key}`).classList.add("valittuSlot");
  }
  if(e.keyCode == 32) {
    let val = document.getElementById("vihollinen").getBoundingClientRect();
    pelaajaHyokkaa({x: Random(val.left, val.right), y: Random(val.top, val.bottom)});
  }
}

window.addEventListener("mousewheel", scroll)
function scroll(e) {
  if(e.deltaY < 0) {
    document.getElementById(`slot${pelaajanPikaValikkoNumero}`).classList.remove("valittuSlot");
    pelaajanPikaValikkoNumero += 1;
    if(pelaajanPikaValikkoNumero >= 6) pelaajanPikaValikkoNumero = 1;
    document.getElementById(`slot${pelaajanPikaValikkoNumero}`).classList.add("valittuSlot");
  } else {
    document.getElementById(`slot${pelaajanPikaValikkoNumero}`).classList.remove("valittuSlot");
    pelaajanPikaValikkoNumero -= 1;
    if(pelaajanPikaValikkoNumero <= 0) pelaajanPikaValikkoNumero = 5;
    document.getElementById(`slot${pelaajanPikaValikkoNumero}`).classList.add("valittuSlot");
  }
}
function reset() {
  let kopiot = JSON.parse(JSON.stringify(taisteltavat_viholliset));
  document.getElementById("viholliset").textContent = "";
  taisteltavat_viholliset = [];
  for(let kopio of kopiot) {
    lisaa_vihollinen(kopio.Nimi);
  }
  document.getElementById("taisteluRuutu").classList.add("pelaaja");
  document.getElementById("taisteluRuutu").classList.remove("vihu");

  document.getElementById("ruudunTummennus").style.animationName = null;
  document.getElementById("voittoRuutu").style.animationName = null;
  document.getElementById("havioRuutu").style.animationName = null;

  siirry_taisteluruutuun();
  paivitaVisualPelaaja();
}

function poistaElem(elem, aika = 0) {
  if(aika == 0) elem.remove();
  else setTimeout(() => {elem.remove()}, aika);
};

function paivita_visuaalisesti_vihollinen(num) {
  let hpProsentti = taisteltavat_viholliset[num].HP / taisteltavat_viholliset[num].MaxHP * 100;
  document.getElementById(`vihollisen${num}_hp_1`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
  document.getElementById(`vihollisen${num}_hp_2`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
  let mpProsentti = taisteltavat_viholliset[num].MP / taisteltavat_viholliset[num].MaxMP * 100;
  document.getElementById(`vihollisen${num}_mp_1`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
  document.getElementById(`vihollisen${num}_mp_2`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
  document.getElementById(`vihu${num}_hp_text`).textContent = `${taisteltavat_viholliset[num].HP}/${taisteltavat_viholliset[num].MaxHP}`;
  document.getElementById(`vihu${num}_mp_text`).textContent = `${taisteltavat_viholliset[num].MP}/${taisteltavat_viholliset[num].MaxMP}`;
}

function paivitaVisualPelaaja() {
  document.getElementById("PelaajanHp1").style.width = `${pelaajanTaisteluKopio.Tiedot.HP > 0 ? pelaajanTaisteluKopio.Tiedot.HP / pelaajanTaisteluKopio.Tiedot.MaxHP * 100 : 0}%`;
  document.getElementById("PelaajanHp2").style.width = `${pelaajanTaisteluKopio.Tiedot.HP > 0 ? pelaajanTaisteluKopio.Tiedot.HP / pelaajanTaisteluKopio.Tiedot.MaxHP * 100 : 0}%`;
  document.getElementById("pelaajaHpText").textContent = `${pelaajanTaisteluKopio.Tiedot.HP} / ${pelaajanTaisteluKopio.Tiedot.MaxHP}`;
  document.getElementById("aikaText").textContent = `${pelaajanTaisteluKopio.Tiedot.Aika < 0 ? 0 : pelaajanTaisteluKopio.Tiedot.Aika}s`;
}

function laskeCrit(mahdollisuus) {
  if(Random(0, 100) < mahdollisuus) return true;
  return false;
}

paivitaSlots();
function paivitaSlots() {
  for(let i = 1; i <= 5; i++) {
    if(pelaajanTaisteluKopio.NopeaValikko[`Valikko${i}`].Tyyppi) {
      if(pelaajanTaisteluKopio.NopeaValikko[`Valikko${i}`].Kuva) {
        document.getElementById(`KuvaSlot${i}`).src = pelaajanTaisteluKopio.NopeaValikko[`Valikko${i}`].Kuva;
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
    let valittu = Pelaaja.NopeaValikko[`Valikko${+e.target.id.substring(4)}`];
    if(!valittu.Nimi) document.getElementById("hotbarPopUpBg").style.display = "none";

    document.getElementById("hotbar_infobox_sisalto").innerHTML = `
    <p id = "hotbar_tavara_nimi">${valittu.Nimi || ""}</p>
    <p>${valittu.TyyppiText ? "Tyyppi: " : ""}<span class = "hotbar_tavara_tyyppi">${valittu.TyyppiText || ""}</span></p>
    <p>${valittu.MinDMG ? "Vahinko: " : ""} <span class = "hotbar_tavara_vahinko">${valittu.MinDMG || ""}${valittu.MaxDMG ? "-"+valittu.MaxDMG : ""}</span></p>
    <p>${valittu.Nopeus ? "Nopeus: " : ""}<span class = "hotbar_tavara_nopeus">${valittu.Nopeus ? valittu.Nopeus+"s" : ""}</span></p>
    <p>${valittu.Taika ? "Manan kulutus: " : ""}<span class = "hotbar_tavara_taika">${valittu.Taika ? valittu.Taika + "m" : ""}</span></p>`
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
  document.getElementById(`slot${pelaajanPikaValikkoNumero}`).classList.remove("valittuSlot");
  pelaajanPikaValikkoNumero = numero;
  document.getElementById(`slot${numero}`).classList.add("valittuSlot");
}

lisaa_vihollinen("lvl0");
lisaa_vihollinen("lvl1");
lisaa_vihollinen("lvl0");
function lisaa_vihollinen(nimi) {
  taisteltavat_viholliset.push(JSON.parse(JSON.stringify(Viholliset[nimi])));
  let num = taisteltavat_viholliset.length - 1;
  taisteltavat_viholliset[num]["Nimi"] = nimi;
  document.getElementById("viholliset").innerHTML += `
  <div id = "vihollinen${num}" class = "vihollinen">
    <div class = "hpbg">
      <div id = "vihollisen${num}_hp_1" class = "vihollisen_hp_1"></div>
      <div id = "vihollisen${num}_hp_2" class = "vihollisen_hp_2"></div>
      <div class = "hp_hohto"></div>
      <p id = "vihu${num}_hp_text" class = "vihu_hp_text">${Viholliset[nimi].HP}/${Viholliset[nimi].HP}</p>
    </div>
    <div class = "mpbg">
      <div id = "vihollisen${num}_mp_1" class = "vihollisen_mp_1"></div>
      <div id = "vihollisen${num}_mp_2" class = "vihollisen_mp_2"></div>
      <div class = "mp_hohto"></div>
      <p id = "vihu${num}_mp_text" class = "vihu_mp_text">${Viholliset[nimi].MP}/${Viholliset[nimi].MP}</p>
    </div>
    <div class = "vihun_numero_bg">
      <p id = "vihu${num}_numero">${"0".repeat(3 - Viholliset[nimi].ID.length)}${Viholliset[nimi].ID}</p>
    </div>
    <div class = "vihollisen_kuva">
      <img src = "${Viholliset[nimi].Kuva}" style = "left:${Viholliset[nimi].KuvaLeft}; top:${Viholliset[nimi].KuvaTop}; width:${Viholliset[nimi].KuvaWidth}; height:${Viholliset[nimi].KuvaHeight};">
    </div>
  </div>
  `
}