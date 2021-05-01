const figtingScreen = document.querySelector("#figtingScreen");

function updateHotbarHovers() {
  const slotBox = figtingScreen.querySelector(".playerBox .hotbarBox");
  slotBox.innerHTML = "";
  for(let i = 0; i < 5; i++) {
    slotBox.innerHTML += `
    <div class="slot">
      <p class="slotNumber">${i + 1}</p>
      <img src="" class="slotImage">
      <p class="itemAmount"></p>
    </div>`
  }

  slotBox.querySelectorAll(".slot").forEach((currentSlot, i) => {
    addHover(currentSlot, [player.hotbar["slot" + (i + 1)].hoverText?.() ?? ""], []);
  });

  updatePlayersHotbar();
}

// startLevel("level_5"); // <-- poista myöhemmin

function startLevel(lvlId, time) {
  player.hp = player.maxHpF();
  player.mp = player.maxMp;
  if(!(time > 0)) player.effects = [];
  figtingScreen.querySelectorAll(".playerBox > div").forEach(container => container.style = null);
  Array.from(figtingScreen.querySelector("#victoryDrop").children).forEach(e => removeElement(e, 400));
  updateHotbarHovers();
  updatePlayerBars();
  updatePlayerEffectBox();
  document.querySelector("#figthEndScreen").classList = "hidden"
  document.body.classList = "figtingMode";
  currentLevel.id = lvlId;
  currentLevel.enemies.clear();
  currentLevel.roundNum = 1;
  currentLevel.enemyRounds = 0;
  currentLevel.drops = [];
  figtingScreen.querySelector(".enemyBox").innerHTML = "";
  const selectedLevel = levels[lvlId];
  const currentEnemies = selectedLevel.enemies?.map(name => new Enemy(enemies[name]));
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

figtingScreen.querySelector(".endFightBox").addEventListener("click", () => {
  document.querySelector("#figthEndScreen").classList = "defeat";
  player.hp = 0;
});

figtingScreen.querySelector(".skipRoundBox").addEventListener("click", () => {
  if(currentLevel.enemyRounds !== 0) return;
  currentLevel.enemyRounds = 1;
  giveEffectsToPlAndEn();
  updateNextRound();
  startEnemyTurn();
});

document.querySelector(".enemyContainer").addEventListener("click", e => {
  const item = player.hotbar[player.currentSlot];
  const target = findParentElementWithClass(e.target, "enemyCard");
  const enemy = !item.needTarget ? {} : currentLevel.enemies.get(target);
  
  if(!item.needTarget) {
    if(currentLevel.enemyRounds > 0) return;
  } else if(item.id == null || enemy?.hp == null || currentLevel.enemyRounds > 0) return;
  if(item.mana > player.mp || !("id" in item)) return;

  giveEffectsToPlAndEn();
  
  currentLevel.enemyRounds = item.useTime ?? 1;
  
  if(item.needTarget) item.giveEffect?.forEach(ef => enemy.effect(ef.id, ef.power, ef.duration + 1));
  const dmg = item.calcDamage().meleDmg;
  enemy.hp -= dmg;
  
  item.selfEffect?.forEach(ef => player.effect(ef.id, ef.power, ef.duration + 1));
  if(item.mana) player.mp -= item.mana;
  if(item.healV) player.hp = Math.min(player.hp + item.healV, player.maxHpF());
  if(item.needTarget) addPlayerItemUseParticle(target, item.particle, {x: e.x, y: e.y, dmg}); 
  if(item.amount && --item.amount <= 0) {
    const index = player.inventory.findIndex(e => e.slot == item.slot);
    if(index != -1) player.inventory.splice(index, 1);
    player.hotbar[player.currentSlot] = {};
  }

  updateNextRound();
  if(enemy.hp <= 0) {
    removeDeadEnemy(target, enemy);
    if(currentLevel.enemies.size == 0) playerWonTheBattle();
    else setTimeout(startEnemyTurn, 1900);
  } else startEnemyTurn();  
});

function findParentElementWithClass(elem, text) {
  let current = elem;
  while(true) {
    if(current == null || current?.classList.contains(text)) return current;
    current = current.parentElement;
  }
}

function addPlayerItemUseParticle(target, particle, {x, y, dmg}) {
  if(particle) AddBattleParciles({x, y}, particle);
  AddBattleParciles({x, y, dmg}, "meleDmg");
  target.style.animationName = 'none';
  target.offsetHeight; /* trigger reflow */
  target.style.animationName = "shake" + random(0, 9);
}

function updateNextRound() {
  currentLevel.enemies.forEach(e => e.effects = e.effects?.filter(ef => --ef.duration > 0) || []);
  player.effects = player.effects?.filter(ef => --ef.duration > 0) || [];

  currentLevel.roundNum += 1;
  figtingScreen.querySelector("#roundNumber").textContent = currentLevel.roundNum;

  currentLevel.enemies.forEach((enemy, card) => updateEnemyCard(card));
  updateHotbarHovers();
  updateEffectHovers();
  updatePlayerBars();
  updatePlayerEffectBox();
}

function removeDeadEnemy(target, enemy) {
  removeElement(target, 2500);
  currentLevel.enemies.delete(target);
  target.classList.add("deathAnimation");
  target.style.animationName = "deathAnimation";

  enemy.drops?.forEach(({items = {}, chance, amount}) => {
    const itemArray = Array.isArray(items) ? items : [items];
    if(Math.random() <= chance) {
      itemArray.forEach(oneItem => {
        if(!("id" in oneItem)) return;
        const nItem = new Item(oneItem);
        const amount2 = converArrayOfNumbers(amount);
        const index = itemStackIndex(currentLevel.drops, nItem);
        if(amount2 && "amount" in nItem) nItem.amount = amount2;
        if(index == -1) currentLevel.drops.push(nItem);
        else currentLevel.drops[index].amount += nItem.amount;
      }
    )};
  });
}

function playerWonTheBattle() {
  setTimeout(() => document.querySelector("#figthEndScreen").classList = "victory", 1900);
  currentLevel.drops.forEach(item => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const p = document.createElement("p");

    div.classList.add("victorySlot");
    if(item.image) img.src = "./images/" + item.image;
    if(item.amount) p.textContent = item.amount;
    div.append(img, p)
    figtingScreen.querySelector("#victoryDrop").append(div);
    givePlayerItem(item);
    addHover(div, item.hoverText() ?? "");
  });
}

