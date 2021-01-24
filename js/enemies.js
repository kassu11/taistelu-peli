const enemies = {
  week_slime: {
    maxHp: 50,
    maxMp: 50,
    items: [
      items["wooden_sword"],
      items["stone_sword"],
    ],
    img: "vihu3.png",
  }
}

function Enemy(current) {
  this.hp = current.maxHp;
  this.maxHp = current.maxHp;
  this.mp = current.maxMp;
  this.maxMp = current.maxMp;
  this.items = current.items?.map(item => new Item(item, this)) || [];
  this.img = current.img;
}