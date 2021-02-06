let player = new Player({
  hp: 100,
  mp: 50,
  maxHp: 100,
  maxMp: 50,
  hotbar: {
    "slot1": items["wooden_sword"],
    "slot2": items["weak_stick"],
    "slot3": items["stone_sword"],
    "slot4": {},
    "slot5": {}
  },
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
  
  for(let slotNumber in this.hotbar) {
    const hbar = arr.hotbar;
    const curItem = hbar[slotNumber];
    if(curItem?.id) this.hotbar[slotNumber] = new Item(curItem, this);
  }
}