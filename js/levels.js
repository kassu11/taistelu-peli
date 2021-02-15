const currentLevel = {
  id: "",
  enemies: new Map(),
  roundNum: 1,
  enemyRounds: 0,
}

const levels = {
  level_1: {
    enemies: ["week_slime"],
    victoryDrop: []
  },
  level_2: {
    enemies: ["red_guy", "tongue_monster"],
    victoryDrop: []
  },
  level_3: {
    enemies: ["week_slime", "week_slime", "week_slime"],
    victoryDrop: []
  },
  level_4: {
    enemies: ["octopus", "red_guy"],
    victoryDrop: []
  },
  level_5: {
    enemies: ["week_slime", "fish_dude", "week_slime"],
    victoryDrop: []
  },
}

document.querySelector("#inventoryButton").addEventListener("click", e => {
  document.body.classList = "itemsMenu"
});