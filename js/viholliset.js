const viholliset = {
  "lvl0": {
    nimi: "Liha köntsä",
    id: "0",
    hp: 10,
    mp: 20,
    suojaus: 10,
    aika: 6,
    kuva: "./images/vihu3.png",
    kuvaWidth: "249px",
    kuvaHeight: "320px",
    manaRegen: 2,
    hotborItems: [
      tavarat.test1,
      tavarat.test2,
      tavarat.test3,
      tavarat.puumiekka,
      tavarat.rautamiekka,
      tavarat.hpPottu2
    ]
  },
  "lvl1": {
    id: "1",
    nimi: "Kieli chad",
    hp: 13,
    mp: 50,
    suojaus: 10,
    aika: 10,
    kuva: "./images/vihu1.png",
    kuvaWidth: "249px",
    kuvaTop: "-20px",
    manaRegen: 2,
    hotborItems: [
      tavarat.test1,
      tavarat.rautamiekka,
      tavarat.hpPottu2,
    ]
  },
  "lvl2": {
    id: "2",
    nimi: "Heikko lima",
    hp: 35,
    mp: 20,
    suojaus: 10,
    aika: 10,
    kuva: "./images/vihu2.png",
    kuvaWidth: "280px",
    kuvaLeft: "-2px",
    manaRegen: 2,
    hotborItems: [
      tavarat.test1,
      tavarat.test2,
      tavarat.puumiekka,
      tavarat.hpPottu,
    ]
  },
  "lvl3": {
    id: "1",
    hp: 30,
    mp: 100,
    suojaus: 10,
    aika: 10,
    kuva: "./images/vihu3.png",
    kuvaWidth: "249px",
    manaRegen: 2,
    hotborItems: [
      tavarat.rautamiekka,
      tavarat.hpPottu2,
      tavarat.puumiekka,
      tavarat.taikasauva,
      tavarat.test1,
      tavarat.test2,
      tavarat.test3,
      tavarat.hpPottu,
      tavarat.hpPottu2,
      tavarat.tikku
    ]
  },
}

for(let vihollinen in viholliset) { // lisää soluja tauluun, joita ei tarvii joka kerta uudelleen kirjottaa :p
  if(!viholliset[vihollinen].maxAika) viholliset[vihollinen]["maxAika"] = viholliset[vihollinen].aika;
  if(!viholliset[vihollinen].maxMp) viholliset[vihollinen]["maxMp"] = viholliset[vihollinen].mp;
  if(!viholliset[vihollinen].maxHp) viholliset[vihollinen]["maxHp"] = viholliset[vihollinen].hp;
  if(!viholliset[vihollinen].suojaus) viholliset[vihollinen]["suojaus"] = 0
  if(!viholliset[vihollinen].kuvaTop) viholliset[vihollinen]["kuvaTop"] = ""
  if(!viholliset[vihollinen].kuvaLeft) viholliset[vihollinen]["kuvaLeft"] = ""
  if(!viholliset[vihollinen].kuvaWidth) viholliset[vihollinen]["kuvaWidth"] = ""
  if(!viholliset[vihollinen].kuvaHeight) viholliset[vihollinen]["kuvaHeight"] = ""
  if(!viholliset[vihollinen].critKerroin) viholliset[vihollinen]["critKerroin"] = 1
  if(!viholliset[vihollinen].manaRegen) viholliset[vihollinen]["manaRegen"] = 0
  if(!viholliset[vihollinen].harvinaisuus) viholliset[vihollinen]["harvinaisuus"] = "normal" // normal rare epic legendary
}