function converArrayOfNumbers(arr) {
  if(Number.isInteger(arr)) return arr;
  if(!Array.isArray(arr)) return null;
  if(arr.length == 2) return random(...arr);
  return arr[random(arr.length - 1)];
}

function itemStackIndex(arr, item) {
  if(!("amount" in item)) return -1;
  if(Array.isArray(arr)) return arr.findIndex(v => v.id == item.id);
  return -1;
}

function givePlayerItem(itemData) {
  const item = new Item(itemData);
  const index = itemStackIndex(player.inventory, item);
  if(index == -1) player.inventory.push(item);
  else player.inventory[index].amount += item.amount;
}

function updateEnemyCard(target) {
  const enemy = currentLevel.enemies.get(target);
  if(enemy?.id == null) return;

  const hpPercentage = Math.max(enemy.hp / enemy.maxHp, 0) * 100;
  const mpPercentage = Math.max(enemy.mp / enemy.maxMp, 0) * 100;
  const hpDirection = +target.querySelector(".hpBG1").style.width.slice(0, -1) - hpPercentage;
  const mpDirection = +target.querySelector(".mpBG1").style.width.slice(0, -1) - mpPercentage;

  target.querySelector(".hpText").textContent = enemy.hp + "/" + enemy.maxHp;
  target.querySelector(".mpText").textContent = enemy.mp + "/" + enemy.maxMp;

  target.querySelector(".hpBG1").style.width = hpPercentage + "%";
  target.querySelector(".hpBG2").style.width = hpPercentage + "%";
  target.querySelector(".mpBG1").style.width = mpPercentage + "%";
  target.querySelector(".mpBG2").style.width = mpPercentage + "%";

  if(hpDirection < 0) target.querySelector(".hpBox").classList = "hpBox reverse";
  else if(hpDirection > 0) target.querySelector(".hpBox").classList = "hpBox forward";
  if(mpDirection < 0) target.querySelector(".mpBox").classList = "mpBox reverse";
  else if(mpDirection > 0) target.querySelector(".mpBox").classList = "mpBox forward";

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

function updatePlayerEffectBox() {
  figtingScreen.querySelector(".playerBox .centerContainer .effectBox").innerHTML = "";
  player.effects.forEach((effect, index) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    if(effect.img) img.src = effect.img;
    const p = document.createElement("p");
    p.textContent = effect.duration;
    div.append(img, p);

    let text = `<c>yellow<c>${effect.title} <f>20px<f> § \n •  Effect lasts ${effect.duration} rounds`;

    addHover([div, "playerEffect", `${index}§${effect.title}§${effect.duration}`], text);
    figtingScreen.querySelector(".playerBox .centerContainer .effectBox").append(div);
  });
}

