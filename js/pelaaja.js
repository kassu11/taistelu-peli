const pelaaja = new Pelaaja({
  hotbarItems: {
    slot0: tavarat.test1,
    slot1: {...tavarat.vahvuusPullo, maara: 1},
    slot2: tavarat.hpRegenTest,
    slot3: {},
    slot4: {},
  },
  statusEfektit: {
    buffs: [
      
    ],
    nerfs: [
      // {...statusEfectit.maxHp}
    ]
  },
  kertoimet: {
    dmg: 0,
    suoja: 0,
    hp: 0,
    mp: 0,
    aika: 0,
    taika: 0,
    manaRegen: 0,
    hpRegen: 0,
    onni: 0,
  },
  mp: 125,
  maxMp: 125,
  laskeMp: () => Math.floor(pelaaja.mp > pelaaja.laskeMaxMp() ? pelaaja.laskeMaxMp() : pelaaja.mp),
  laskeMaxMp: () => Math.max(Math.floor(pelaaja.maxMp * (1 + pelaaja.kertoimet.mp)), 0),
  hp: 200,
  laskeHp: () => Math.floor(pelaaja.hp > pelaaja.laskeMaxHp() ? pelaaja.laskeMaxHp() : pelaaja.hp),
  laskeMaxHp: () => Math.max(Math.floor(pelaaja.maxHp * (1 + pelaaja.kertoimet.hp), 5)),
  maxHp: 200,
  aika: 10,
  maxAika: 10,
  raha: 0,
  exp: 0,
  critKerroin: 1.5,
  manaRegen: 3,
  suojaus: .1,
});

function Pelaaja(arr) {
  this.hotbarItems = {
    slot0: arr.hotbarItems.slot0 ? new Tavara(this, arr.hotbarItems.slot0) : {}, 
    slot1: arr.hotbarItems.slot1 ? new Tavara(this, arr.hotbarItems.slot1) : {}, 
    slot2: arr.hotbarItems.slot2 ? new Tavara(this, arr.hotbarItems.slot2) : {}, 
    slot3: arr.hotbarItems.slot3 ? new Tavara(this, arr.hotbarItems.slot3) : {}, 
    slot4: arr.hotbarItems.slot4 ? new Tavara(this, arr.hotbarItems.slot4) : {}, 
  },
  this.statusEfektit = {};
  if(arr?.statusEfektit?.buffs) this.statusEfektit.buffs = arr.statusEfektit.buffs.map(e => ({...e}));
  else this.statusEfektit.buffs = [];
  if(arr?.statusEfektit?.nerfs) this.statusEfektit.nerfs = arr.statusEfektit.nerfs.map(e => ({...e}));
  else this.statusEfektit.nerfs = [];
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

  this.mp = arr.mp;
  this.maxMp = arr.maxMp ? arr.maxMp : arr.mp;
  this.laskeMp = () => Math.floor(this.mp > this.laskeMaxMp() ? this.laskeMaxMp() : this.mp),
  this.laskeMaxMp = () => Math.max(Math.floor(this.maxMp * (1 + this.kertoimet.mp)), 0),
  this.hp = arr.hp; 
  this.laskeHp = () => Math.floor(this.hp > this.laskeMaxHp() ? this.laskeMaxHp() : this.hp),
  this.laskeMaxHp = () => Math.max(Math.floor(this.maxHp * (1 + this.kertoimet.hp), 5)),
  this.maxHp = arr.maxHp ? arr.maxHp : arr.hp;
  this.aika = arr.aika;
  this.maxAika = arr.maxAika ? arr.maxAika : arr.aika;
  this.raha = arr.raha;
  this.exp = arr.exp;
  this.critKerroin = arr.critKerroin;
  this.manaRegen = arr.manaRegen;
  this.suojaus = arr.suojaus;

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
}