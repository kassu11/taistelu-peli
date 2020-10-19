function pelaajaHyokkaa(num) {
  let shakeNum = $(`vihollinen${num}`).style.animationName.substring(5) || 5;
  $(`vihollinen${num}`).style.animationName = `shake${(+shakeNum + random(1, 9)) % 10}`;
  let valittu = pelaaja.hotbarItems[pelaajanAseNum];
  let vahinko = 0, crit = false;
  if(valittu.minDmg) {
    let dmg = random(valittu.minDmg, valittu.maxDmg);
    console.log(dmg)
    vahinko = valittu
    taisteltavatViholliset[num].hp -= 5;
    paivitaVisuaalisestiViholliset();
  }

  console.log(taisteltavatViholliset[num])
}

window.addEventListener("keydown", e => {
  if(e.key < 6 && e.key > 0) {
    $(`slot${pelaajanAseNum}`).classList.remove("valittuSlot");
    pelaajanAseNum = e.key - 1;
    $(`slot${pelaajanAseNum}`).classList.add("valittuSlot");
  };
})

function paivitaPelaajanHotbar() {
  $("hotbar").innerHTML = `
  <div class = "slotsBox">
    <div id = "slotPopupDeley"></div>
    ${slots()}
  </div>`;

  function slots() {
    let text = ``;
    for(let i = 0; i < 5; i++) {
      let tavara = pelaaja.hotbarItems[i];
      text += `<div id = "slot${i}" class = "slot ${i == pelaajanAseNum ? "valittuSlot" : ""}">
        <p class = "slotNumero">${i + 1}</p>
        <img id = "slot${i}Kuva" class = "slotKuva" src = ${tavara?.nimi ? tavara?.kuva || eiKuvaa : ""}>
        <p id = "tavaraLuku${i}" class = "tavaraLuku">${tavara?.maara || ""}</p>
      </div>`
    } return text;
  };
  for(let i = 0; i < 5; i++) {
    if(pelaaja?.hotbarItems[i]?.nimi) {
      let text = `<c>$p.style.fontSize = '15px'<c> §$pelaaja.hotbarItems[${i}].nimi<fs>20px<fs><br><c>#f00<c><css> font-weight:600 <css>`
      if(pelaaja.hotbarItems[i].tyyppiText) text += `§Tyyppi: §$pelaaja.hotbarItems[${i}].tyyppiText<br><c>#f90<c>`;
      if(pelaaja.hotbarItems[i].minDmg) text += `§Vahinko: §$pelaaja.hotbarItems[${i}].minDmg<c>#ffe000<c>§${pelaaja.hotbarItems[i].maxDmg ? `<c>#ffe000<c>-§$pelaaja.hotbarItems[${i}].maxDmg<br><c>#ffe000<c>`: "<br>"}`;
      if(pelaaja.hotbarItems[i].parannus) text += `§Parannus: §$pelaaja.hotbarItems[${i}].parannus!$<c>#ffe000<c>hp <br>`;
      if(pelaaja.hotbarItems[i].nopeus) text += `§Nopeus: §$pelaaja.hotbarItems[${i}].nopeus!$s<br><c>#41ee36<c>`;
      if(pelaaja.hotbarItems[i].taika) text += `§Manan kulutus: §$pelaaja.hotbarItems[${i}].taika!$m<br><c>#2eb3e0<c>`;
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
  });
};
function paivitaVisuaalisestiPelaaja() {
  let hp = +$("pelaajaHpText").textContent.split("/")[0];
  let mp = +$("pelaajaMpText").textContent.split("/")[0];
  $("PelaajanHp1").style.width = `${pelaaja.hp > 0 ? pelaaja.hp / pelaaja.maxHp * 100 : 0}%`;
  $("PelaajanHp2").style.width = `${pelaaja.hp > 0 ? pelaaja.hp / pelaaja.maxHp * 100 : 0}%`;
  $("pelaajaHpText").textContent = `${pelaaja.hp}/${pelaaja.maxHp}`;
  $("PelaajanMp1").style.width = `${pelaaja.mp > 0 ? pelaaja.mp / pelaaja.maxMp * 100 : 0}%`;
  $("PelaajanMp2").style.width = `${pelaaja.mp > 0 ? pelaaja.mp / pelaaja.maxMp * 100 : 0}%`;
  $("pelaajaMpText").textContent = `${pelaaja.mp}/${pelaaja.maxMp}`;
  $("PelaajanExp1").style.width = `${pelaaja.aika > 0 ? pelaaja.aika / pelaaja.maxAika * 100 : 0}%`;
  $("PelaajanExp2").style.width = `${pelaaja.aika > 0 ? pelaaja.aika / pelaaja.maxAika * 100 : 0}%`;
  $("lvlText").textContent = `${pelaaja.aika < 0 ? 0 : pelaaja.aika}s`;
  if(hp > +$("pelaajaHpText").textContent.split("/")[0]) {
    $("hpBox").classList = "down";
  } else $("hpBox").classList = "up";
  if(mp > +$("pelaajaMpText").textContent.split("/")[0]) {
    $("mpBox").classList = "down";
  } else $("mpBox").classList = "up";
}
