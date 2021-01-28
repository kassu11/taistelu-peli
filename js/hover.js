const hoverBgBox = document.querySelector("#hoverBox");
const globalHoverHiiri = {x: 0, y: 0};


// let testiTaulu = [
//   "<css> text-shadow: 2px -6px #0014ff; <css> <c>red<c> <fs>30px<fs> Moro miten menee loladasdasd § <c>white<c> miten § <fs>50px<fs> menee<br> <c>blue<c> § <c>white<c> <fs>20px<fs> Kaunis päivä § paiva <fs>50px<fs> <c>red<c>"
// ]
// document.querySelector("popUpDmg").appendChild(luoTextiSyntaxt(testiTaulu[0]));

function luoTextiSyntaxt(syn) {
  let p = document.createElement("pre");
  let text = syn.split("§");
  text.forEach(e => {
    let span = document.createElement("span");
    if(e.indexOf("<fs>") !== -1) {
      let taulu = e.split("<fs>");
      span.style.fontSize = taulu.splice(1, 1)[0];
      e = taulu.join("");
    }; if(e.indexOf("<c>") !== -1) {
      let taulu = e.split("<c>");
      if(taulu[1].startsWith("$")) {
        try {taulu[1] = eval(taulu[1].substring(1))} 
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
    p.append(span);
  });
  return p;
}


function customTextSyntax(syn) {
  const pre = document.createElement("pre");
  const lines = syn.split("§");

  for(const line of lines) {
    const span = document.createElement("span");
    pre.append(span);
    let selectedSpan = span;
    let index = 0;

    do {
      const currentLine = line.substring(index);
      const nspan = document.createElement("span");
      let [lineText] = currentLine.split("<");

      console.log(currentLine.indexOf("\n"));
      
      if(currentLine.startsWith("<c>")) {
        const [,color, text=""] = currentLine.split("<c>");
        [lineText] = text.split("<");
        if(line.indexOf("<c>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.color = runVariableTest(color);
        index = line.indexOf("<c>", index + 1);
        if(index == -1) return console.error(`"<c>" has no closing!`);
      } else if(currentLine.startsWith("<f>")) {
        const [,fontSize, text=""] = currentLine.split("<f>");
        [lineText] = text.split("<");
        if(line.indexOf("<f>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontSize = runVariableTest(fontSize);
        index = line.indexOf("<f>", index + 1);
        if(index == -1) return console.error(`"<f>" has no closing!`);
      } else if(currentLine.startsWith("<css>")) {
        const [,rawCss, text=""] = currentLine.split("<css>");
        [lineText] = text.split("<");
        if(line.indexOf("<css>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.cssText += runVariableTest(rawCss);
        index = line.indexOf("<css>", index + 1);
        if(index == -1) return console.error(`"<css>" has no closing!`);
      } else if(currentLine.startsWith("<bcss>")) {
        const [,rawCss, text=""] = currentLine.split("<bcss>");
        [lineText] = text.split("<");
        pre.style.cssText += runVariableTest(rawCss);
        index = line.indexOf("<bcss>", index + 1);
        if(index == -1) return console.error(`"<bcss>" has no closing!`);
      } else if(currentLine.startsWith("<v>")) {
        const [,variable, text=""] = currentLine.split("<v>");
        [lineText] = text.split("<");
        try {lineText = eval(variable) + lineText}
        catch {return console.error(`"${variable}" is not defined`)}
        index = line.indexOf("<v>", index + 1);
        if(index == -1) return console.error(`"<v>" has no closing!`);
      } selectedSpan.textContent += lineText;
      index = line.indexOf("<", index + 1);
    } while(index !== -1);
  } return pre;

  function runVariableTest(data) {
    if(data.indexOf("<v>") == -1) return data;
    let index = 0;
    let finalText = "";

    while(index !== -1) {
      const currentLine = data.substring(index);
      let [lineText] = currentLine.split("<");
      if(currentLine.startsWith("<v>")) {
        const [,variable, text=""] = currentLine.split("<v>");
        [lineText] = text.split("<");
        try {lineText = eval(variable) + lineText}
        catch {return console.error(`"${variable}" is not defined`)}
        index = data.indexOf("<v>", index + 1);
        if(index == -1) return console.error(`"<v>" has no closing!`);
      } finalText += lineText;
      index = data.indexOf("<", index + 1);
    } return finalText;
  }
}

// hoverBgBox.append(customTextSyntax(`moi<c> red <c><css>position: relative<css> olen kasper <c> <v> 6 > 5 ? "yel" : "blue"<v><v>1 > 0 ? "low" : "green"<v> <c> miten<f>50px<f> menee <c> green <c>lol '
// § olen default teksti <bcss>position: absolute<bcss>ilman väriä
// <v>100 + 10<v> | <v>null ?? 5 <v>
// <css>left:<v>random(0, 9)<v>px<css>`));

// hoverBgBox.append(customTextSyntax(`<c> red <c><f> 30px <f>lol<c> green <c>hei<c> yellow <c>terve`));
// hoverBgBox.append(customTextSyntax(`<c> red <c><f> 30px <f>asdasd asdjasdkl jaskdjkads § asdasdasjh ashdjashd`));
hoverBgBox.append(customTextSyntax(`<c>red<c> <f>24px<f> Your health §
<f>18px<f> Your health represents the amount of hits you can take.
When your health reaches 0 points, you are defeated.
§ - Your maximum health is <c>red<c>
`));

const lol = 5;
let text1 = "<c>$p.style.cssText='font-size:10px'<c> asd<fs>30px<fs> olen teksti asdasd <br> § extra <c>red<c> §"

hoverBgBox.append(luoTextiSyntaxt(text1))

// <f><f> = font size
// \n = line break
// <css><css> = raw css
// <c><c> = color
// <v><v> = variable
// <bcss><bcss> = raw css on base pre element
// § = new span

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

// luoGlobalHover("luovutaBox", ["Voit lopettaa vuorosi <br> § painamalla tätä nappia"]);
// luoGlobalHover("pelaajaHpText", [`
// <c>$p.style.fontSize = '15px'<c> § 
// <fs>20px<fs><c>#42f55a<c>Pelaajan terveyspisteet <br> § 
// <br> Mittari kertoo paljon sinä voit vielä §  
// <br> ottaa iskuja vastaan ennen §  
// <br> kuin kuolet. Jos elämäpisteesi §  
// <br> menevät nollaan häviät taistelun § 
// • Maksimi kapasiteetti §$pelaaja.laskeMaxHp()!$hp <css>font-weight: 700<css><c>#42f55a<c> <br>§ 
// • Sinulla on §$pelaaja.laskeHp()!$hp <css>font-weight: 700<css><c>$pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.85 ? '#34eb4c' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.5 ? '#e5eb34' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.25 ? '#eba834' : '#eb3434'<c> <br>§ 
// • Jäljellä §document.querySelector(pelaaja.laskeHp() / pelaaja.laskeMaxHp() * 100).toFixed(1)!$% <c>$pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.85 ? '#34eb4c' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.5 ? '#e5eb34' : pelaaja.laskeHp() / pelaaja.laskeMaxHp() >= 0.25 ? '#eba834' : '#eb3434'<c>  <css>font-weight: 700<css> <br> § 
// [SHIFT] piilota menu <fs>12px<fs><c>yellow<c>`], ["e.shiftKey == false"]);
// luoGlobalHover("pelaajaMpText", [`
// <c>$p.style.fontSize = '15px'<c> § 
// <fs>20px<fs><c>#34b4eb<c>Pelaajan taikamittari <br> §  
// <br> Mittari kertoo paljon pelaaja voit §  <br> käyttää manaa vaativia tavaroita. §  
// Mana kerääntyy takaisin itsestään <br>§ 
// • Sinun mana kerääntyy §$pelaaja.manaRegen!$m/s <br> <css>font-weight: 700<css>  <c>#34b4eb<c> § 
// • Maksimi kapasiteetti § §$pelaaja.laskeMaxMp()!$mp <css>font-weight: 700<css><c>#34b4eb<c> <br>§ 
// • Sinulla on  § §$pelaaja.laskeMp()!$mp <css>font-weight: 700<css><c>$pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.85 ? '#34b4eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.5 ? '#9f34eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.25 ? '#eb34b4' : '#eb3434'<c> <br>§ 
// • Jäljellä §document.querySelector(pelaaja.laskeMp() / pelaaja.laskeMaxMp() * 100).toFixed(1)!$% <c>$pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.85 ? '#34b4eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.5 ? '#9f34eb' : pelaaja.laskeMp() / pelaaja.laskeMaxMp() >= 0.25 ? '#eb34b4' : '#eb3434'<c>  <css>font-weight: 700<css> <br>§ 
// [SHIFT] piilota menu <fs>12px<fs><c>yellow<c>`], ["e.shiftKey == false"]);