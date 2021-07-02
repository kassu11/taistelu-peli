const enemies = {
  week_slime: {
    id: "week_slime",
    maxHp: 10,
    maxMp: 30,
    items: [
      {...items["hp_pot"], "amount": 4},
      {...items["weak_stick"]},
    ],
    effects: [
      {id: "Poison", power: 5, duration: 6},
    ],
    drops: [
      {
        "type": "one",
        "chance": 10,
        "items": [
          {"item": items["dmgBooster"], "amount": 1, "chance": 50},
          {"item": items["chestplate"], "chance": 50},
        ]
      },
      {"item": items["hp_pot"], "chance": 100, "amount": [1, 2]}
    ],
    img: "vihu2.png",
    imgTop: 7,
  },
  red_guy: {
    id: "red_guy",
    maxHp: 40,
    maxMp: 10,
    items: [
      items["weak_stick"],
    ],
    drops: [
      {
        "type": "one",
        "chance": 75,
        "items": [
          {"item": items["legs"], "chance": 50},
          {"item": items["chestplate"], "chance": 50},
          {"item": items["helmet"], "chance": 50},
        ]
      },
      {"item": items["dmgBooster"], "chance": 100, "amount": [2, 4]}
    ],
    img: "vihu3.png",
    imgTop: 7,
  },
  octopus: {
    id: "octopus",
    maxHp: 40,
    maxMp: 50,
    items: [
      items["wooden_sword"],
      items["weak_stick"],
      items["dmgBooster"],
    ],
    effects: [
      // {id: "Strength", power: 1, duration: 3},
    ],
    drops: [
      {
        "type": "one",
        "chance": 80,
        "items": [
          {"item": items["legs"], "chance": 50},
          {"item": items["chestplate"], "chance": 50},
          {"item": items["weak_stick"], "chance": 50},
        ]
      },
      {
        "type": "one",
        "chance": 80,
        "items": [
          {"item": items["hp_pot"], "chance": 50},
          {"item": items["weak_stick"], "chance": 50},
          {"item": items["suicideStick"], "chance": 50},
          {"item": items["dmgBooster"], "amount": [7, 5, 6, 10], "chance": 50},
        ]
      },
      {"item": items["helmet"], "chance": 100, "amount": [2, 4]}
    ],
    img: "octopus.png",
    imgTop: 7,
  },
  fish_dude: {
    id: "fish_dude",
    maxHp: 40,
    maxMp: 50,
    items: [
      items["wooden_sword"],
    ],
    drops: [
      {
        "type": "one",
        "chance": 80,
        "items": [
          {"item": items["legs"], "chance": 30},
          {"item": items["chestplate"], "chance": 30},
          {"item": items["helmet"], "chance": 30},
          {
            "type": "all",
            "chance": 10,
            "items": [
              {"item": items["hp_pot"], "amount": [2, 5]},
              {"item": items["dmgBooster"], "amount": [4, 2]},
            ]
          }
        ]
      },
    ],
    img: "enemy4.png",
    imgTop: 7,
  },
  tongue_monster: {
    id: "tongue_monster",
    maxHp: 20,
    maxMp: 10,
    items: [
      items["weak_stick"],
    ],
    effects: [],
    drops: [],
    img: "vihu1.png",
    imgTop: 1,
  },
  devil: {
    id: "devil",
    maxHp: 20,
    maxMp: 10,
    items: [
      items["weak_stick"],
    ],
    img: "hahmo1.png",
  },
}

function Enemy(enemy) {
  this.id = enemy.id;
  this.hp = enemy.hp ?? enemy.maxHp;
  this.maxHp = enemy.maxHp;
  this.mp = enemy.mp ?? enemy.maxMp;
  this.maxMp = enemy.maxMp;
  this.items = enemy.items?.map(item => new Item(item, this)) || [];
  this.img = enemy.img;
  this.imgLeft = enemy.imgLeft;
  this.imgTop = enemy.imgTop;
  this.imgWidth = enemy.imgWidth;
  this.imgHeight = enemy.imgHeight;

  this.drops = dropsFromLootTable(enemy.drops);

  this.effects = enemy.effects?.map(effect => new Effect(effect)) || [];
}

Enemy.prototype.effect = effect;

function dropsFromLootTable(lootTable = []) {
  const items = [];

  lootTable?.forEach(drop => {
    const r = random(1, 100);
    if(r > drop.chance || drop.chance == null) return;
    if(drop?.type == "all") typeAll(drop);
    else if(drop?.type == "one") typeOne(drop);
    else items.push(drop)
  });

  function typeAll(arr) {
    arr.items.forEach(drop => {
      console.log(drop)
      if(drop?.type == "all") typeAll(drop);
      else if(drop?.type == "one") typeOne(drop);
      else items.push(drop);
    });
  }

  function typeOne(arr) {
    const combinedChances = arr.items.map(item => item.chance ?? 0).reduce((acc, v) => [...acc, (acc[acc.length - 1] || 0) + v], []);
    const totalChance = Math.max(...combinedChances);
    const r = random(1, totalChance || 1);
    const index = combinedChances.findIndex(chance => r <= chance);
    const drop = arr.items[index];
    if(drop == null) return;
    else if(drop?.type == "all") typeAll(drop);
    else if(drop?.type == "one") typeOne(drop);
    else items.push(drop);
  }

  return items;
}

// {
//   let tulos = 0;
//   const maxNum = 10000;
  
//   const A = .9
//   const B = .8
//   const C = .5
//   const D = .5
//   const E = .5
  
//   console.log(tulos / maxNum);
  
//   console.log(A + B - A * B);
//   console.log(A + B + C - (A * B) - (A * C) - (B * C) + (A * B * C));
  
//   console.log(
//     (A + B + C + D) - 
//     (A * B) - (A * C) - (A * D) - 
//     (B * C) - (B * D) - 
//     (C * D) +
//     (A * B * C) + (A * B * D) +
//     (A * C * D) +
//     (B * C * D) -
//     (A * B * C * D)
//   );
// }