function updateEffectHovers() {
  const hover = document.querySelector("#hoverBox div");
  const enemyValues = hover?.getAttribute("enemyEffect");
  const playerValues = hover?.getAttribute("playerEffect");
  if(hover == null || (enemyValues == null && playerValues == null)) return;
  hover.style.display = "none";

  if(enemyValues) {
    const [index, title, duration] = enemyValues.split("§");

    for(const [card, enemy] of currentLevel.enemies) {
      const effect = enemy.effects[+index];
      if(effect?.title == title && effect?.duration == duration) {
        hover.style.display = null;
        return;
      }
    }
    window.onkeydown = null;
    window.onkeyup = null;
  } else if(playerValues) {
    const [index, title, duration] = playerValues.split("§");

    const effect = player.effects[+index];
    if(effect?.title == title && effect?.duration == duration) {
      hover.style.display = null;
      return;
    }
    
    window.onkeydown = null;
    window.onkeyup = null;
  }
}

function updatePlayerBars() {
  const target = figtingScreen.querySelector(".playerBox");
  const hpPercentage = Math.max(player.hp / player.maxHpF(), 0) * 100;
  const mpPercentage = Math.max(player.mp / player.maxMp, 0) * 100;
  const hpDirection = +target.querySelector(".hpBG1").style.width.slice(0, -1) - hpPercentage;
  const mpDirection = +target.querySelector(".mpBG1").style.width.slice(0, -1) - mpPercentage;

  target.querySelector(".hpText").textContent = player.hp + "/" + player.maxHpF();
  target.querySelector(".mpText").textContent = player.mp + "/" + player.maxMp;

  target.querySelector(".hpBG1").style.width = hpPercentage + "%";
  target.querySelector(".hpBG2").style.width = hpPercentage + "%";
  target.querySelector(".mpBG1").style.width = mpPercentage + "%";
  target.querySelector(".mpBG2").style.width = mpPercentage + "%";

  if(hpDirection < 0) target.querySelector(".hpBox").classList = "hpBox reverse";
  else if(hpDirection > 0) target.querySelector(".hpBox").classList = "hpBox forward";
  if(mpDirection < 0) target.querySelector(".mpBox").classList = "mpBox reverse";
  else if(mpDirection > 0) target.querySelector(".mpBox").classList = "mpBox forward";
}

async function startEnemyTurn() {
  await sleep(200);
  figtingScreen.classList.add("enemyTurn");
  while(currentLevel.enemyRounds > 0) {
    await sleep(350);
    for(const [card, enemy] of currentLevel.enemies) {
      const results = countAllEnemyMoves(currentLevel.enemyRounds, enemy);
      const item = enemy.items[reduceBestItemIndexForEnemy(enemy, results)] ?? new Item(items["wooden_sword"], enemy);

      card.classList.add("enemyAttacks");

      await sleep(300);

      item.selfEffect?.forEach(ef => enemy.effect(ef.id, ef.power, ef.duration + 1));
      const dmg = item?.calcDamage().meleDmg;
      player.hp -= dmg ?? 0;
      
      if(item.healV) enemy.hp = Math.min(enemy.hp + item.healV, enemy.maxHp);
      if(dmg) enemyTurnAnimations("attack", card, dmg, item);
      if(item.amount && --item.amount <= 0) enemy.items.splice(results.bestDmgMoves[0], 1);
      if(item.mana) enemy.mp -= item.mana;

      updateEnemyCard(card);
      setTimeout(e => card.classList.remove("enemyAttacks"), 350);

      await sleep(300);
      if(player.hp <= 0) {
        figtingScreen.classList.remove("enemyTurn");
        await sleep(500);
        document.querySelector("#figthEndScreen").classList = "defeat";
        return;
      }
    }
    giveEffectsToPlAndEn();
    updateNextRound();
    currentLevel.enemyRounds--;
  };
  document.querySelector("#figtingScreen").classList.remove("enemyTurn");
}

function reduceBestItemIndexForEnemy(enemy, allMoves) {
  const maxPlDmg = Object.values(player.hotbar).reduce((ac, item) => Math.max(ac, item.calcDamage?.().maxMeleDmg ?? 0), 0);
  if(maxPlDmg >= enemy.hp) {
    const hpIndex = allMoves.bestHpMoves[0];
    if(enemy.items[hpIndex]?.healV * currentLevel.enemyRounds + enemy.hp > maxPlDmg) return hpIndex
  } return allMoves.bestDmgMoves[0];
}

