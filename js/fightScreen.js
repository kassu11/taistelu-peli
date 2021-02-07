function updateHotbarHovers() {
  const slotBox = document.querySelector("#figtingScreen .playerBox .hotbarBox");
  slotBox.innerHTML = "";
  for(let i = 0; i < 5; i++) {
    slotBox.innerHTML += `
    <div class="slot">
      <p class="slotNumber">${i + 1}</p>
      <img src="" class="slotImage">
      <p class="itemAmount"></p>
    </div>`
  }

  Array.from(slotBox.querySelectorAll(".slot")).forEach((currentSlot, i) => {
    addHover(currentSlot, [player.hotbar["slot" + (i + 1)].hoverText?.() ?? ""], []);
  });

  updatePlayersHotbar();
}

startLevel("level_1");

function startLevel(lvlId, time) {
  updateHotbarHovers();
  currentLevel.id = lvlId;
  currentLevel.enemies.clear();
  currentLevel.roundNum = 0;
  currentLevel.enemyRounds = 0;
  document.querySelector("#figtingScreen .enemyBox").innerHTML = "";
  const selectedLevel = levels[lvlId];
  const currentEnemies = selectedLevel.enemys?.map(name => new Enemy(enemies[name]));
  for(const i in currentEnemies) {
    if(time == null) addEnemyCard(currentEnemies[i]);
    else addEnemyCard(currentEnemies[i], time * i);
  }
}

