for(let i = 0; i < 5; i++) {
  const slotBox = document.querySelector("#figtingScreen .playerBox .hotbarBox");
  slotBox.innerHTML += `
  <div class="slot">
    <p class="slotNumber">${i + 1}</p>
    <img src="" class="slotImage">
    <p class="itemAmount"></p>
  </div>`
}

updatePlayersHotbar();

startLevel("level_1");


function startLevel(lvlId) {
  currentLevel.id = lvlId;
  const selectedLevel = levels[lvlId];
  const currentEnemies = selectedLevel.enemys?.map(name => new Enemy(enemies[name]));
  currentEnemies?.forEach(enemy => addEnemyCard(enemy));
}

function addEnemyCard(enemy) {
  const box = document.querySelector(".enemyContainer .enemyBox");

  const enemyCard = document.createElement("div");
  enemyCard.classList = "enemyCard";
  enemyCard.innerHTML = `
  <div class="hpBox">
    <div class="hpBG1"></div>
    <div class="hpBG2"></div>
    <p class="hpText">${enemy.hp}/${enemy.maxHp}</p>
    <p class="hpInfoText">HP</p>
  </div>
  <div class="mpBox">
    <div class="mpBG1"></div>
    <div class="mpBG2"></div>
    <p class="mpText">${enemy.mp}/${enemy.maxMp}</p>
    <p class="mpInfoText">MP</p>
  </div>
  <div class="enemyImageBox">
    <img src="${enemy.img ? "./images/" + enemy.img : ''}">
  </div>
  <div class="enemyLvlContainer">
    <div class="lvlBox">
      <p class="lvlText">${enemy.lvl ?? ""}</p>
    </div>
  </div>`

  if(enemy.imgLeft) enemyCard.querySelector("img").style.left = `calc(50% + ${enemy.imgLeft}px)`;
  if(enemy.imgTop) enemyCard.querySelector("img").style.top = `calc(50% + ${enemy.imgTop}px)`;
  if(enemy.imgWidth) enemyCard.querySelector("img").style.width = enemy.imgWidth + "px";
  if(enemy.imgHeight) enemyCard.querySelector("img").style.height = enemy.imgHeight + "px";

  box.append(enemyCard)

  currentLevel.enemies.set(enemyCard, enemy);
}

document.querySelector(".enemyContainer .enemyBox").addEventListener("click", e => {
  let target = e.target;
  while(!target.classList.contains("enemyCard")) {
    target = target?.parentElement;
    if(target.classList.contains("enemyContainer") || target == null) return;
  } 
  const item = player.hotbar[player.currentSlot];
  const enemy = currentLevel.enemies.get(target);
  if(item.id == null || enemy?.hp == null || currentLevel.enemyRounds > 0) return;
  
  currentLevel.enemyRounds = item.useTime ?? 1;
  currentLevel.roundNum += 1;
  document.querySelector("#figtingScreen #roundNumber").textContent = currentLevel.roundNum;

  const dmg = item.calcDamage().meleDmg;
  enemy.hp -= dmg;

  if(item.particle) playersBattleParciles({x: e.x, y: e.y}, item.particle);
  playersBattleParciles({x: e.x, y: e.y, dmg}, "meleDmg");

  target.style.animationName = 'none';
  target.offsetHeight; /* trigger reflow */
  target.style.animationName = "shake" + random(0, 9);
  
  updateEnemyCard(target);
  
  if(enemy.hp <= 0) {
    removeElement(target, 2500);
    
    currentLevel.enemies.delete(target);

    target.classList.add("deathAnimation");
    target.style.animationName = "deathAnimation";
    setTimeout(startEnemyTurn, 1900);
  } else startEnemyTurn();  
});

function updateEnemyCard(target) {
  const enemy = currentLevel.enemies.get(target);
  if(enemy?.id == null) return;

  const hpPercentage = Math.max(enemy.hp / enemy.maxHp, 0) * 100;
  const mpPercentage = Math.max(enemy.mp / enemy.maxMp, 0) * 100;

  target.querySelector(".hpText").textContent = enemy.hp + "/" + enemy.maxHp;
  target.querySelector(".mpText").textContent = enemy.mp + "/" + enemy.maxMp;

  target.querySelector(".hpBG1").style.width = hpPercentage + "%";
  target.querySelector(".hpBG2").style.width = hpPercentage + "%";
  target.querySelector(".mpBG1").style.width = mpPercentage + "%";
  target.querySelector(".mpBG2").style.width = mpPercentage + "%";
}