function enemyTurnAnimations(type, card, dmg, item) {
  if(type == "attack") {
    const playerBox = figtingScreen.querySelector(".playerBox");
    const {left, width, bottom} = card.getBoundingClientRect();
    const {height: hotbarHeight, width: hotbarWidth} = playerBox.querySelector(".hotbarBox").getBoundingClientRect();
    const cardLeft = window.innerWidth / 2 - left - width / 2,
          cardLeftoffset = random(0, hotbarWidth - 250) - (hotbarWidth - 250) / 2;
    const cardTop = window.innerHeight - bottom - hotbarHeight / 2,
          cardTopOffset = random(-hotbarHeight / 3, hotbarHeight / 3);

    playerBox.querySelector(".centerContainer").style.animationName = 'none';
    playerBox.querySelector(".centerContainer").offsetHeight; /* trigger reflow */
    playerBox.querySelector(".centerContainer").style.animationName = "hotbarShake" + random(0, 3);

    playerBox.querySelector(".leftContainer").style.animationName = 'none';
    playerBox.querySelector(".leftContainer").offsetHeight; /* trigger reflow */
    playerBox.querySelector(".leftContainer").style.animationName = "playerBarsShake" + random(0, 3);

    playerBox.querySelector(".rightContainer").style.animationName = 'none';
    playerBox.querySelector(".rightContainer").offsetHeight; /* trigger reflow */
    playerBox.querySelector(".rightContainer").style.animationName = "playerBarsShake" + random(0, 3);

    card.style.left = cardLeft + cardLeftoffset + "px";
    card.style.top = cardTop + cardTopOffset + "px";

    setTimeout(e => {
      const particleX = window.innerWidth / 2 + cardLeftoffset;
      const particleY = window.innerHeight - hotbarHeight / 2 + cardTopOffset;
      card.style.left = null;
      card.style.top = null;
      if(item.particle) AddBattleParciles({x: particleX, y: particleY}, item.particle);
      if(dmg) {
        updatePlayerBars();
        AddBattleParciles({x: particleX, y: particleY - 100, dmg}, "enemyMeleDmg");
      }
    }, 150);
  }
}

function countAllEnemyMoves(numberOfMoves, enemy) {
  const itemsNum = enemy.items.length;
  const allMovesArray = numberGrid(itemsNum, numberOfMoves);
  const bestResults = {
    "bestDmgMoves": [],
    "bestDmgNum": 0,
    "bestHpMoves": [],
    "bestHpNum": 0
  }

  for(const moves of allMovesArray) {
    const nEnemy = new Enemy(enemy);
    let dmg = 0;
    let hp = 0;
    for(let move of moves) {
      const item = nEnemy.items[move] ?? {};
      if(!item?.id) break;
      if(item.mana > nEnemy.mp) break;

      nEnemy.mp -= item.mana ?? 0;
      nEnemy.effects = nEnemy.effects?.filter(ef => --ef.duration > 0) || [];
      item.selfEffect?.forEach(ef => nEnemy.effect(ef.id, ef.power, ef.duration));
      dmg += item.calcDamage().meleDmg;
      hp += item.healV ?? 0;

      if(dmg > bestResults.bestDmgNum) {
        bestResults.bestDmgMoves = moves;
        bestResults.bestDmgNum = dmg;
      } else if(hp > bestResults.bestHpNum) {
        bestResults.bestHpMoves = moves;
        bestResults.bestHpNum = hp;
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

document.querySelectorAll("#figthEndScreen .fightButton").forEach(button => button.addEventListener("click", () => {
  document.querySelector("#figthEndScreen").classList = "hidden";
  document.querySelector("#roundNumber").textContent = 1;
  const levelEnemies = levels[currentLevel.id]?.enemies ?? [];

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

document.querySelectorAll("#figthEndScreen .backButton").forEach(button => button.addEventListener("click", () => {
  document.querySelector("#figthEndScreen").classList = "hidden";
  document.querySelector("#roundNumber").textContent = 1;
  document.body.classList = "levelMenu";
  currentLevel.enemyRounds = 0;
  player.effects = [];
}));

const numberGridObject = {};
function numberGrid(itemsCount = 2, Turns = 3) {
  const num = Math.min( Math.max(itemsCount, 0), 7 );
  const amount = Math.min( Math.max(Turns, 1), 6 );
  const key = `${num}x${amount}`;
  if(key in numberGridObject) return numberGridObject[key];
  function loop(array, col) {
    const arr = [];
    for(let i = num; --i >= 0;) {
      const copy = array.slice();
      copy[col] = i;
      if(0 !== col) arr.push(...loop(copy, col - 1));
      else arr.push(copy);
    } return arr;
  } return numberGridObject[key] = loop(Array(amount).fill(0), amount - 1);
}

function statsFromEnemiMoves() { // En oo tehny mitään viel
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
}