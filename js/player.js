let player = new Player({
  hp: 100,
  mp: 50,
  maxHp: 100,
  maxMp: 50,
  inventory: [
    {...items["wooden_sword"], slot: "hotbarSlot1"},
    {...items["weak_stick"], slot: "hotbarSlot2"},
    items["dmgBooster"],
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
  currentSlot: "slot1"
});


function Player(arr) {
  this.hp = arr.hp;
  this.mp = arr.mp;
  this.maxHp = arr.maxHp;
  this.maxMp = arr.maxMp;

  this.currentSlot = arr.currentSlot;

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

// hotbarSlot1


