const enemies = {
  tongue_monster: {
    id: "tongue_monster",
    maxHp: 20,
    maxMp: 10,
    items: [
      items["weak_stick"],
    ],
    effects: [
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
    ],
    drop: [
      {item: items["helmet"], chance: .2},
      {item: items["dmgBooster"], chance: .5, amount: [4, 10]},
      [
        {item: items["legs"], chance: .5},
        {item: items["chestplate"], chance: .5},
        {item: items["weak_stick"], chance: .5},
        {type: "empty", chance: .2}
      ]
    ],
    img: "vihu1.png",
    imgTop: 1,
  },
  week_slime: {
    id: "week_slime",
    maxHp: 25,
    maxMp: 30,
    items: [
      items["hp_pot"],
    ],
    drop: [
      [
        {item: items["dmgBooster"], chance: 1, amount: [10, 5, 15]},
      ]
    ],
    img: "vihu2.png",
    imgTop: 7,
  },
  red_guy: {
    id: "red_guy",
    maxHp: 50,
    maxMp: 50,
    items: [
      items["weak_stick"],
    ],
    drop: [
      {item: items["helmet"], chance: .2},
      {item: items["dmgBooster"], chance: .5, amount: [4, 10]},
      [
        {item: items["legs"], chance: .5},
        {item: items["chestplate"], chance: .5},
        {item: items["weak_stick"], chance: .5},
        {type: "empty", chance: .2}
      ]
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
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
      // {id: "Strength", power: 1, duration: 3},
    ],
    drop: [
      {item: items["helmet"], chance: .2},
      {item: items["dmgBooster"], chance: .5, amount: [4, 10]},
      [
        {item: items["legs"], chance: .5},
        {item: items["chestplate"], chance: .5},
        {item: items["weak_stick"], chance: .5},
        {type: "empty", chance: .2}
      ]
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
    drop: [
      {item: items["helmet"], chance: .2},
      {item: items["dmgBooster"], chance: .5, amount: [4, 10]},
      [
        {item: items["legs"], chance: .5},
        {item: items["chestplate"], chance: .5},
        {item: items["weak_stick"], chance: .5},
        {type: "empty", chance: .2}
      ]
    ],
    img: "enemy4.png",
    imgTop: 7,
  }
}

function Enemy(enemy) {
  this.id = enemy.id;
  this.hp = enemy.maxHp;
  this.maxHp = enemy.maxHp;
  this.mp = enemy.maxMp;
  this.maxMp = enemy.maxMp;
  this.items = enemy.items?.map(item => new Item(item, this)) || [];
  this.img = enemy.img;
  this.imgLeft = enemy.imgLeft;
  this.imgTop = enemy.imgTop;
  this.imgWidth = enemy.imgWidth;
  this.imgHeight = enemy.imgHeight;
  
  this.drop = enemy.drop?.map(row => {
    if(row.item) return row;
    else if(row.type != "empty") {
      const chanceIndex = row.map(v => v.chance ?? 0);
      const totalChance = chanceIndex.reduce((chance, value, index) => chanceIndex[index] = chance + value, 0);
      const randomChance = Math.random() * totalChance;
      const selectedItem = row.find((v, index) => randomChance <= chanceIndex[index]);
      return {...selectedItem, chance: 1}
    }
  }) ?? [];

  this.effects = enemy.effects?.map(effect => new Effect(effect)) || [];
}

Enemy.prototype.effect = function(name, power, duration) {
  const effectSlotNumber = this.effects?.findIndex(({id}) => id == name);
  const effectSlot = effectSlotNumber == -1 ? this.effects.length : effectSlotNumber;

  this.effects[effectSlot] = new Effect({id: name, power, duration});
}
