const hoverBox = document.querySelector("#hoverBox");
const globalHoverHiiri = {x: 0, y: 0};

// let testiTaulu = [
//   "<css> text-shadow: 2px -6px #0014ff; <css> <c>red<c> <fs>30px<fs> Moro miten menee loladasdasd § <c>white<c> miten § <fs>50px<fs> menee<br> <c>blue<c> § <c>white<c> <fs>20px<fs> Kaunis päivä § paiva <fs>50px<fs> <c>red<c>"
// ]
// document.querySelector("popUpDmg").appendChild(luoTextiSyntaxt(testiTaulu[0]));

addHover(".playerBox .hpBox", ["default", "ctrl\n\n\n\nasdasdasdhasdakjsdh", "alt", "shift"], ["ctrlKey", "altKey", "shiftKey"]);
addHover(".playerBox .mpBox", "asdasdasd\nasdasd");

function addHover(target, texts = [], keys = ["default"], logic = "true") {
  const div = document.createElement("div");
  if(Array.isArray(target) && target[1]) div.setAttribute(target[1], target[2] ?? "");
  const borderPaddin = 10;

  if(!Array.isArray(target)) target = [target];
  if(typeof target[0] == "string") target[0] = document.querySelector(target[0]);
  if(typeof texts == "string") texts = [texts];
  if(typeof keys == "string") keys = [keys];
  if(keys.indexOf("default") == -1) keys.unshift("default");

  target[0].addEventListener("mouseenter", mouseEnter);
  target[0].addEventListener("mousemove", mouseMove);
  target[0].addEventListener("mouseout", mouseOut);

  moveHoverBlock();

  function mouseEnter({ctrlKey, altKey, shiftKey}) {
    window.onkeydown = null;
    window.onkeyup = null;
    window.onkeydown = ({ctrlKey, altKey, shiftKey, repeat}) => keyUpAndDown({ctrlKey, altKey, shiftKey, repeat});
    window.onkeyup = ({ctrlKey, altKey, shiftKey, repeat}) => keyUpAndDown({ctrlKey, altKey, shiftKey, repeat});

    hoverBox.innerHTML = "";
    div.innerHTML = "";

    if(ctrlKey) div.append(customTextSyntax(texts[keys.indexOf("ctrlKey")]));
    else if(altKey) div.append(customTextSyntax(texts[keys.indexOf("altKey")]));
    else if(shiftKey) div.append(customTextSyntax(texts[keys.indexOf("shiftKey")]));
    else div.append(customTextSyntax(texts[keys.indexOf("default")]));
    hoverBox.append(div);

    div.style.display = div.querySelector("pre").textContent ? null : "none";
  }

  function keyUpAndDown(keyMetaData) {
    if(keyMetaData.repeat) return;
    div.innerHTML = "";

    for(const key of keys) {
      if(!keyMetaData[key]) continue;
      div.append(customTextSyntax(texts[keys.indexOf(key)]));
    } if(!div.innerHTML) div.append(customTextSyntax(texts[keys.indexOf("default")]));
    div.style.display = div.querySelector("pre").textContent ? null : "none";
    moveHoverBlock();
  }

  function mouseMove({x, y}) {
    globalHoverHiiri.x = x, globalHoverHiiri.y = y;
    moveHoverBlock();
  }

  function moveHoverBlock() {
    const {x, y} = globalHoverHiiri;
    const {height, width} = div.getBoundingClientRect();
    const maxTop = window.innerHeight - height - borderPaddin;
    const maxleft = window.innerWidth - width - borderPaddin;
    div.style.left = Math.min(x + 20, maxleft) + "px";
    div.style.top = Math.min(y, maxTop) + "px";
  }

  function mouseOut() {
    window.onkeydown = null;
    window.onkeyup = null;
    hoverBox.innerHTML = ""
  }
}

function customTextSyntax(syn = "") {
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
      } else if(currentLine.startsWith("<b>")) {
        const [,fontWeight, text=""] = currentLine.split("<b>");
        [lineText] = text.split("<");
        if(line.indexOf("<b>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontWeight = runVariableTest(fontWeight);
        index = line.indexOf("<b>", index + 1);
        if(index == -1) return console.error(`"<b>" has no closing!`);
      } else if(currentLine.startsWith("<cl>")) {
        const [,classList, text=""] = currentLine.split("<cl>");
        [lineText] = text.split("<");
        if(line.indexOf("<cl>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.classList = runVariableTest(classList);
        index = line.indexOf("<cl>", index + 1);
        if(index == -1) return console.error(`"<cl>" has no closing!`);
      } else if(currentLine.startsWith("<ff>")) {
        const [,fontFamily, text=""] = currentLine.split("<ff>");
        [lineText] = text.split("<");
        if(line.indexOf("<ff>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontFamily = runVariableTest(fontFamily);
        index = line.indexOf("<ff>", index + 1);
        if(index == -1) return console.error(`"<ff>" has no closing!`);
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
        console.log(variable)
        console.log(selectedSpan)
        try {lineText = eval(variable) ?? "" + lineText}
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
        try {lineText = eval(variable) ?? "" + lineText}
        catch {return console.error(`"${variable}" is not defined`)}
        index = data.indexOf("<v>", index + 1);
        if(index == -1) return console.error(`"<v>" has no closing!`);
      } finalText += lineText;
      index = data.indexOf("<", index + 1);
    } return finalText;
  }
}

document.__proto__.test = function() {
  console.log("???")
}

// <f><f> = font size
// \n = line break
// <css><css> = raw css
// <c><c> = color
// <v><v> = variable
// <bcss><bcss> = raw css on base pre element
// <cl><cl> = set classlist on span
// <b><b> = fontweight
// <ff><ff> = font-family
// § = new span

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