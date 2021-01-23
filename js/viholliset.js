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
    hotbarItems: [
      {...tavarat.test1},
      {...tavarat.vahvuusPullo},
      // {...tavarat.test3},
      // {...tavarat.puumiekka},
      // {...tavarat.rautamiekka},
      // {...tavarat.hpPottu2},
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
    hotbarItems: [
      {...tavarat.test1},
      // {...tavarat.rautamiekka},
      // {...tavarat.hpPottu2},
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
    hotbarItems: [
      {...tavarat.test1},
      // {...tavarat.test2},
      // {...tavarat.puumiekka},
      // {...tavarat.hpPottu},
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
    hotbarItems: [
      {...tavarat.rautamiekka},
      {...tavarat.hpPottu2},
      {...tavarat.puumiekka},
      {...tavarat.taikasauva},
      {...tavarat.test1},
      {...tavarat.test2},
      {...tavarat.test3},
      {...tavarat.hpPottu},
      {...tavarat.hpPottu2},
      {...tavarat.tikku}
    ]
  },
};

function Vihollinen(arr) {
  this.nimi = arr.nimi;
  this.id = arr.id;
  this.hp = arr.hp;
  this.maxHp = arr.maxHp ? arr.maxHp : arr.hp;
  this.mp = arr.mp;
  this.maxMp = arr.maxMp ? arr.maxMp : arr.mp;
  this.suojaus = arr.suojaus;
  this.aika = arr.aika;
  this.maxAika = arr.maxAika ? arr.maxAika : arr.aika;
  this.manaRegen = arr.manaRegen;
  this.kuva = arr.kuva;
  this.kuvaTop = arr.kuvaTop;
  this.kuvaLeft = arr.kuvaLeft;
  this.kuvaWidth = arr.kuvaWidth;
  this.kuvaHeight = arr.kuvaHeight;
  this.critKerroin = arr.critKerroin || 1;
  this.harvinaisuus = arr.harvinaisuus;
  this.laskeMp = () => Math.floor(this.mp > this.laskeMaxMp() ? this.laskeMaxMp() : this.mp),
  this.laskeMaxMp = () => Math.max(Math.floor(this.maxMp * (1 + this.kertoimet.mp)), 0),
  this.laskeHp = () => Math.floor(this.hp > this.laskeMaxHp() ? this.laskeMaxHp() : this.hp),
  this.laskeMaxHp = () => Math.max(Math.floor(this.maxHp * (1 + this.kertoimet.hp), 5)),
  this.kertoimet = {};

  this.kertoimet.dmg = arr?.kertoimet?.dmg || 0;
  this.kertoimet.suoja = arr?.kertoimet?.suoja || 0;
  this.kertoimet.hp = arr?.kertoimet?.hp || 0;
  this.kertoimet.mp = arr?.kertoimet?.mp || 0;
  this.kertoimet.aika = arr?.kertoimet?.aika || 0;
  this.kertoimet.taika = arr?.kertoimet?.taika || 0;
  this.kertoimet.manaRegen = arr?.kertoimet?.manaRegen || 0;
  this.kertoimet.hpRegen = arr?.kertoimet?.hpRegen || 0;
  this.kertoimet.onni = arr?.kertoimet?.onni || 0;
  
  this.statusEfektit = {};
  if(arr?.statusEfektit?.buffs) this.statusEfektit.buffs = arr.statusEfektit.buffs.map(e => ({...e}));
  else this.statusEfektit.buffs = [];
  if(arr?.statusEfektit?.nerfs) this.statusEfektit.nerfs = arr.statusEfektit.nerfs.map(e => ({...e}));
  else this.statusEfektit.nerfs = [];

  this.hotbarItems = arr.hotbarItems.map(e => new Tavara(this, e));

  this.paivitaStatusEfektit = aika => {
    for(let i = 0; i < this.statusEfektit.buffs.length; i++) {
      this.statusEfektit.buffs[i].pituus -= aika;
      if(this.statusEfektit.buffs[i].pituus <= 0) {
        this.statusEfektit.buffs.splice(i, 1);
        i--;
      }
    }

    for(let i = 0; i < this.statusEfektit.nerfs.length; i++) {
      this.statusEfektit.nerfs[i].pituus -= aika;
      if(this.statusEfektit.nerfs[i].pituus <= 0) {
        this.statusEfektit.nerfs.splice(i, 1);
        i--;
      }
    }
  };

  this.paivitaKertoimet = () => {
    for(let nimi in this.kertoimet) {
      this.kertoimet[nimi] = 0;
    }
    for(let i = 0; i < this.statusEfektit.buffs.length; i++) {
      this.kertoimet.dmg += this.statusEfektit.buffs[i].dmgKerroin || 0;
      this.kertoimet.hp += this.statusEfektit.buffs[i].hpKerroin || 0;
    }
    for(let i = 0; i < this.statusEfektit.nerfs.length; i++) {
      this.kertoimet.dmg -= this.statusEfektit.nerfs[i].dmgKerroin || 0;
      this.kertoimet.hp -= this.statusEfektit.nerfs[i].hpKerroin || 0;
    }
  
    this.hp = this.laskeHp();
    this.mp = this.laskeMp();
  }
};

// for(let vihollinen in viholliset) { // lisää soluja tauluun, joita ei tarvii joka kerta uudelleen kirjottaa :p
//   if(!viholliset[vihollinen].maxAika) viholliset[vihollinen]["maxAika"] = viholliset[vihollinen].aika;
//   if(!viholliset[vihollinen].maxMp) viholliset[vihollinen]["maxMp"] = viholliset[vihollinen].mp;
//   if(!viholliset[vihollinen].maxHp) viholliset[vihollinen]["maxHp"] = viholliset[vihollinen].hp;
//   if(!viholliset[vihollinen].suojaus) viholliset[vihollinen]["suojaus"] = 0
//   if(!viholliset[vihollinen].kuvaTop) viholliset[vihollinen]["kuvaTop"] = ""
//   if(!viholliset[vihollinen].kuvaLeft) viholliset[vihollinen]["kuvaLeft"] = ""
//   if(!viholliset[vihollinen].kuvaWidth) viholliset[vihollinen]["kuvaWidth"] = ""
//   if(!viholliset[vihollinen].kuvaHeight) viholliset[vihollinen]["kuvaHeight"] = ""
//   if(!viholliset[vihollinen].critKerroin) viholliset[vihollinen]["critKerroin"] = 1
//   if(!viholliset[vihollinen].manaRegen) viholliset[vihollinen]["manaRegen"] = 0
//   if(!viholliset[vihollinen].harvinaisuus) viholliset[vihollinen]["harvinaisuus"] = "normal" // normal rare epic legendary
// }