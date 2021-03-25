let player = new Player({
  hp: 100,
  mp: 50,
  maxHp: 20,
  maxMp: 50,
  inventory: [
    {...items["stone_sword"], slot: "hotbarSlot1"},
    {...items["hp_pot"], slot: "hotbarSlot2"},
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
  ],
  armor: {
    head: {},
    chest: {},
    legs: {},
  }
});


function Player(arr) {
  this.hp = arr.hp;
  this.mp = arr.mp;
  this.maxHp = arr.maxHp;
  this.maxHpF = () => {
    const extra = Object.values(this.armor).map(v => v?.hp ?? 0).reduce((a, b) => a + b ?? 0, 0);
    return this.maxHp + extra;
  }
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

  this.armor = {
    head: {},
    chest: {},
    legs: {},
  }

  for(const [slot, item] of Object.entries(arr?.armor ?? {})) {
    if(item?.id) this.armor[slot] = new Item(item); 
  }
  

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



