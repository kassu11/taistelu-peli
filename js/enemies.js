const enemies = {
  tongue_monster: {
    id: "tongue_monster",
    maxHp: 20,
    maxMp: 10,
    items: [
      items["weak_stick"],
    ],
    img: "vihu1.png",
    imgTop: 1,
  },
  week_slime: {
    id: "week_slime",
    maxHp: 25,
    maxMp: 30,
    items: [
      items["weak_stick"],
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
    img: "vihu3.png",
    imgTop: 7,
  }
}

function Enemy(current) {
  this.id = current.id;
  this.hp = current.maxHp;
  this.maxHp = current.maxHp;
  this.mp = current.maxMp;
  this.maxMp = current.maxMp;
  this.items = current.items?.map(item => new Item(item, this)) || [];
  this.img = current.img;
  this.imgLeft = current.imgLeft;
  this.imgTop = current.imgTop;
  this.imgWidth = current.imgWidth;
  this.imgHeight = current.imgHeight;
}