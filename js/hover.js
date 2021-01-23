let hoverBgBox = $("globalHoverBg"), globalHoverHiiri = {x: 0, y: 0};
function luoGlobalHover(kohde, texts, ehdot, napit) {
  if(typeof kohde == "string") kohde = $(kohde);
  kohde.addEventListener("mouseenter", e => globalHoverEnter(e, texts, ehdot, napit));
  kohde.addEventListener("mousemove", e => globalHoverMove(e, ehdot));
  kohde.addEventListener("mouseout", globalHoverOut);
}
function globalHoverEnter(e, texts, ehdot, napit) { // [text], [milloin näytetään (true / false),] [extra nappi]
  $("globalHoverBg").style.display = "block";
  if(ehdot) for(let ehto of ehdot) {
    if(!eval(ehto)) {$("globalHoverBg").style.display = "none"};
  }
  window.onkeydown = null;
  window.onkeyup = null;
  window.onkeydown = v => globalHoverKeyDown(v, texts, ehdot, napit);
  window.onkeyup = v => globalHoverKeyUp(v, texts, ehdot, napit);
  $("globalHoverSisalto").textContent = "";
  let text = texts[0];
  if(napit) napit.forEach((value, index) => {
    if(e[value] == true) text = texts[index + 1];
  });
  $("globalHoverSisalto").appendChild(luoTextiSyntaxt(text));
}
function globalHoverMove(e) {
  globalHoverHiiri.x = e.x; globalHoverHiiri.y = e.y;
  let rect = hoverBgBox.getBoundingClientRect();
  let borderPadding = 10;
  let hiiriOfset = 20;

  if(e.x + rect.width + hiiriOfset >= window.innerWidth - borderPadding) {
    hoverBgBox.style.left = `${window.innerWidth - rect.width - borderPadding}px`;
  } else hoverBgBox.style.left = `${e.x + hiiriOfset}px`;
  if(e.y + rect.height + hiiriOfset >= window.innerHeight - borderPadding) {
    hoverBgBox.style.top = `${window.innerHeight - rect.height - borderPadding}px`;
  } else hoverBgBox.style.top = `${e.y + hiiriOfset}px`;
}
function globalHoverOut() {
  $("globalHoverBg").style.display = "none";
  window.onkeydown = null;
  window.onkeyup = null;
}
function globalHoverKeyDown(e, texts, ehdot, napit) {
  if(e.repeat) return;
  if(ehdot) for(let ehto of ehdot) {
    if(!eval(ehto)) {
      $("globalHoverBg").style.display = "none";
      return;
    }
  }
  $("globalHoverSisalto").textContent = "";
  let text = texts[0];
  if(napit) napit.forEach((value, index) => {
    if(e[value] == true) text = texts[index + 1];
  });
  $("globalHoverSisalto").appendChild(luoTextiSyntaxt(text));

  let rect = hoverBgBox.getBoundingClientRect();
  let borderPadding = 10;
  let hiiriOfset = 20;

  if(globalHoverHiiri.x + rect.width + hiiriOfset >= window.innerWidth - borderPadding) {
    hoverBgBox.style.left = `${window.innerWidth - rect.width - borderPadding}px`;
  } else hoverBgBox.style.left = `${globalHoverHiiri.x + hiiriOfset}px`;
  if(globalHoverHiiri.y + rect.height + hiiriOfset >= window.innerHeight - borderPadding) {
    hoverBgBox.style.top = `${window.innerHeight - rect.height - borderPadding}px`;
  } else hoverBgBox.style.top = `${globalHoverHiiri.y + hiiriOfset}px`;
}
function globalHoverKeyUp(e, texts, ehdot, napit) {
  if(ehdot) for(let ehto of ehdot) {
    if(!eval(ehto)) {
      $("globalHoverBg").style.display = "none";
      return
    } else {
      $("globalHoverBg").style.display = "block";
    }
  }
  $("globalHoverSisalto").textContent = "";
  let text = texts[0]
  if(napit) napit.forEach((value, index) => {
    if(e[value] == true) text = texts[index + 1];
  });
  $("globalHoverSisalto").appendChild(luoTextiSyntaxt(text));

  let rect = hoverBgBox.getBoundingClientRect();
  let borderPadding = 10;
  let hiiriOfset = 20;

  if(globalHoverHiiri.x + rect.width + hiiriOfset >= window.innerWidth - borderPadding) {
    hoverBgBox.style.left = `${window.innerWidth - rect.width - borderPadding}px`;
  } else hoverBgBox.style.left = `${globalHoverHiiri.x + hiiriOfset}px`;
  if(globalHoverHiiri.y + rect.height + hiiriOfset >= window.innerHeight - borderPadding) {
    hoverBgBox.style.top = `${window.innerHeight - rect.height - borderPadding}px`;
  } else hoverBgBox.style.top = `${globalHoverHiiri.y + hiiriOfset}px`;
}

// let testiTaulu = [
//   "<css> text-shadow: 2px -6px #0014ff; <css> <c>red<c> <fs>30px<fs> Moro miten menee loladasdasd § <c>white<c> miten § <fs>50px<fs> menee<br> <c>blue<c> § <c>white<c> <fs>20px<fs> Kaunis päivä § paiva <fs>50px<fs> <c>red<c>"
// ]
// $("popUpDmg").appendChild(luoTextiSyntaxt(testiTaulu[0]));

