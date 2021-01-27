let player = new Player({
  hp: 100,
  mp: 50,
  maxHp: 100,
  maxMp: 50,
  hotbar: {
    "slot1": items["wooden_sword"],
    "slot2": items["weak_stick"],
    "slot3": {},
    "slot4": {},
    "slot5": {}
  },
  currentSlot: "slot1"
});




function Player(current) {
  this.hp = current.hp;
  this.mp = current.mp;
  this.maxHp = current.maxHp;
  this.maxMp = current.maxMp;

  this.currentSlot = current.currentSlot;

  this.hotbar = {
    "slot1": {},
    "slot2": {},
    "slot3": {},
    "slot4": {},
    "slot5": {}
  };
  
  for(let slotNumber in this.hotbar) {
    const hbar = current.hotbar;
    const curItem = hbar[slotNumber];
    if(curItem?.id) this.hotbar[slotNumber] = new Item(curItem, this);
  }
}