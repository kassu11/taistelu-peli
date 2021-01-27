const items = {
  wooden_sword: {
    id: "wooden_sword",
    name: "Wooden sword",
    minMeleDmg: 10,
    maxMeleDmg: 20,
    useTime: 2,
    image: "miekka1.png"
  },
  stone_sword: {
    id: "stone_sword",
    name: "Stone sword",
    minMeleDmg: 15,
    maxMeleDmg: 25,
    useTime: 3
  },
  weak_stick: {
    id: "weak_stick",
    name: "Weak stick",
    minMeleDmg: 2,
    maxMeleDmg: 4,
    useTime: 1,
    image: "taika.png",
    particle: "explosion"
  }
}

function Item(current, user) {
  const base = items[current.id];
  this.user = user;
  this.id = current.id;
  this.name = current.name;
  this.minMeleDmg = base.minMeleDmg;
  this.maxMeleDmg = base.maxMeleDmg;
  this.useTime = base.useTime;
  this.image = base.image;
  this.particle = base.particle;
}

Item.prototype.calcDamage = function() {
  const minMeleDmg = this.minMeleDmg ?? this.maxMeleDmg ?? 0;
  const maxMeleDmg = this.maxMeleDmg ?? 0;

  return {
    meleDmg: random(minMeleDmg, maxMeleDmg)
  }
}