$("viholliset").addEventListener("click", e => { // Käsittelee clickin viholliseen ja palauttaa xy ja num
  if(e.target.id == "viholliset" || pelaaja.aika <= 0) return;
  let kohde = e.target
  for(let i = 0; i < 10; i++) {
    if(kohde.classList.contains("vihollinen")) break;
    else kohde = kohde.parentNode;
  } pelaajaHyokkaa(e, +kohde.id.substring(10));
});

let viimeksiTapettuVihollinenAika = null;
function pelaajaHyokkaa(e, num) {
  let valittu = pelaaja.hotbarItems[`slot${pelaajanAseNum}`];
  if(!valittu.nopeus || valittu.nopeus < 1) return;
  if(valittu.taika > pelaaja.laskeMp()) return;
  if(taisteltavatViholliset[num].hp <= 0) return;
  let shakeNum = $(`vihollinen${num}`).style.animationName.substring(5) || 5;
  $(`vihollinen${num}`).style.animationName = `shake${(+shakeNum + random(1, 9)) % 10}`;
  let dmg = valittu.laskeDmg();

  pelaaja.aika -= valittu.nopeus;

  if(dmg.dmg >= 0) {
    taisteltavatViholliset[num].hp -= dmg.dmg;
    luoPopUpDmg(e.x, e.y, dmg.dmg, dmg.crit);
  }

  pelaaja.paivitaStatusEfektit(valittu.nopeus);
  if(valittu.taika) pelaaja.mp = pelaaja.laskeMp() - valittu.taika;
  
  valittu.annaKaEfektit();
  if(valittu.parannus) {
    pelaaja.hp = Math.min((pelaaja.laskeHp() + valittu.parannus), pelaaja.laskeMaxHp());
    luoPopUpDmg(e.x, e.y, valittu.parannus, "hp");
  } if(valittu.parannusProsentti) {
    pelaaja.hp += Math.ceil(pelaaja.laskeMaxHp() * valittu.parannusProsentti);
    if(pelaaja.hp > pelaaja.laskeMaxHp()) pelaaja.hp = pelaaja.laskeMaxHp();
    luoPopUpDmg(e.x, e.y, valittu.parannus, "hp");
  }
  
  if(valittu.maara) {
    valittu.maara -= 1;
    $(`tavaraLuku${pelaajanAseNum}`).textContent = valittu.maara;
    if(valittu.maara <= 0) {
      pelaaja.hotbarItems[`slot${pelaajanAseNum}`] = {};
      paivitaPelaajanHotbar();
    }
  }
  paivitaVisuaalisestiViholliset(); paivitaVisuaalisestiPelaaja();
  if(pelaaja.aika <= 0) setTimeout(vihollisenVuoro, Math.max(200, (3500 - (new Date() - viimeksiTapettuVihollinenAika))));
}

window.addEventListener("keydown", e => {
  if(e.key < 6 && e.key > 0) {
    $(`slot${pelaajanAseNum}`).classList.remove("valittuSlot");
    pelaajanAseNum = e.key - 1;
    $(`slot${pelaajanAseNum}`).classList.add("valittuSlot");
  };
})

