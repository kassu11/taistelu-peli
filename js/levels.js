const currentLevel = {
  id: "",
  enemies: new Map(),
  roundNum: 1,
  enemyRounds: 0,
}

const levels = {
  level_1: {
    enemys: ["week_slime"],
    victoryDrop: []
  },
  level_2: {
    enemys: ["red_guy", "tongue_monster"],
    victoryDrop: []
  },
  level_3: {
    enemys: ["week_slime", "week_slime", "week_slime"],
    victoryDrop: []
  },
  level_4: {
    enemys: ["octopus", "red_guy"],
    victoryDrop: []
  },
  level_5: {
    enemys: ["week_slime", "fish_dude", "week_slime"],
    victoryDrop: []
  },
}