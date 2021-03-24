const currentLevel = {
  id: "",
  enemies: new Map(),
  roundNum: 1,
  enemyRounds: 0,
  drop: []
}

const levels = {
  level_1: {
    enemies: ["week_slime"]
  },
  level_2: {
    enemies: ["red_guy", "tongue_monster"]
  },
  level_3: {
    enemies: ["week_slime", "week_slime", "week_slime"]
  },
  level_4: {
    enemies: ["octopus", "red_guy"]
  },
  level_5: {
    enemies: ["week_slime", "fish_dude", "week_slime"]
  },
}

document.querySelector("#inventoryButton").addEventListener("click", e => {
  document.body.classList = "itemsMenu";
  generateItemsOnGrid(player.inventory.slice());
});