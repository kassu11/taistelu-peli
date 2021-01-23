const statusEfectit = {
  "buffDmg": {
    nimi: "Vahvuus I",
    dmgKerroin: .5,
    kuva: "./images/dmgBuff.png",
    pituus: 15,
    hover: "§ Nostaa vahinkoasi §" + "$Math.ceil(statusEfectit.buffDmg.dmgKerroin * 100)!$" + "% <c>#57ff6d<c> <css>font-weight: 600<css> <br>§"
  },
  "buffDmg2": {
    nimi: "Vahvuus II",
    dmgKerroin: 2,
    kuva: "./images/dmgBuff.png",
    pituus: 4,
    hover: "§ Nostaa vahinkoasi §$Math.ceil(statusEfectit.buffDmg2.dmgKerroin * 100)!$% <c>#57ff6d<c> <css>font-weight: 600<css> <br>§"
  },
  "nerfDmg": {
    nimi: "Heikkous",
    dmgKerroin: 10.2,
    kuva: "./images/heikkous.png",
    pituus: 8,
    hover: "§ Laskee vahinkoasi §$Math.ceil(statusEfectit.nerfDmg.dmgKerroin * 100)!$% <c>#ff5757<c> <css>font-weight: 600<css> <br>§"
  },
  "maxHp": {
    nimi: "Enemmän HP",
    hpKerroin: .1,
    kuva: "./images/heikkous.png",
    pituus: 5,
    hover: "§ Antaa lisää hp <br>§"
  },
}

// dmgKerroin
// suojausKerroin
// hpKerroin
// aikaKerroin
// taikaKerroin
// manaRegenKerroin
// hpRegenKerroin
// onniKerroin

function StatusEfectit(array) {
  this.nimi = array.nimi;
  this.dmgKerroin = array.dmgKerroin;
  this.hpKerroin = array.hpKerroin;
  this.pituus = array.pituus;
  this.hover = array.hover;
}