function updatePlayerBars() {
  const target = document.querySelector("#figtingScreen .playerBox");
  const hpPercentage = Math.max(player.hp / player.maxHp, 0) * 100;
  const mpPercentage = Math.max(player.mp / player.maxMp, 0) * 100;

  target.querySelector(".hpText").textContent = player.hp + "/" + player.maxHp;
  target.querySelector(".mpText").textContent = player.mp + "/" + player.maxMp;

  target.querySelector(".hpBG1").style.width = hpPercentage + "%";
  target.querySelector(".hpBG2").style.width = hpPercentage + "%";
  target.querySelector(".mpBG1").style.width = mpPercentage + "%";
  target.querySelector(".mpBG2").style.width = mpPercentage + "%";
}

async function startEnemyTurn() {
  await sleep(200);
  document.querySelector("#figtingScreen").classList.add("enemyTurn");
  while(currentLevel.enemyRounds > 0) {
    await sleep(350);
    for(const [card, enemy] of currentLevel.enemies) {
      const results = countAllEnemyMoves(currentLevel.enemyRounds, enemy);
      const {left, width, bottom} = card.getBoundingClientRect();
      const hotbarHeight = document.querySelector("#figtingScreen .playerBox .hotbarBox").getBoundingClientRect().height;
      const cardLeft = window.innerWidth / 2 - left - width / 2;
      const cardTop = window.innerHeight - bottom - hotbarHeight / 2;
      const item = enemy.items[results.bestDmgMoves[0]];

      card.classList.add("enemyAttacks");

      await sleep(300);
      card.style.left = cardLeft + "px";
      card.style.top = cardTop + "px";

      const dmg = item?.calcDamage().meleDmg;

      player.hp -= dmg ?? 0;
      if(dmg) updatePlayerBars();

      setTimeout(e => {
        card.style.left = null;
        card.style.top = null;
      }, 150);
      setTimeout(e => card.classList.remove("enemyAttacks"), 350);

      await sleep(300);
    }
    currentLevel.roundNum += 1;
    document.querySelector("#figtingScreen #roundNumber").textContent = currentLevel.roundNum;
    currentLevel.enemyRounds--;
  };
  document.querySelector("#figtingScreen").classList.remove("enemyTurn");
}

function countAllEnemyMoves(numberOfMoves, enemy) {
  const itemsNum = enemy.items.length;
  const allMovesArray = [new Array(numberOfMoves).fill(0)];
  const numbersOfIteration = Math.min(itemsNum ** numberOfMoves - 1, 1000);
  const bestResults = {
    "bestDmgMoves": [],
    "bestDmgNum": 0,
    // "bestHpMoves": [],
    // "bestHpNum": 0
  }

  for(let i = 0; i < numbersOfIteration; i++) {
    const lastMove = allMovesArray.slice(-1)[0].map(e => e);
    for(let j = 0; j < lastMove.length; j++) {
      if(lastMove[j] == itemsNum - 1) {
        if(lastMove[j + 1] == itemsNum - 1) continue;
        lastMove[j] = 0;
        if(lastMove[j + 1] != null) lastMove[j + 1]++
      } else lastMove[j]++;
      allMovesArray.push(lastMove);
      break;
    }
  }

  for(const moves of allMovesArray) {
    const nEnemy = new Enemy(enemy);
    let dmg = 0;
    for(let move of moves) {
      const item = nEnemy.items[move] ?? {};
      if(!item?.id) break;

      dmg += item.calcDamage().meleDmg;

      if(dmg > bestResults.bestDmgNum) {
        bestResults.bestDmgMoves = moves;
        bestResults.bestDmgNum = dmg;
      }
    }
  }

  return bestResults
}

window.addEventListener("keydown", e => {
  if(e.code.startsWith("Digit") || e.code.startsWith("Numpad")) {
    const keyNumber = +e.code.replace("Digit", "").replace("Numpad", "");

    if(keyNumber > 0 && keyNumber < 6) player.currentSlot = "slot" + keyNumber;
    updatePlayersHotbar();
  }
});

function updatePlayersHotbar() {
  const hotbarSlots = document.querySelectorAll("#figtingScreen .playerBox .centerContainer .slot");

  hotbarSlots.forEach((slot, index) => {
    const slotName = "slot" + (index + 1);
    const item = player.hotbar[slotName];
    const imgSrc = "./images/" + item.image;
    slot.querySelector("img").src = item.image ? imgSrc : "";
    slot.querySelector(".itemAmount").textContent = item.amount ?? "";
    if(player.currentSlot == slotName) slot.classList.add("selected");
    else slot.classList.remove("selected");
  });
}