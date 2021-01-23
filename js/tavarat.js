const tavarat = {
  "test1": {
    nimi: "Testi 1",
    tyyppi: "taika",
    tyyppiText: "Taika",
    kuva: "./images/miekka1.png",
    maxDmg: 4,
    minDmg: 3,
    nopeus: 3,
    critProsentti: .20,
    taika: 15
  },
  "vahvuusPullo": {
    nimi: "Vahvuus pullo",
    tyyppi: "pullo",
    tyyppiText: "Käytettävä",
    nopeus: 3,
    maara: 5,
    kuva: "./images/voimaLääke.png",
    kaEfektit: {
      buffs: [
        {...statusEfectit.buffDmg},
        {...statusEfectit.buffDmg2},
      ],
      nerfs: [
        // {...statusEfectit.nerfDmg},
      ]
    }
  },
  "hpRegenTest": {
    nimi: "Hp regen/hp up",
    tyyppi: "pullo",
    tyyppiText: "Käytettävä",
    nopeus: 5,
    maara: 2,
    // parannus: 50,
    parannusProsentti: .2,
    kuva: "./images/voimaLääke.png",
    kaEfektit: {
      buffs: [
        {...statusEfectit.maxHp}
      ],
      nerfs: [

      ]
    }
  }
}

// const tavarat = {
//   "puumiekka": {
//     nimi: "Puumiekka",
//     tyyppi: "ase",
//     tyyppiText: "Lähitaistelu",
//     maxDmg: 4,
//     minDmg: 2,
//     kuva: "https://static.wikia.nocookie.net/terraria_gamepedia/images/c/cd/Wooden_Sword.png/revision/latest/scale-to-width-down/32?cb=20200516223648",
//     nopeus: 7,
//     critProsentti: .10,
//   },
//   "taikasauva": {
//     nimi: "Taikasauva",
//     tyyppi: "taika",
//     tyyppiText: "Taika",
//     kuva: "./images/taika.png",
//     maxDmg: 10,
//     minDmg: 7,
//     nopeus: 9,
//     critProsentti: .25,
//     taika: 25
//   },
//   "rautamiekka": {
//     nimi: "Rautamiekka",
//     tyyppi: "ase",
//     tyyppiText: "Lähitaistelu",
//     kuva: "https://static.wikia.nocookie.net/terraria_gamepedia/images/3/35/Lead_Shortsword.png/revision/latest/scale-to-width-down/32?cb=20200516214626",
//     minDmg: 6,
//     nopeus: 8,
//     critProsentti: .10,
//     taika: 9,
//     teko: [{tavara: "puutikku", maara: 5}, {tavara: "rauta", maara: 15}]
//   },
//   "test1": {
//     nimi: "Testi 1",
//     tyyppi: "taika",
//     tyyppiText: "Taika",
//     kuva: "./images/miekka1.png",
//     maxDmg: 4,
//     minDmg: 3,
//     nopeus: 3,
//     critProsentti: .20,
//     taika: 15
//   },
//   "test2": {
//     nimi: "Testi 2",
//     tyyppi: "taika",
//     tyyppiText: "Taika",
//     maxDmg: 5,
//     minDmg: 5,
//     nopeus: 5,
//     critProsentti: .20,
//     taika: 25
//   },
//   "test3": {
//     nimi: "Testi 3",
//     tyyppi: "taika",
//     tyyppiText: "Taika",
//     minDmg: 5,
//     nopeus: 3,
//     critProsentti: .20,
//     taika: 15
//   },
//   "hpPottu": {
//     nimi: "Parannus pullo",
//     tyyppi: "hp",
//     tyyppiText: "Parannus",
//     kuva: "./images/hpPottu.png",
//     parannus: 50,
//     nopeus: 8,
//     maara: 1,
//     taika: 3
//   },
//   "hpPottu2": {
//     nimi: "Parannus pullo 2",
//     tyyppi: "hp",
//     tyyppiText: "Parannus",
//     kuva: "./images/hpPottu.png",
//     parannus: 5,
//     nopeus: 5,
//     maara: 3,
//     taika: 3
//   },
//   "puutikku": {
//     nimi: "Puinen tikku",
//     tyyppi: "materiaali",
//     tyyppiText: "Materiaali",
//   },
//   "rauta": {
//     nimi: "Rauta",
//     tyyppi: "materiaali",
//     tyyppiText: "Materiaali",
//   },
//   "vahvuusPullo": {
//     nimi: "Vahvuus pullo",
//     nopeus: 3,
//     maara: 5,
//     efektit: {
//       buffs: [
//         {...statusEfectit.buffDmg}
//       ]
//     }
//   }
// }