function luoPopUpDmg(x, y, text, crit) {
  let p = $e("p");
  p.textContent = text;
  p.classList.add("dmgPopUp");
  if(crit == "hp") p.classList.add("dmgPopupHp");
  else if(crit) p.classList.add("dmgPopUpCrit");

  $("popUpDmg").appendChild(p);

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

$("hotbar").addEventListener("click", e => {
  let kohde = e.target;
  if(kohde.id == "hotbar" || kohde.classList.contains("slotsBox") || kohde.classList.contains("valittuSlot")) return;
  let num = +kohde.id.substring(4);
  $(`slot${pelaajanAseNum}`).classList.remove("valittuSlot");
  $(`slot${num}`).classList.add("valittuSlot");
  pelaajanAseNum = num;
});

function paivitaPelaajanHotbar() {
  $("hotbar").innerHTML = `
  <div class = "slotsBox">
    ${slots()}
  </div>`;

  function slots() {
    let text = ``;
    for(let i = 0; i < 5; i++) {
      let tavara = pelaaja.hotbarItems[`slot${i}`];
      text += `<div id = "slot${i}" class = "slot ${i == pelaajanAseNum ? "valittuSlot" : ""}">
        <p class = "slotNumero">${i + 1}</p>
        <img id = "slot${i}Kuva" class = "slotKuva" src = ${tavara ? tavara.kuva || "" : ""}>
        <p id = "tavaraLuku${i}" class = "tavaraLuku">${tavara ? tavara.maara || "": ""}</p>
      </div>`
    } return text;
  };
  for(let i = 0; i < 5; i++) {
    if(pelaaja?.hotbarItems[`slot${i}`]?.nimi) {
      let valittu = pelaaja.hotbarItems[`slot${i}`];
      let text = `<c>$p.style.fontSize = '15px'<c> §$pelaaja.hotbarItems["slot${i}"].nimi<fs>20px<fs><br><c>#f00<c><css> font-weight:600 <css>`
      if(valittu.tyyppiText) text += `§Tyyppi: §$pelaaja.hotbarItems["slot${i}"].tyyppiText<br><c>#f90<c> <css> font-weight:600 <css>`;
      if(valittu.minDmg) text += `§Vahinko: §$pelaaja.hotbarItems["slot${i}"].minMaxDmgText()<c>#ffe000<c><br> <css> font-weight:600 <css>`;
      if(valittu.parannus) text += `§Parannus: §$pelaaja.hotbarItems["slot${i}"].parannus!$<c>#ffe000<c>hp <br> <css> font-weight:600 <css>`;
      if(valittu.parannusProsentti) text += `§Parannus: §$Math.floor(pelaaja.hotbarItems["slot${i}"].parannusProsentti * 100)!$<c>#ffe000<c>% <br> <css> font-weight:600 <css>`;
      if(valittu.nopeus) text += `§Nopeus: §$pelaaja.hotbarItems["slot${i}"].nopeus!$s<br><c>#41ee36<c> <css> font-weight:600 <css>`;
      if(valittu.taika) text += `§Manan kulutus: §$pelaaja.hotbarItems["slot${i}"].taika!$m<br><c>#2eb3e0<c> <css> font-weight:600 <css>`;
      if(valittu.kaEfektit) {
        text += "§<br>§Lisätietoja <fs>16px<fs> <br>§"
        if(valittu.kaEfektit.buffs) valittu.kaEfektit.buffs.forEach((v, i2) => {
          if(v.dmgKerroin) text += `§ <c>#57ff6d<c> <fs>11px<fs> ▲ § Nostaa §$pelaaja.hotbarItems["slot${i}"].kaEfektit.buffs[${i2}].pituus!$s <c>#57ff6d<c> <css>font-weight:700<css> § vahinkoa §$Math.ceil(pelaaja.hotbarItems["slot${i}"].kaEfektit.buffs[${i2}].dmgKerroin * 100)!$% <c>#57ff6d<c> <css>font-weight:700<css> <br>`;
          if(v.hpKerroin) text += `§ <c>#57ff6d<c> <fs>11px<fs> ▲ § Nostaa §$pelaaja.hotbarItems["slot${i}"].kaEfektit.buffs[${i2}].pituus!$s <c>#57ff6d<c> <css>font-weight:700<css> § maksimi hp §$Math.ceil(pelaaja.hotbarItems["slot${i}"].kaEfektit.buffs[${i2}].hpKerroin * 100)!$% <c>#57ff6d<c> <css>font-weight:700<css> <br>`;
        });
        if(valittu.kaEfektit.nerfs) valittu.kaEfektit.nerfs.forEach((v, i2) => {
          if(v.dmgKerroin) text += `§ <c>#ff5757<c> <fs>11px<fs> ▼ § Laskee §$pelaaja.hotbarItems["slot${i}"].kaEfektit.nerfs[${i2}].pituus!$s <c>#ff5757<c> <css>font-weight:700<css> § vahinkoa §$Math.ceil(pelaaja.hotbarItems["slot${i}"].kaEfektit.nerfs[${i2}].dmgKerroin * 100)!$% <c>#ff5757<c> <css>font-weight:700<css> <br>`;
          if(v.hpKerroin) text += `§ <c>#ff5757<c> <fs>11px<fs> ▼ § Laskee §$pelaaja.hotbarItems["slot${i}"].kaEfektit.nerfs[${i2}].pituus!$s <c>#ff5757<c> <css>font-weight:700<css> § maksimi hp §$Math.ceil(pelaaja.hotbarItems["slot${i}"].kaEfektit.nerfs[${i2}].hpKerroin * 100)!$% <c>#ff5757<c> <css>font-weight:700<css> <br>`;
        });
      };
      luoGlobalHover(`slot${i}`, [text]);
    }
  }
};

function paivitaVisuaalisestiViholliset() {
  taisteltavatViholliset.forEach((vihu, i) => {
    if(!$(`vihollinen${i}`)) return;

    let hp = +$(`vihu${i}HpText`).textContent.split("/")[0];
    let mp = +$(`vihu${i}MpText`).textContent.split("/")[0];
    let hpProsentti = vihu.hp / vihu.maxHp * 100;
    $(`vihollisen${i}Hp1`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
    $(`vihollisen${i}Hp2`).style.width = `${hpProsentti > 0 ? hpProsentti : 0}%`;
    let mpProsentti = vihu.mp / vihu.maxMp * 100;
    $(`vihollisen${i}Mp1`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
    $(`vihollisen${i}Mp2`).style.width = `${mpProsentti > 0 ? mpProsentti : 0}%`;
    $(`vihu${i}HpText`).textContent = `${vihu.hp}/${vihu.maxHp}`;
    $(`vihu${i}MpText`).textContent = `${vihu.mp}/${vihu.maxMp}`;
    if(hp > +$(`vihu${i}HpText`).textContent.split("/")[0]) {
      $(`vihu${i}HpText`).parentNode.classList = "hpbg down";
    } else $(`vihu${i}HpText`).parentNode.classList = "hpbg up";
    if(mp > +$(`vihu${i}MpText`).textContent.split("/")[0]) {
      $(`vihu${i}MpText`).parentNode.classList = "mpbg down";
    } else $(`vihu${i}MpText`).parentNode.classList = "mpbg up";

    if(vihu.hp <= 0 && $(`vihollinen${i}`).style.animationName !== "vihollinenKuolee") {
      $(`vihollinen${i}`).style.animationDuration = "6s";
      $(`vihollinen${i}`).style.animationName = "vihollinenKuolee";
      $(`vihollinen${i}`).style.animationTimingFunction = "ease";
      poistaElem($(`vihollinen${i}`), 5000);
      viimeksiTapettuVihollinenAika = new Date();
    };
  });
};
function paivitaVisuaalisestiPelaaja() {
  let hp = +$("pelaajaHpText").textContent.split("/")[0];
  let mp = +$("pelaajaMpText").textContent.split("/")[0];
  $("PelaajanHp1").style.width = `${pelaaja.laskeHp() > 0 ? pelaaja.laskeHp() / pelaaja.laskeMaxHp() * 100 : 0}%`;
  $("PelaajanHp2").style.width = `${pelaaja.laskeHp() > 0 ? pelaaja.laskeHp() / pelaaja.laskeMaxHp() * 100 : 0}%`;
  $("pelaajaHpText").textContent = `${pelaaja.laskeHp()}/${pelaaja.laskeMaxHp()}`;
  $("PelaajanMp1").style.width = `${pelaaja.laskeMp() > 0 ? pelaaja.laskeMp() / pelaaja.laskeMaxMp() * 100 : 0}%`;
  $("PelaajanMp2").style.width = `${pelaaja.laskeMp() > 0 ? pelaaja.laskeMp() / pelaaja.laskeMaxMp() * 100 : 0}%`;
  $("pelaajaMpText").textContent = `${pelaaja.laskeMp()}/${pelaaja.laskeMaxMp()}`;
  $("PelaajanExp1").style.width = `${pelaaja.aika > 0 ? pelaaja.aika / pelaaja.maxAika * 100 : 0}%`;
  $("PelaajanExp2").style.width = `${pelaaja.aika > 0 ? pelaaja.aika / pelaaja.maxAika * 100 : 0}%`;
  $("lvlText").textContent = `${pelaaja.aika < 0 ? 0 : pelaaja.aika}s`;
  if(hp > +$("pelaajaHpText").textContent.split("/")[0]) {
    $("hpBox").classList = "down";
  } else $("hpBox").classList = "up";
  if(mp > +$("pelaajaMpText").textContent.split("/")[0]) {
    $("mpBox").classList = "down";
  } else $("mpBox").classList = "up";

  $("buffsBox").textContent = "";
  $("nerfsBox").textContent = "";
  for(let i = 0; i < pelaaja.statusEfektit.buffs.length; i++) {
    let div = $e("div");
    div.classList.add("buffs");
    div.innerHTML += `<img src="${pelaaja.statusEfektit.buffs[i].kuva || ""}" alt="">
    <p>${pelaaja.statusEfektit.buffs[i].pituus || ""}s</p>`;
    if(pelaaja.statusEfektit.buffs[i].hover) luoGlobalHover(div, [
      `$pelaaja.statusEfektit.buffs[${i}].nimi!$ <br> <css>font-weight: 900<css> <fs>20px<fs> <c>#fcff57<c>`
      +pelaaja.statusEfektit.buffs[i].hover
      +`§Efekti kestää vielä §$pelaaja.statusEfektit.buffs[${i}].pituus!$s <c>#57ff6d<c> <css>font-weight: 600<css>`
    ]);
    $("buffsBox").appendChild(div); 
  };
  for(let i = 0; i < pelaaja.statusEfektit.nerfs.length; i++) {
    let div = $e("div");
    div.classList.add("nerfs");
    div.innerHTML += `<img src="${pelaaja.statusEfektit.nerfs[i].kuva || ""}" alt="">
    <p>${pelaaja.statusEfektit.nerfs[i].pituus || ""}s</p>`;
    if(pelaaja.statusEfektit.nerfs[i].hover) luoGlobalHover(div, [
      `$pelaaja.statusEfektit.nerfs[${i}].nimi!$ <br> <css>font-weight: 900<css> <fs>20px<fs> <c>#ff57e3<c>`
      +pelaaja.statusEfektit.nerfs[i].hover
      +`§Efekti kestää vielä §$pelaaja.statusEfektit.nerfs[${i}].pituus!$s <c>#ff5757<c> <css>font-weight: 600<css>`
    ]);
    $("nerfsBox").appendChild(div); 
  };
}

let vihollisenInterval = null;
function vihollisenVuoro() {
  let vihuNum = null, aseNum = null;

  // if(vihollisenInterval == null) vihollisenInterval = setInterval(vihollisenVuoro, 300);
  console.log("????")
  $("taisteluRuutu").classList = "vihu";
}

function vihuAi1(num) {
  let taulu = [];

  function lisaaNumPeraan(arr) {
    taisteltavatViholliset[num].hotborItems.forEach((v, i) => {
      
    });
  }
}

function test() {
  let isoTaulu = [];

  console.log(lisaaNum({numerot:[], total: 0}))

  function lisaaNum(taulu) {
    for(let i = 1; i < 5; i++) {
      if(taulu.total + i == 5) {
        let luvut = taulu.numerot.slice();
        luvut.push(i);
        isoTaulu.push({numerot:luvut, total: taulu.total + i});
        break;
      }
      let luvut = taulu.numerot.slice();
      luvut.push(i);
      lisaaNum({numerot:luvut, total: taulu.total + i});
    } return isoTaulu;
  }
}

function test2(num) {
  let isoTaulu = [];
  let p = new Pelaaja(pelaaja);
  let tyhja = [];
  for(let nimi in p.hotbarItems) {
    if(p.hotbarItems[nimi]) {
      if(p.hotbarItems[nimi].nimi) {
        tyhja.push(p.hotbarItems[nimi]);
      }
    }
  } p.hotbarItems = tyhja;
  // console.log(laskeVuoro(new Vihollinen(taisteltavatViholliset[num]), new Vihollinen(p), []));
  // console.log(laskeVuoro(new Vihollinen(p), new Vihollinen(p), []));
  console.log(laskeVuoro(new Vihollinen(p), new Vihollinen(taisteltavatViholliset[num]), []));
  console.log(isoTaulu.sort((x1, x2) => x1.kohde.hp - x2.kohde.hp));
  function laskeVuoro(tekija, kohde, iskut) {
    let jatkuu = false;
    for(let i = 0; i < tekija.hotbarItems.length; i++) {
      tkopio = new Vihollinen({...tekija});
      kokopio = new Vihollinen({...kohde});
      ikopio = iskut.slice();
      if(tarkistaIsku()) {
        let vahinko = tekija.hotbarItems[i].laskeDmg();
        jatkuu = true;
        tkopio.aika -= tekija.hotbarItems[i].nopeus;
        if(tkopio.hotbarItems[i].taika) {
          tkopio.mp -= tkopio.hotbarItems[i].taika;
        }

        if(vahinko.dmg > 0) {
          kokopio.hp = kokopio.laskeHp() - vahinko.dmg;
        }

        tkopio.paivitaStatusEfektit(tkopio.hotbarItems[i].nopeus);
        tkopio.hotbarItems[i].annaKaEfektit();

        if(tkopio.hotbarItems[i].parannus) {
          tkopio.hp = Math.min((tkopio.laskeHp() + tkopio.hotbarItems[i].parannus), tkopio.laskeMaxHp());
        } if(tkopio.hotbarItems[i].parannusProsentti) {
          tkopio.hp += Math.ceil(tkopio.laskeMaxHp() * tkopio.hotbarItems[i].parannusProsentti);
          if(tkopio.hp > tkopio.laskeMaxHp()) tkopio.hp = tkopio.laskeMaxHp();
        }

        if(tkopio.hotbarItems[i].maara) {
          tkopio.hotbarItems[i].maara -= 1;
        }

        ikopio.push(i);
        laskeVuoro(tkopio, kokopio, ikopio);
      } else if(i == tekija.hotbarItems.length - 1 && !jatkuu) {
        isoTaulu.push({tekija: tkopio, kohde: kokopio, iskut: ikopio});
      }
      // vuoro jatkuu suorita uudelleen
      // ei voi suorittaa mitään iskua denay

      function tarkistaIsku() {
        if(!tkopio.aika) return false;
        if(tkopio.hotbarItems[i].maara <= 0) return false;
        if(tkopio.aika <= 0) return false;
        if(tkopio.hotbarItems[i].taika) {
          if(tkopio.mp < tkopio.hotbarItems[i].taika) return false;
        } return true;
      };
    }
  }
}