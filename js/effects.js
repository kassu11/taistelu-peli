function Effect(effect) {
  this.id = effect.id;
  this.power = effect.power;
  this.title = `${effect.id} ${effect.power}`;
  this.duration = effect.duration;
  this.effectStatus = effect.effectStatus ?? "good";

  switch(effect.id) {
    case "Strength":
      this.dmgPercentage = .25 * effect.power;
      this.img = "./images/dmgBuff.png"
      break;
    case "Regeneration": {
      const regenArr = [3, 5, 10, 25, 50];
      if(effect.power <= 0) this.regenHP = 3;
      else if(effect.power <= regenArr.length) this.regenHP = regenArr[effect.power - 1];
      else this.regenHP = Math.round((effect.power - 3) ** 2 * 10 / 5) * 5;
      this.img = "./images/miekka1.png";
      break;
    }
  }
}

function giveEffectsToPlAndEn() {
  player.effects.forEach(effect => {
    if(effect.regenHP) player.hp = Math.min(player.maxHpF(), player.hp + effect.regenHP);
  });

  currentLevel.enemies.forEach(enemy => {
    enemy.effects.forEach((effect, card) => {
      if(effect.regenHP) enemy.hp = Math.min(enemy.maxHp, enemy.hp + effect.regenHP);
      updateEnemyCard(card);
    });
  });

  updatePlayerBars();
}