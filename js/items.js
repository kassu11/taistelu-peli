const items = {
  wooden_sword: {
    id: "wooden_sword",
    name: "Wooden sword",
    minMeleDmg: 10,
    maxMeleDmg: 20,
  },
  stone_sword: {
    id: "stone_sword",
    name: "Stone sword",
    minMeleDmg: 15,
    maxMeleDmg: 25,
  }
}

function Item(current, user) {
  const base = items[current.id];
  this.user = user;
  this.id = current.id;
  this.name = current.name;
  this.minMeleDmg = base.minMeleDmg;
  this.maxMeleDmg = base.maxMeleDmg;
}

Item.prototype.calcDamage = function() {
  const minMeleDmg = this.minMeleDmg ?? this.maxMeleDmg ?? 0;
  const maxMeleDmg = this.maxMeleDmg ?? 0;

  return {
    meleDmg: random(minMeleDmg, maxMeleDmg)
  }
}