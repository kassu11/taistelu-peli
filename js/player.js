let player = new Player({
  hp: 100,
  mp: 50,
  maxHp: 100,
  maxMp: 50,
  inventory: [
    {...items["wooden_sword"], slot: "hotbarSlot4"},
    {...items["weak_stick"], slot: "hotbarSlot2"},
    {...items["dmgBooster"], slot: "hotbarSlot1"},
    {...items["stone_sword"], slot: "hotbarSlot3"},
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
    items["stone_sword"],
    items["weak_stick"],
    items["dmgBooster"],
    items["wooden_sword"],
  ],
  currentSlot: "slot1",
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
    // {id: "Strength", power: 1, duration: 3},
    // {id: "Strength", power: 1, duration: 3},
    // {id: "Strength", power: 1, duration: 3},
    // {id: "Strength", power: 1, duration: 3},
    // {id: "Strength", power: 1, duration: 3},
    // {id: "Strength", power: 1, duration: 3},
    // {id: "Strength", power: 1, duration: 3},
    // {id: "Strength", power: 1, duration: 3},
  ]
});


function Player(arr) {
  this.hp = arr.hp;
  this.mp = arr.mp;
  this.maxHp = arr.maxHp;
  this.maxMp = arr.maxMp;

  this.currentSlot = arr.currentSlot;

  this.effects = arr.effects?.map(effect => new Effect(effect)) || [];

  this.hotbar = {
    "slot1": {},
    "slot2": {},
    "slot3": {},
    "slot4": {},
    "slot5": {}
  };

  this.inventory = arr.inventory?.map(item => {
    const nItem = new Item(item, this);
    const slot = nItem.slot ?? "";
    if(slot.startsWith("hotbarSlot")) this.hotbar["slot" + slot.substr(10)] = nItem;
    return nItem;
  }) ?? [];
}


Player.prototype.effect = function(name, power, duration) {
  const effectSlotNumber = this.effects?.findIndex(({id}) => id == name);
  const effectSlot = effectSlotNumber == -1 ? this.effects.length : effectSlotNumber;

  this.effects[effectSlot] = new Effect({id: name, power, duration});
}
// hotbarSlot1


