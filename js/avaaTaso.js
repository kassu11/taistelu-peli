let taisteltavatViholliset, pelaajanAseNum = 0;
avaaTaso(tasot.taso1);
function avaaTaso(tasoTieto) {
  $("taisteluRuutu").style.display = "block";
  taisteltavatViholliset = JSON.parse(JSON.stringify(tasoTieto));
  
  paivitaPelaajanHotbar();

  $("viholliset").textContent = "";
  taisteltavatViholliset.forEach((vihu, index) => {
    $("viholliset").innerHTML += 
    `<div id = "vihollinen${index}" class = "vihollinen ${vihu.harvinaisuus}" onclick = "pelaajaHyokkaa(${index})">
      <div class = "hpbg">
        <div id = "vihollisen${index}Hp1" class = "vihollisenHp1"></div>
        <div id = "vihollisen${index}Hp2" class = "vihollisenHp2"></div>
        <p id = "vihu${index}HpText" class = "vihuHpText">${vihu.hp}/${vihu.hp}</p>
        <p class = "vihuHpText2">HP</p>
      </div>
      <div class = "mpbg">
        <div id = "vihollisen${index}Mp1" class = "vihollisenMp1"></div>
        <div id = "vihollisen${index}Mp2" class = "vihollisenMp2"></div>
        <p id = "vihu${index}MpText" class = "vihuMpText">${vihu.mp}/${vihu.mp}</p>
        <p class = "vihuMpText2">MP</p>
      </div>
      <div class = "vihuNumeroContainer">
        <div class = "vihunNumeroBg">
          <p id = "vihu${index}Numero">${"0".repeat(3 - vihu.id.length)}${vihu.id}</p>
        </div>
      </div>
      <div class = "vihollisenKuva">
        <img src = "${vihu.kuva}" style = "margin-left:${vihu.kuvaLeft}; top:${vihu.kuvaTop}; width:${vihu.kuvaWidth}; height:${vihu.kuvaHeight};">
      </div>
      <div class = "vihollisenNimiBox">
        <p>${vihu.nimi}</p>
      </div>
    </div>`;
  });
};
