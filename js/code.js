let taisteluRuutu = document.getElementById("taisteluRuutu");
let pelaajanPikaValikkoNumero = 1;

let pelaajanTaisteluKopio;
let vihollisenTaisteluKopio;

let vihollinen = document.getElementById("vihollinen");
vihollinen.addEventListener("click", pelaajaHyokkaa);

document.getElementById("luovutaBox").addEventListener("click", () => {
  if(pelaajanTaisteluKopio.Tiedot.Aika <= 0) return;
  pelaajanTaisteluKopio.Tiedot.Aika = 0;
  setTimeout(vihollinenHyokkaa, 800);
  document.getElementById("taisteluRuutu").classList.add("vihu");
  document.getElementById("taisteluRuutu").classList.remove("pelaaja");
  document.getElementById("vihollinenMP1").style.width = `${100}%`;
  document.getElementById("vihollinenMP2").style.width = `${100}%`;
})

taisteleVihollista("lvl0");

function pelaajaHyokkaa(e) {
  if(pelaajanTaisteluKopio.Tiedot.Aika <= 0 || pelaajanTaisteluKopio.Tiedot.HP <= 0) return;
  let valittu = pelaajanTaisteluKopio.NopeaValikko[`Valikko${pelaajanPikaValikkoNumero}`];
  if(valittu.Tyyppi == "ase") {
    pelaajanTaisteluKopio.Tiedot.Aika -= valittu.Nopeus;
    let crit = laskeCrit(valittu.CritProsentti);
    let vahinko = crit == true ? Random(valittu.MinDMG, valittu.MaxDMG) * pelaajanTaisteluKopio.Tiedot.CritKerroin : Random(valittu.MinDMG, valittu.MaxDMG);

    vihollisenTaisteluKopio.HP -= vahinko;

    for(let style = `shake${Random(0, 10)}`; 1 < 2; style = `shake${Random(0, 10)}`) { // Shake
      if(vihollinen.style.animationName !== style) {vihollinen.style.animationName = style; break;}
    }

    paivitaVisualVihu();

    document.getElementById("aikaText").textContent = `${pelaajanTaisteluKopio.Tiedot.Aika}s`;
    if(pelaajanTaisteluKopio.Tiedot.Aika < 0) document.getElementById("aikaText").textContent = `0s`;

    luoPopUpDmg(e.x, e.y, vahinko, crit);

    if(vihollisenTaisteluKopio.HP <= 0) {
      vihollinen.style.filter = "blur(10px)";
      document.getElementById("voittoRuutu").style.animationName = "voittoIkkuna";
      document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
      pelaajanTaisteluKopio.Tiedot.Aika = 0;
    } else if(pelaajanTaisteluKopio.Tiedot.Aika <= 0) {
      setTimeout(vihollinenHyokkaa, 800);
      document.getElementById("taisteluRuutu").classList.add("vihu");
      document.getElementById("taisteluRuutu").classList.remove("pelaaja");
      document.getElementById("vihollinenMP1").style.width = `${100}%`;
      document.getElementById("vihollinenMP2").style.width = `${100}%`;
    }
  }
}

