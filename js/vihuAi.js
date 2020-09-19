function vihollisenAi2(num) {  
  // console.log(keraaTiedotKohteesta3(taisteltavatViholliset[num]))
  // console.log(keraaTiedotKohteesta3(pelaajanTaisteluKopio, 10))
  console.log(keraaTiedotKohteesta3(taisteltavatViholliset[num]))

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
    } return total > pelaajanTaisteluKopio.hp;
  }

  function kannattaakoParantaa(taulu) {

    let pl = keraaTiedotKohteesta3(pelaajanTaisteluKopio);
    pl = lajitteleTaulu(false, "parasDmg", false, pl);
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

  // function keraaTiedotKohteesta(ko) {
  //   let isoTaulu = [];
  //   let tauluPohja = {
  //     iskut: [],
  //     aika: ko.aika,
  //     mp: ko.mp,
  //     parasDmg: 0,
  //     huonoinDmg: 0,
  //     keskiarvoDmg: 0,
  //   }
  //   return lisaaIskut(tauluPohja, ko)
  //   function lisaaIskut(taulu, kohde) {
  //     for(let i = 0; i < kohde.tavarat.length; i++) {
  //       if(kohde.tavarat[i].taika > taulu.mp) continue;
  //       if(taulu.aika - kohde.tavarat[i].nopeus <= 0) {
  //         let iskut = taulu.iskut.slice();
  //         iskut.push(i);
  //         isoTaulu.push({
  //           iskut, 
  //           aika: taulu.aika - kohde.tavarat[i].nopeus,
  //           parasDmg: laskeParasVahinko(kohde.tavarat[i], num),
  //           mp: taulu.mp - kohde.tavarat[i].taika || 0
  //         });
  //         break;
  //       }
  //       let luvut = taulu.iskut.slice();
  //       luvut.push(i);
  //       lisaaIskut({
  //         iskut: luvut, 
  //         aika: taulu.aika - kohde.tavarat[i].nopeus,
  //         parasDmg: laskeParasVahinko(kohde.tavarat[i], num),
  //         mp: taulu.mp - kohde.tavarat[i].taika || 0
  //       }, kohde);
  //     } return isoTaulu;
  
  //     function laskeParasVahinko(ase, vihnum) {
  //       if(!ase.minDmg) return 0;
  //       let vahinko = ase.maxDmg || ase.minDmg;
  //       return vahinko * taisteltavatViholliset[vihnum].critKerroin || 1;
  //     }
  //   }
  // }  



  // function keraaTiedotKohteesta2(ko) {
  //   let isoTaulu = [];
  //   let tauluPohja = {
  //     iskut: [],
  //     aika: ko.aika,
  //     mp: ko.mp,
  //     parasDmg: 0,
  //     huonoinDmg: 0,
  //     keskiarvoDmg: 0,
  //   }
  //   return lisaaIskut(tauluPohja, ko)
  //   function lisaaIskut(taulu, kohde) {
  //     let tauluKopio = clone(taulu);
  //     let kohdeKopio = clone(kohde);
  //     for(let i = 0; i < kohdeKopio.tavarat.length; i++) {
  //       if(kohdeKopio.tavarat[i].taika > tauluKopio.mp) continue;
  //       if(!kohdeKopio.tavarat[i].nopeus) continue;
  //       if(tauluKopio.aika - kohdeKopio.tavarat[i].nopeus <= 0) {
  //         let iskut = tauluKopio.iskut.slice();
  //         iskut.push(i);
  //         isoTaulu.push({
  //           iskut, 
  //           aika: tauluKopio.aika - (kohdeKopio.tavarat[i].nopeus || 0),
  //           parasDmg: tauluKopio.parasDmg + laskeParasVahinko(kohdeKopio.tavarat[i], num),
  //           mp: tauluKopio.mp - (kohdeKopio.tavarat[i].taika || 0)
  //         });
  //         continue;
  //       }
  //       let luvut = tauluKopio.iskut.slice();
  //       luvut.push(i);
  //       lisaaIskut({
  //         iskut: luvut, 
  //         aika: tauluKopio.aika - (kohdeKopio.tavarat[i].nopeus || 0),
  //         parasDmg: tauluKopio.parasDmg + laskeParasVahinko(kohdeKopio.tavarat[i], num),
  //         mp: tauluKopio.mp - (kohdeKopio.tavarat[i].taika || 0)
  //       }, kohdeKopio);
  //     } return isoTaulu;
  
  //     function laskeParasVahinko(ase, vihnum) {
  //       if(!ase.minDmg) return 0;
  //       let vahinko = ase.maxDmg || ase.minDmg;
  //       return vahinko * taisteltavatViholliset[vihnum].critKerroin || 1;
  //     }
  //   }
  // }


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
        if(kohdeKopio.tavarat[i].taika > tauluKopio.mp) continue;
        if(kohdeKopio.tavarat[i].maara <= 0) continue;
        if(tauluKopio.maara[i] <= 0) continue;
        if(!kohdeKopio.tavarat[i].nopeus) continue;
        if(kohdeKopio.tavarat[i].nopeus <= 0) continue;
        if(tauluKopio.aika - kohdeKopio.tavarat[i].nopeus <= 0) {
          let iskut = tauluKopio.iskut.slice();
          let maara = tauluKopio.maara.slice();
          if(kohdeKopio.tavarat[i].maara) {
            maara[i] = (maara[i] || kohdeKopio.tavarat[i].maara) - 1;
          }
          let tappamisAika = tauluKopio.aikaTappamiseen;
          if(tauluKopio.hp > 0) tappamisAika += kohdeKopio.tavarat[i].nopeus || 0;
          iskut.push(i);
          isoTaulu.push({
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
          });
          continue;
        }
        let iskut = tauluKopio.iskut.slice();
        let maara = tauluKopio.maara.slice();
        if(kohdeKopio.tavarat[i].maara) {
          maara[i] = (maara[i] || kohdeKopio.tavarat[i].maara) - 1;
        }
        let tappamisAika = tauluKopio.aikaTappamiseen;
        if(tauluKopio.hp > 0) tappamisAika += kohdeKopio.tavarat[i].nopeus || 0;
        iskut.push(i);
        lisaaIskut({
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
        }, kohdeKopio);
      } return isoTaulu;
  
      function laskeParasVahinko(ase) {
        if(!ase.minDmg) return 0;
        let vahinko = ase.maxDmg || ase.minDmg;
        return vahinko * kohdeKopio.critKerroin || 1;
      }
    }
  }
}