function Tavara(kohde, arr) {
  this.nimi = arr.nimi;
  this.tyyppi = arr.tyyppi;
  this.tyyppiText = arr.tyyppiText;
  this.maxDmg = arr.maxDmg;
  this.minDmg = arr.minDmg;
  this.kuva = arr.kuva;
  this.nopeus = arr.nopeus;
  this.critProsentti = arr.critProsentti;
  this.koEfektit = {}; // kohde efektit
  if(arr?.koEfektit?.buffs) this.koEfektit.buffs = arr.koEfektit.buffs.map(e => ({...e}));
  if(arr?.koEfektit?.nerfs) this.koEfektit.nerfs = arr.koEfektit.nerfs.map(e => ({...e}));
  this.kaEfektit = arr.kaEfektit ? {} : ""; // käyttäjä efektit
  if(arr?.kaEfektit?.buffs) this.kaEfektit.buffs = arr.kaEfektit.buffs.map(e => ({...e}));
  if(arr?.kaEfektit?.nerfs) this.kaEfektit.nerfs = arr.kaEfektit.nerfs.map(e => ({...e}));
  this.maara = arr.maara;
  this.taika = arr.taika;
  this.parannus = arr.parannus;
  this.parannusProsentti = arr.parannusProsentti;

  this.laskeMinDmg = () => Math.max(Math.floor(this.minDmg * (1 + kohde.kertoimet.dmg)), 0);
  this.laskeMaxDmg = () => Math.max(Math.floor(this.maxDmg * (1 + kohde.kertoimet.dmg)), 0);
  this.minMaxDmgText = () => `${this.laskeMinDmg()}${this.laskeMaxDmg() && this.laskeMaxDmg() !== this.laskeMinDmg() ? "-" + this.laskeMaxDmg() : ""}`;
  this.laskeDmg = () => {
    let vahinko = null, crit = false;
    if(this.maxDmg && this.minDmg) vahinko = random(this.laskeMinDmg(), this.laskeMaxDmg());
    else if(this.minDmg) vahinko = this.laskeMinDmg();
    if(Math.random() <= this.critProsentti) {
      vahinko = vahinko * kohde.critKerroin;
      crit = true;
    } if(vahinko > 0) {
      if(vahinko % 1 !== 0) vahinko = Math.max(Math.floor(vahinko), 0);
    } return {dmg: vahinko, crit};
  };

  this.annaKaEfektit = () => {
    if(this.kaEfektit) {
      for(let i = 0; i < this.kaEfektit?.buffs?.length; i++) {
        let lisattu = false;
        kohde.statusEfektit.buffs.forEach((v, i2) => {
          if(v.nimi == this.kaEfektit.buffs[i].nimi) {
            lisattu = true;
            kohde.statusEfektit.buffs[i2].pituus = Math.max(v.pituus, this.kaEfektit.buffs[i].pituus);
          }
        }); if(!lisattu) kohde.statusEfektit.buffs.push({...this.kaEfektit.buffs[i]});
      }
      for(let i = 0; i < this.kaEfektit?.nerfs?.length; i++) {
        let lisattu = false;
        kohde.statusEfektit.nerfs.forEach((v, i2) => {
          if(v.nimi == this.kaEfektit.nerfs[i].nimi) {
            lisattu = true;
            kohde.statusEfektit.nerfs[i2].pituus = Math.max(v.pituus, this.kaEfektit.nerfs[i].pituus);
          }
        }); if(!lisattu) kohde.statusEfektit.nerfs.push({...this.kaEfektit.nerfs[i]});
      };
      kohde.paivitaKertoimet();
    };
  }
}