startLevel("level_1");


function startLevel(lvlId) {
  currentLevel.id = lvlId;
  const selectedLevel = levels[lvlId];
  const currentEnemies = selectedLevel.enemys?.map(name => new Enemy(enemies[name]));
  currentEnemies?.forEach(enemy => addEnemyCard(enemy));
  console.log(currentEnemies);
}

function addEnemyCard(enemy) {
  const box = document.querySelector(".enemyContainer .enemyBox");

  const enemyCard = document.createElement("div");
  enemyCard.classList = "enemyCard";
  enemyCard.innerHTML = `
  <div class="hpBox">
    <div class="hpBG1"></div>
    <div class="hpBG2"></div>
    <div class="hpText">${enemy.hp} HP</div>
  </div>
  <div class="mpBox">
    <div class="mpBG1"></div>
    <div class="mpBG2"></div>
    <div class="mpText">${enemy.mp} MP</div>
  </div>
  <div class="enemyImageBox">
    <img src="${enemy.img ? "./images/" + enemy.img : ''}">
  </div>
  <div class="enemyLvlContainer">
    <div class="lvlBox">
      <p class="lvlText">${enemy.lvl ?? ""}</p>
    </div>
  </div>`

  console.log(enemyCard)

  box.append(enemyCard)

  currentLevel.enemies.set(enemyCard, enemy);
}

document.querySelector(".enemyContainer .enemyBox").addEventListener("click", e => {
  const target = e.target;
  const curItem = player.hotbar[player.currentSlot];
  if(!target.classList.contains("enemyCard") || !curItem.id) return;
  const enemy = currentLevel.enemies.get(target);
  enemy.hp -= curItem.calcDamage().meleDmg;

  playersBattleParciles({x: e.x, y: e.y}, "explosion");

  if(enemy.hp <= 0) removeElement(target, 200);

  target.querySelector(".hpText").textContent = enemy.hp + " HP";
  target.querySelector(".mpText").textContent = enemy.mp + " MP";

  countAllEnemyMoves(2, enemy);
});

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

  console.log(bestResults)
}