function vihollinenHyokkaa() {
  let iskut = vihollisenTaisteluKopio.Iskut;
  pelaajanTaisteluKopio.Tiedot.HP -= iskut[0].DMG;
  vihollisenTaisteluKopio.Aika -= iskut[0].Nopeus;

  let aikaProsentti = vihollisenTaisteluKopio.Aika / vihollisenTaisteluKopio.MaxAika * 100;

  document.getElementById("vihollinenMP1").style.width = `${aikaProsentti > 0 ? aikaProsentti : 0}%`;
  document.getElementById("vihollinenMP2").style.width = `${aikaProsentti > 0 ? aikaProsentti : 0}%`;
  paivitaVisualPelaaja()
  let num = +document.getElementById("vihollinen").style.animationName.substring(7, 8) || 0;
  document.getElementById("vihollinen").style.animationName = `hyokkaa${Math.abs(num - 1)}`;

  for(let style = `pelaajaShake${Random(0, 1)}`; 1 < 2; style = `pelaajaShake${Random(0, 10)}`) { // Shake
    if(document.getElementById("pelaaja").style.animationName !== style) {
      document.getElementById("pelaaja").style.animationName = style; break;
    }
  }

  document.body.style.animationName = "bodyBlood";
  setTimeout(() => {document.body.style.animationName = null;},1000);

  if(pelaajanTaisteluKopio.Tiedot.HP <= 0) {
    document.getElementById("havioRuutu").style.animationName = "voittoIkkuna";
    document.getElementById("ruudunTummennus").style.animationName = "tummentuma";
  } else if(vihollisenTaisteluKopio.Aika <= 0) {
    setTimeout(() => {
      document.getElementById("taisteluRuutu").classList.add("pelaaja");
      document.getElementById("taisteluRuutu").classList.remove("vihu");
      pelaajanTaisteluKopio.Tiedot.Aika = Pelaaja.Tiedot.Aika;
      document.getElementById("aikaText").textContent = `${pelaajanTaisteluKopio.Tiedot.Aika}s`;
      vihollisenTaisteluKopio.Aika = vihollisenTaisteluKopio.MaxAika;
    }, 1000);
  } else {
    setTimeout(vihollinenHyokkaa, 1000);
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

function taisteleVihollista(nimi) {
  vihollisenTaisteluKopio = JSON.parse(JSON.stringify(Viholliset[nimi]));   // Luo Kopion Vihollisesta
  vihollisenTaisteluKopio["MaxHP"] =  Viholliset[nimi].HP || "Ei Löydy";
  vihollisenTaisteluKopio["MaxMP"] =  Viholliset[nimi].MP || "Ei Löydy";
  vihollisenTaisteluKopio["MaxAika"] =  Viholliset[nimi].Aika || "Ei Löydy";
  vihollisenTaisteluKopio["Nimi"] = nimi;
  pelaajanTaisteluKopio = JSON.parse(JSON.stringify(Pelaaja));              // Luo Kopion Pelaajasta
  pelaajanTaisteluKopio.Tiedot["MaxHP"] = pelaajanTaisteluKopio.Tiedot.HP || "Ei Löydy";

  document.getElementById("vihuKuva").src = vihollisenTaisteluKopio.Kuva || "https://steamuserimages-a.akamaihd.net/ugc/914659215888655432/82DCA20555DE13B0F76E9C833110411BC60DEB3F/";
  document.getElementById("vihuKuva").style.top = vihollisenTaisteluKopio.KuvaTop;
  document.getElementById("vihuKuva").style.left = vihollisenTaisteluKopio.KuvaLeft;
  document.getElementById("vihuKuva").style.width = vihollisenTaisteluKopio.KuvaWidth;
  document.getElementById("vihuKuva").style.height = vihollisenTaisteluKopio.KuvaHeight;
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
  taisteleVihollista(vihollisenTaisteluKopio.Nimi);
  vihollinen.style.filter = "blur(0px)";
  vihollinen.style.transition = "0s";

  document.getElementById("taisteluRuutu").classList.add("pelaaja");
  document.getElementById("taisteluRuutu").classList.remove("vihu");

  paivitaVisualVihu();
  paivitaVisualPelaaja();

  document.getElementById("ruudunTummennus").style.animationName = null;
  document.getElementById("voittoRuutu").style.animationName = null;
  document.getElementById("havioRuutu").style.animationName = null;
  setTimeout(() => {vihollinen.style.transition = null;}, 500);
}

function poistaElem(elem, aika = 0) {
  if(aika == 0) elem.remove();
  else setTimeout(() => {elem.remove()}, aika);
};

function paivitaVisualVihu() {
  let hpProsentti = vihollisenTaisteluKopio.HP / vihollisenTaisteluKopio.MaxHP * 100;
  document.getElementById("vihollinenHP1").style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
  document.getElementById("vihollinenHP2").style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
  let mpProsentti = vihollisenTaisteluKopio.MP / vihollisenTaisteluKopio.MaxMP * 100;
  document.getElementById("vihollinenMP1").style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
  document.getElementById("vihollinenMP2").style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
  document.getElementById("vihuHpText").textContent = `${vihollisenTaisteluKopio.HP}/${vihollisenTaisteluKopio.MaxHP}`;
  document.getElementById("vihuMpText").textContent = `${vihollisenTaisteluKopio.MP}/${vihollisenTaisteluKopio.MaxMP}`;
}

function paivitaVisualPelaaja() {
  document.getElementById("PelaajanHp1").style.width = `${pelaajanTaisteluKopio.Tiedot.HP > 0 ? pelaajanTaisteluKopio.Tiedot.HP / pelaajanTaisteluKopio.Tiedot.MaxHP * 100 : 0}%`;
  document.getElementById("PelaajanHp2").style.width = `${pelaajanTaisteluKopio.Tiedot.HP > 0 ? pelaajanTaisteluKopio.Tiedot.HP / pelaajanTaisteluKopio.Tiedot.MaxHP * 100 : 0}%`;
  document.getElementById("pelaajaHpText").textContent = `${pelaajanTaisteluKopio.Tiedot.HP} / ${pelaajanTaisteluKopio.Tiedot.MaxHP}`;
}

function laskeCrit(mahdollisuus) {
  if(Random(0, 100) <= mahdollisuus) return true;
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
  } document.getElementById("hotbarPopUpBg").style.display = null;
  let numero = +e.target.id.substring(4);

  document.getElementById("hotbarPopUpNimi").textContent = Pelaaja.NopeaValikko[`Valikko${numero}`].Nimi;
  document.getElementById("hotbarPopUpTyyppi2").textContent = Pelaaja.NopeaValikko[`Valikko${numero}`].TyyppiText;
  if(Pelaaja.NopeaValikko[`Valikko${numero}`].MinDMG) {
    document.getElementById("hotbarPopUpDmg2").textContent = `${Pelaaja.NopeaValikko[`Valikko${numero}`].MinDMG}-${Pelaaja.NopeaValikko[`Valikko${numero}`].MaxDMG}`;
  } else {
    document.getElementById("hotbarPopUpDmg2").textContent = "";
  }
  document.getElementById("hotbarPopUpSpeed2").textContent = `${Pelaaja.NopeaValikko[`Valikko${numero}`].Nopeus}s`;

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
  if(!e.target.id.startsWith("slot") || e.target.id.startsWith("slotBox")) return;
  let numero = +e.target.id.substring(4);
  document.getElementById(`slot${pelaajanPikaValikkoNumero}`).classList.remove("valittuSlot");
  pelaajanPikaValikkoNumero = numero;
  document.getElementById(`slot${numero}`).classList.add("valittuSlot");
}

let taisteltavat_viholliset = []
lisaa_vihollinen("lvl0");
lisaa_vihollinen("lvl0");
lisaa_vihollinen("lvl0");
function lisaa_vihollinen(nimi) {
  taisteltavat_viholliset.push(JSON.parse(JSON.stringify(Viholliset[nimi])));
  let num = taisteltavat_viholliset.length - 1;
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
      <p id = "vihu${num}_numero">${"0".repeat(6 - nimi.length)}${nimi.substring(3)}</p>
    </div>
    <div class = "vihollisen_kuva">
      <img src = "${Viholliset[nimi].Kuva}" style = "left:${Viholliset[nimi].KuvaLeft}; top:${Viholliset[nimi].KuvaTop}; width:${Viholliset[nimi].KuvaWidth}; height:${Viholliset[nimi].KuvaHeight};">
    </div>
  </div>
  `
}