function addEnemyCard(enemy, time) {
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
  </div>
  <div class="effectContainer">
    <div class="effectBox"></div>
  </div>`

  if(enemy.imgLeft) enemyCard.querySelector("img").style.left = `calc(50% + ${enemy.imgLeft}px)`;
  if(enemy.imgTop) enemyCard.querySelector("img").style.top = `calc(50% + ${enemy.imgTop}px)`;
  if(enemy.imgWidth) enemyCard.querySelector("img").style.width = enemy.imgWidth + "px";
  if(enemy.imgHeight) enemyCard.querySelector("img").style.height = enemy.imgHeight + "px";

  box.append(enemyCard);
  if(time != null) {
    enemyCard.classList.add("creatingAnimation");
    enemyCard.style.animationDelay = time + "ms";
    setTimeout(() => {
      enemyCard.classList.remove("creatingAnimation")
      enemyCard.style.animationDelay = null;
    }, time + 200);
  } currentLevel.enemies.set(enemyCard, enemy);
  updateEnemyCard(enemyCard);
}

document.querySelector("#figtingScreen .endFightBox").addEventListener("click", () => {
  player.hp = 0;
  document.querySelector("#figthEndScreen").classList = "defeat";
});

document.querySelector("#figtingScreen .skipRoundBox").addEventListener("click", () => {
  if(currentLevel.enemyRounds !== 0) return;
  currentLevel.enemyRounds = 1;
  startEnemyTurn();
});

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
  currentLevel.enemies.forEach(e => e.effects = e.effects?.filter(ef => --ef.duration > 0) || []);
  document.querySelector("#figtingScreen #roundNumber").textContent = currentLevel.roundNum;

  const dmg = item.calcDamage().meleDmg;
  enemy.hp -= dmg;

  if(item.particle) AddBattleParciles({x: e.x, y: e.y}, item.particle);
  AddBattleParciles({x: e.x, y: e.y, dmg}, "meleDmg");

  target.style.animationName = 'none';
  target.offsetHeight; /* trigger reflow */
  target.style.animationName = "shake" + random(0, 9);

  updateHotbarHovers();
  currentLevel.enemies.forEach((enemy, card) => updateEnemyCard(card));
  updateEffectHovers();
  
  if(enemy.hp <= 0) {
    removeElement(target, 2500);
    currentLevel.enemies.delete(target);
    target.classList.add("deathAnimation");
    target.style.animationName = "deathAnimation";
    if(currentLevel.enemies.size == 0) {
      setTimeout(() => document.querySelector("#figthEndScreen").classList = "victory", 1900)
    } else setTimeout(startEnemyTurn, 1900);
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

  target.querySelector(".effectContainer .effectBox").innerHTML = "";
  enemy.effects.forEach((effect, index) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = effect.img ?? "";
    const p = document.createElement("p");
    p.textContent = effect.duration;
    div.append(img, p);

    let text = `<c>yellow<c>${effect.title} <f>20px<f> § \n •  Effect lasts ${effect.duration} rounds`;


    addHover([div, "enemyEffect", `${index}§${effect.title}§${effect.duration}`], text);
    target.querySelector(".effectContainer .effectBox").append(div);
  });
}

function updateEffectHovers() {
  const hover = document.querySelector("#hoverBox div");
  const enemyValues = hover?.getAttribute("enemyEffect");
  if(hover == null || enemyValues == null) return;
  hover.style.display = "none";

  if(enemyValues) {
    const [index, title, duration] = enemyValues.split("§");

    for(const [card, enemy] of currentLevel.enemies) {
      const effect = enemy.effects[+index];
      console.log(effect)
      if(effect?.title == title && effect?.title == duration) {
        hover.style.display = null;
        return;
      }
    }
    window.onkeydown = null;
    window.onkeyup = null;
  }
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
      const playerBox = document.querySelector("#figtingScreen .playerBox")
      const results = countAllEnemyMoves(currentLevel.enemyRounds, enemy);
      const {left, width, bottom} = card.getBoundingClientRect();
      const {height: hotbarHeight, width: hotbarWidth} = playerBox.querySelector(".hotbarBox").getBoundingClientRect();
      const cardLeft = window.innerWidth / 2 - left - width / 2,
            cardLeftoffset = random(0, hotbarWidth - 250) - (hotbarWidth - 250) / 2;
      const cardTop = window.innerHeight - bottom - hotbarHeight / 2,
            cardTopOffset = random(-hotbarHeight / 3, hotbarHeight / 3);
      const item = enemy.items[results.bestDmgMoves[0]] ?? new Item(items["wooden_sword"], enemy);

      card.classList.add("enemyAttacks");

      await sleep(300);
      card.style.left = cardLeft + cardLeftoffset + "px";
      card.style.top = cardTop + cardTopOffset + "px";

      item.selfEffect?.forEach(ef => enemy.effect(ef.id, ef.power, ef.duration + 1));

      const dmg = item?.calcDamage().meleDmg;

      player.hp -= dmg ?? 0;
      if(dmg) {
        playerBox.querySelector(".centerContainer").style.animationName = 'none';
        playerBox.querySelector(".centerContainer").offsetHeight; /* trigger reflow */
        playerBox.querySelector(".centerContainer").style.animationName = "hotbarShake" + random(0, 3);

        playerBox.querySelector(".leftContainer").style.animationName = 'none';
        playerBox.querySelector(".leftContainer").offsetHeight; /* trigger reflow */
        playerBox.querySelector(".leftContainer").style.animationName = "playerBarsShake" + random(0, 3);

        playerBox.querySelector(".rightContainer").style.animationName = 'none';
        playerBox.querySelector(".rightContainer").offsetHeight; /* trigger reflow */
        playerBox.querySelector(".rightContainer").style.animationName = "playerBarsShake" + random(0, 3);
      }

      setTimeout(e => {
        const particleX = window.innerWidth / 2 + cardLeftoffset;
        const particleY = window.innerHeight - hotbarHeight / 2 + cardTopOffset;
        card.style.left = null;
        card.style.top = null;
        if(dmg) {
          updatePlayerBars();
          AddBattleParciles({x: particleX, y: particleY - 100, dmg}, "enemyMeleDmg");
        }
        if(item.particle) AddBattleParciles({x: particleX, y: particleY}, item.particle);
      }, 150);
      setTimeout(e => card.classList.remove("enemyAttacks"), 350);

      await sleep(300);

      if(player.hp <= 0) {
        document.querySelector("#figtingScreen").classList.remove("enemyTurn");
        await sleep(500);
        document.querySelector("#figthEndScreen").classList = "defeat";
        return;
      }
    }
    currentLevel.roundNum += 1;
    document.querySelector("#figtingScreen #roundNumber").textContent = currentLevel.roundNum;
    currentLevel.enemies.forEach(e => e.effects = e.effects?.filter(ef => --ef.duration > 0) || []);
    currentLevel.enemies.forEach((enemy, card) => updateEnemyCard(card));
    updateEffectHovers();
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

      nEnemy.effects = nEnemy.effects?.filter(ef => --ef.duration > 0) || [];
      item.selfEffect?.forEach(ef => nEnemy.effect(ef.id, ef.power, ef.duration));
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


document.querySelector("#figtingScreen .playerBox .hotbarBox").addEventListener("click", e => {
  if(!e.target.classList.contains("slot")) return;
  const allSlots = document.querySelectorAll("#figtingScreen .playerBox .slot");
  const index = Array.from(allSlots).indexOf(e.target) + 1;
  player.currentSlot = "slot" + index;
  updatePlayersHotbar();
});

Array.from(document.querySelectorAll("#figthEndScreen .fightButton")).forEach(button => button.addEventListener("click", () => {
  document.querySelector("#figthEndScreen").classList = "hidden";
  document.querySelector("#roundNumber").textContent = 1;
  const levelEnemies = levels[currentLevel.id]?.enemys ?? [];
  player.hp = player.maxHp;
  player.mp = player.maxMp;
  updatePlayerBars();

  if(currentLevel.enemies.size == 0) {
    startLevel(currentLevel.id, 50);
  } else if(levelEnemies.length == currentLevel.enemies.size) {
    startLevel(currentLevel.id);
  } else {
    const enemyCardsArray = Array.from(document.querySelectorAll("#figtingScreen .enemyCard"));
    for(const i in enemyCardsArray) {
      const card = enemyCardsArray[i];
      card.style.animationName = null;
      card.style.animationDelay = i * 50 + "ms";
      card.classList.add("resetAnimation");
    } 
    
    setTimeout(v => startLevel(currentLevel.id, 50), enemyCardsArray.length * 50 + 100);
  }
}));