function luoTextiSyntaxt(syn) {
  let p = $e("p");
  let text = syn.split("§");
  text.forEach(e => {
    let span = $e("span");
    if(e.indexOf("<fs>") !== -1) {
      let taulu = e.split("<fs>");
      span.style.fontSize = taulu.splice(1, 1)[0];
      e = taulu.join("");
    }; if(e.indexOf("<c>") !== -1) {
      let taulu = e.split("<c>");
      if(taulu[1].startsWith("$")) {
        try {
          taulu[1] = eval(taulu[1].substring(1));
        } 
        catch {console.error("Tuntematon variable:", taulu[1].substring(1))};
      }   
      span.style.color = taulu.splice(1, 1)[0];
      e = taulu.join("");
    }; if(e.indexOf("<br>") !== -1) {
      e = e.split("<br>").join("");
      span.classList.add("lineBreak");
    }; if(e.indexOf("<css>") !== -1) {
      let taulu = e.split("<css>");
      span.style.cssText += taulu.splice(1, 1)[0];
      e = taulu.join("");
    }; if(e.startsWith("$")) {
      let taulu = e.split("!$");
      try {e = eval(taulu[0].substring(1)) + (taulu[1] || "")} 
      catch {console.error("Tuntematon variable:", taulu[0].substring(1))};
    };
    span.textContent = e;
    p.appendChild(span);
  });
  return p;
}

// <fs> <fs> = font size
// <br> = line break
// <css> <css> = raw css
// <c> <c> = color
// $ = variable
// $ !$= variable

// luoGlobalHover("pelaaja", [
//   "<css> color: #f00; font-size: 18px; font-weight: 600; <css> Parannus pullo <br>§ Tyyppi: §Taika<c>#f90<c> <br> § Vahinko: §10 - 50<c>#ffe000<c> <br> § Nopeus: §5s<c>#41ee36<c> <br> § Manan kulutus: §50m<c>#2eb3e0<c> <br> § lisatietoja paina [shift] <c>#4d4d4d<c> <fs>12px<fs>",
//   "Super salainen menu <fs>20px<fs><br>§Elä kerro kenellekkään miten painetaan shiftii",
//   "Super salainen crtl Menu <c>yellow<c> <fs>20px<fs><br>§Elä kerro kenellekkään miten painetaan shiftii",
// ], undefined, ["shiftKey", "ctrlKey"])

luoGlobalHover("luovutaBox", ["Voit lopettaa vuorosi <br> § painamalla tätä nappia"]);
luoGlobalHover("pelaajaHpText", [`
<c>$p.style.fontSize = '15px'<c> § 
<fs>20px<fs><c>#42f55a<c>Pelaajan terveyspisteet <br> § 
<br> Mittari kertoo paljon sinä voit vielä §  
<br> ottaa iskuja vastaan ennen §  
<br> kuin kuolet. Jos elämäpisteesi §  
<br> menevät nollaan häviät taistelun § 
• Maksimi kapasiteetti §$pelaaja.laskeMaxHp()!$hp <css>font-weight: 700<css><c>#42f55a<c> <br>§ 
• Sinulla on §$pelaaja.laskeHp()!$hp <css>font-weight: 700<css><c>$pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.85 ? '#34eb4c' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.5 ? '#e5eb34' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.25 ? '#eba834' : '#eb3434'<c> <br>§ 
• Jäljellä §$(pelaaja.laskeHp() / pelaaja.laskeMaxHp() * 100).toFixed(1)!$% <c>$pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.85 ? '#34eb4c' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.5 ? '#e5eb34' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.25 ? '#eba834' : '#eb3434'<c>  <css>font-weight: 700<css> <br> § 
[SHIFT] piilota menu <fs>12px<fs><c>yellow<c>`], ["e.shiftKey == false"]);
luoGlobalHover("pelaajaMpText", [`
<c>$p.style.fontSize = '15px'<c> § 
<fs>20px<fs><c>#34b4eb<c>Pelaajan taikamittari <br> §  
<br> Mittari kertoo paljon pelaaja voit §  <br> käyttää manaa vaativia tavaroita. §  
Mana kerääntyy takaisin itsestään <br>§ 
• Sinun mana kerääntyy §$pelaaja.manaRegen!$m/s <br> <css>font-weight: 700<css>  <c>#34b4eb<c> § 
• Maksimi kapasiteetti § §$pelaaja.laskeMaxMp()!$mp <css>font-weight: 700<css><c>#34b4eb<c> <br>§ 
• Sinulla on  § §$pelaaja.laskeMp()!$mp <css>font-weight: 700<css><c>$pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.85 ? '#34b4eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.5 ? '#9f34eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.25 ? '#eb34b4' : '#eb3434'<c> <br>§ 
• Jäljellä §$(pelaaja.laskeMp() / pelaaja.laskeMaxMp() * 100).toFixed(1)!$% <c>$pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.85 ? '#34b4eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.5 ? '#9f34eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.25 ? '#eb34b4' : '#eb3434'<c>  <css>font-weight: 700<css> <br>§ 
[SHIFT] piilota menu <fs>12px<fs><c>yellow<c>`], ["e.shiftKey == false"]);