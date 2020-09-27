// voiko kaikki tappaa pelaajan
// --> max dps

// voiko pelaaja tappaa vihollisen
// --> jos vihollinen parantaa käyttääkö pelaaja enemmän aikaa
//     --> paranna minimi määrä ja loput dps

// max dps


function vihollisenAi2(num) {
  let mpPrannettuPelaaja = JSON.parse(JSON.stringify(pelaajanTaisteluKopio));
  for(let i = num; i < taisteltavatViholliset.length; i++) {
    mpPrannettuPelaaja.mp += Math.min(taisteltavatViholliset[i].aika, taisteltavatViholliset[i].maxAika) * mpPrannettuPelaaja.manaRegen;
    mpPrannettuPelaaja.mp = Math.min(mpPrannettuPelaaja.mp, mpPrannettuPelaaja.maxMp);
  }
  mpPrannettuPelaaja.aika = mpPrannettuPelaaja.maxAika;

  // console.log(keraaTiedotKohteesta3(taisteltavatViholliset[num]))
  // console.log(keraaTiedotKohteesta3(pelaajanTaisteluKopio, 10))
  // console.log(keraaTiedotKohteesta3(taisteltavatViholliset[num]))
  // console.log(voikoKaikkiTappaaPelaajan());


  // console.log(keraaTiedotKohteesta3(taisteltavatViholliset[0]))
  
  if(voikoKaikkiTappaaPelaajan()) {
    let tieto = lajitteleTaulu(false, "realistinenDmg", false, keraaTiedotKohteesta3(taisteltavatViholliset[num]));
    return tieto[0]?.iskut[0];
  } else if(voikoPelaajaTappaa()) {
    if(kannattaakoParantaa() > 0) {
      let hp = kannattaakoParantaa();
      let vihutiedot = lajitteleTaulu(false, "parasHp", false, keraaTiedotKohteesta3(taisteltavatViholliset[num]));
      if(vihutiedot[0]?.parasHp >= hp) {
        for(let i = 0; i < vihutiedot.length; i++) {
          if(vihutiedot[i].parasHp < hp) {
            vihutiedot.splice(i, 1);
            i--;
          }
        }
      }
      vihutiedot = lajitteleTaulu(false, "realistinenDmg", false, vihutiedot);
      return vihutiedot[0]?.iskut[0];
    } else {
      let vihutiedot = lajitteleTaulu(false, "realistinenDmg", false, keraaTiedotKohteesta3(taisteltavatViholliset[num]));
      return vihutiedot[0]?.iskut[0];
    }
  } else {
    let vihutiedot = lajitteleTaulu(false, "realistinenDmg", false, keraaTiedotKohteesta3(taisteltavatViholliset[num]));
    return vihutiedot[0]?.iskut[0];
  }
  
  // let kopio = clone(keraaTiedotKohteesta3(pelaajanTaisteluKopio));
  // console.log(voikoKaikkiTappaaPelaajan("parasDmg"))
  // console.log(voikoKaikkiTappaaPelaajan("realistinenDmg"))
  // console.log(voikoKaikkiTappaaPelaajan("huonoinDmg"))
  // console.log(voikoKaikkiTappaaPelaajan("keskiarvoDmg"))

  function voikoKaikkiTappaaPelaajan(ai = "realistinenDmg") {
    let total = 0;
    for(let i = num; i < taisteltavatViholliset.length; i++) {
      let taulu = keraaTiedotKohteesta3(taisteltavatViholliset[i]);
      taulu = lajitteleTaulu(false, ai, false, taulu);
      total += taulu[0][ai] || 0;
    } return total >= pelaajanTaisteluKopio.hp;
  }

  function voikoPelaajaTappaa() {
    let tieto = keraaTiedotKohteesta3(mpPrannettuPelaaja, taisteltavatViholliset[num].hp);
    tieto = lajitteleTaulu(true, "hp", false, tieto);
    return tieto[0]?.hp <= 0;
  }

  function kannattaakoParantaa() { // palauta hp maara mitä tarvitaan että kannattaa parantaa
    let hp1 = taisteltavatViholliset[num].hp;
    let pl = keraaTiedotKohteesta3(mpPrannettuPelaaja, hp1);
    pl = lajitteleTaulu(true, "aikaTappamiseen", false, pl);
    while(pl.length > 0) {
      if(pl[0].hp > 0) pl.splice(0, 1);
      else break;
    };

    if(pl.length == 0) return 0;

    let parasHp = keraaTiedotKohteesta3(taisteltavatViholliset[num]);
    parasHp = lajitteleTaulu(false, "parasHp", false, parasHp);
    let hp2 = parasHp[0]?.parasHp || 0;
    let maxHp = Math.min((hp1 + hp2), taisteltavatViholliset[num].maxHp);

    if(maxHp > hp1) {
      let pl2 = keraaTiedotKohteesta3(mpPrannettuPelaaja, maxHp);
      pl2 = lajitteleTaulu(true, "aikaTappamiseen", false, pl2);
      while(pl2.length > 0) {
        if(pl2[0].hp > 0) pl2.splice(0, 1);
        else break;
      };
      console.log(pl2[0]?.aikaTappamiseen)
      console.log(pl[0]?.aikaTappamiseen)
      if(pl2.length == 0) return maxHp - hp1;
      if(pl2[0]?.aikaTappamiseen > pl[0]?.aikaTappamiseen) return maxHp - hp1;
    } return 0;
  }

  // console.log(lajitteleTaulu(false, "parasDmg", false, keraaTiedotKohteesta3(pelaajanTaisteluKopio)))
  function lajitteleTaulu(reverse, filter, string, taulu) {
    let kopio = clone(taulu);
    return kopio.sort(function (a, b) {
      let compareA;
      let compareB;
      if(string == true) {
        compareA = a[filter].toUpperCase(); // ignore upper and lowercase
        compareB = b[filter].toUpperCase(); // ignore upper and lowercase
      } else if(string == false) {
        compareA = a[filter];
        compareB = b[filter];
      }
  
      if(compareA < compareB) {
        if(!reverse) return 1;
        else return -1;
      } if(compareA > compareB) {
        if(!reverse) return -1;
        else return 1;
      } return 0;
    });
  }

  function keraaTiedotKohteesta3(ko, hp = 0) {
    let isoTaulu = [];
    let tauluPohja = {
      iskut: [],
      aika: ko.aika,
      aikaTappamiseen: 0,
      hp,
      mp: ko.mp,
      parasDmg: 0,
      huonoinDmg: 0,
      keskiarvoDmg: 0,
      realistinenDmg: 0,
      parasHp: 0,
      maara: []
    }
    return lisaaIskut(tauluPohja, ko)
    function lisaaIskut(taulu, kohde) {
      let tauluKopio = clone(taulu);
      let kohdeKopio = clone(kohde);
      for(let i = 0; i < kohdeKopio.tavarat.length; i++) {
        if(kohdeKopio.tavarat[i]?.taika > tauluKopio.mp) continue;
        if(kohdeKopio.tavarat[i]?.maara <= 0) continue;
        if(tauluKopio.maara[i] <= 0) continue;
        if(!kohdeKopio.tavarat[i]?.nopeus) continue;
        if(kohdeKopio.tavarat[i].nopeus <= 0) continue;
        if(tauluKopio.aika <= 0) continue;
        let iskut = tauluKopio.iskut.slice();
        let maara = tauluKopio.maara.slice();
        if(kohdeKopio.tavarat[i].maara) {
          maara[i] = (maara[i] || kohdeKopio.tavarat[i].maara) - 1;
        }
        let tappamisAika = tauluKopio.aikaTappamiseen;
        if(tauluKopio.hp > 0) tappamisAika += kohdeKopio.tavarat[i].nopeus || 0;
        iskut.push(i);
        let palaute = {
          iskut, 
          aika: tauluKopio.aika - (kohdeKopio.tavarat[i].nopeus || 0),
          aikaTappamiseen: tappamisAika,
          hp: tauluKopio.hp - laskeVahinko(kohdeKopio.tavarat[i], kohdeKopio.critProsentti || 1).vahinko,
          parasDmg: tauluKopio.parasDmg + laskeParasVahinko(kohdeKopio.tavarat[i]),
          mp: tauluKopio.mp - (kohdeKopio.tavarat[i].taika || 0),
          huonoinDmg: tauluKopio.huonoinDmg + (kohdeKopio.tavarat[i].minDmg || 0),
          keskiarvoDmg: (tauluKopio.huonoinDmg + (kohdeKopio.tavarat[i].minDmg || 0) + tauluKopio.parasDmg + laskeParasVahinko(kohdeKopio.tavarat[i])) / 2,
          realistinenDmg: tauluKopio.realistinenDmg + laskeVahinko(kohdeKopio.tavarat[i], kohdeKopio.critProsentti || 1).vahinko,
          parasHp: tauluKopio.parasHp + (kohdeKopio.tavarat[i].parannus || 0),
          maara
        };
        lisaaIskut(palaute, kohdeKopio);
        isoTaulu.push(palaute);
      } return isoTaulu;
  
      function laskeParasVahinko(ase) {
        if(!ase.minDmg) return 0;
        let vahinko = ase.maxDmg || ase.minDmg;
        return vahinko * kohdeKopio.critKerroin || 1;
      }
    }
  }
}